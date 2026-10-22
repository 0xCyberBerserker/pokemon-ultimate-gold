#!/usr/bin/env python3
"""Extract the exact Alpha 1 NDS item-icon cells into local PNG assets."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import struct
import subprocess
import tempfile
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "docs"))
from generate_mod_tables import Rom, narc

TARGET_SHA256 = "6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132"
ARCHIVE_PATH = "a/0/1/8"
CELL_MEMBER = 1
ITEMS = {
    113: {"name": {"en": "TM Refill", "es": "Recarga MT"}, "mapping": "ITEM_UNUSED_113", "ncgr": 793, "nclr": 794},
    433: {"name": {"en": "Woodland Ore", "es": "Mineral Bosque"}, "mapping": "ITEM_JOURNAL", "ncgr": 606, "nclr": 607},
    436: {"name": {"en": "Serenade Orb", "es": "Orbe Serenata"}, "mapping": "ITEM_SEAL_BAG", "ncgr": 673, "nclr": 674},
    438: {"name": {"en": "Aubade Orb", "es": "Orbe Alba"}, "mapping": "ITEM_WORKS_KEY", "ncgr": 644, "nclr": 645},
    439: {"name": {"en": "Chilled Ore", "es": "Mineral Gélido"}, "mapping": "ITEM_OLD_CHARM", "ncgr": 604, "nclr": 605},
    454: {"name": {"en": "Voltaic Ore", "es": "Mineral Voltaico"}, "mapping": "ITEM_MEMBER_CARD", "ncgr": 608, "nclr": 609},
    467: {"name": {"en": "Covenant Orb", "es": "Orbe Pacto"}, "mapping": "ITEM_SECRET_KEY", "ncgr": 705, "nclr": 706},
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def png_dimensions(data: bytes) -> tuple[int, int]:
    if data[:8] != b"\x89PNG\r\n\x1a\n" or data[12:16] != b"IHDR":
        raise ValueError("NitroGfx output is not a PNG")
    return struct.unpack_from(">II", data, 16)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", type=Path, required=True)
    parser.add_argument("--nitrogfx", type=Path, required=True, help="Built upstream pokeheartgold NitroGfx executable")
    parser.add_argument("--output-dir", type=Path, default=ROOT / "web/sprites/items")
    parser.add_argument("--manifest", type=Path, default=ROOT / "docs/item-icon-evidence.json")
    args = parser.parse_args()

    target_bytes = args.target.read_bytes()
    target_sha = sha256(target_bytes)
    if target_sha != TARGET_SHA256:
        raise SystemExit(f"unexpected Alpha 1 ROM SHA-256: {target_sha}")
    if not args.nitrogfx.is_file():
        raise SystemExit("upstream NitroGfx executable not found")

    rom = Rom(args.target)
    archive = rom.file(ARCHIVE_PATH)
    members = narc(archive)
    if len(members) != 797 or members[CELL_MEMBER][:4] != b"RECN":
        raise SystemExit("item-icon NARC shape or cell resource differs from the verified target")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    args.manifest.parent.mkdir(parents=True, exist_ok=True)

    manifest = {
        "schema": "ultimate-gold-item-icon-evidence/v1",
        "target_sha256": target_sha,
        "archive": {"path": ARCHIVE_PATH, "sha256": sha256(archive), "members": len(members)},
        "cell": {"member": CELL_MEMBER, "sha256": sha256(members[CELL_MEMBER])},
        "mapping_source": "night-sprint/engine/upstream/pokeheartgold/src/item.c",
        "converter": "upstream pokeheartgold/tools/nitrogfx: NCGR + NCLR + shared NCER cell, 4bpp object transparency",
        "items": {},
    }

    with tempfile.TemporaryDirectory(prefix="ultimate-gold-icons-") as tmp:
        temp = Path(tmp)
        cell_path = temp / "item_icon.NCER"
        cell_path.write_bytes(members[CELL_MEMBER])
        for item_id, spec in ITEMS.items():
            ncgr = members[spec["ncgr"]]
            nclr = members[spec["nclr"]]
            if ncgr[:4] != b"RGCN" or nclr[:4] != b"RLCN":
                raise SystemExit(f"invalid icon member pair for item {item_id}")
            ncgr_path = temp / f"{item_id}.NCGR"
            nclr_path = temp / f"{item_id}.NCLR"
            output_path = args.output_dir / f"{item_id}.png"
            ncgr_path.write_bytes(ncgr)
            nclr_path.write_bytes(nclr)
            subprocess.run([
                str(args.nitrogfx.resolve()), str(ncgr_path), str(output_path),
                "-palette", str(nclr_path), "-cell", str(cell_path), "-object",
            ], check=True)
            png = output_path.read_bytes()
            if png_dimensions(png) != (32, 32):
                raise SystemExit(f"unexpected icon dimensions for item {item_id}: {png_dimensions(png)}")
            manifest["items"][str(item_id)] = {
                **spec,
                "asset_status": "rom_placeholder" if item_id == 113 else "rom_extracted",
                "ncgr_sha256": sha256(ncgr),
                "nclr_sha256": sha256(nclr),
                "asset": f"web/sprites/items/{item_id}.png",
                "sprite": f"../sprites/items/{item_id}.png",
                "png_sha256": sha256(png),
                "dimensions": [32, 32],
            }

    args.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "target_sha256": target_sha,
        "archive_sha256": manifest["archive"]["sha256"],
        "items": {ident: row["png_sha256"] for ident, row in manifest["items"].items()},
        "manifest": str(args.manifest),
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
