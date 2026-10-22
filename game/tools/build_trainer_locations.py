#!/usr/bin/env python3
"""Build trainer-to-map evidence from literal trainer_battle script commands.

The optional decoder paths point to the checked-out local decompilation; no private analyzer is
imported. Variable/rematch paths are deliberately emitted as unverified.
"""
from __future__ import annotations
import argparse, hashlib, importlib.util, json, struct
import re
from pathlib import Path

TARGET_SHA = "fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e"

def event_trainer_locations(rom, event_to_maps):
    """Resolve standard NPC trainer scripts: std_trainer(id) => id+2999, std_trainer_2 => id+4999."""
    import ndspy.narc
    members = ndspy.narc.NARC(rom.files[rom.filenames.idOf("a/0/3/2")]).files
    found: dict[int, set[int]] = {}
    for event_id, raw in enumerate(members):
        if len(raw) < 4:
            continue
        pos = 4 + struct.unpack_from("<I", raw, 0)[0] * 20
        if pos + 4 > len(raw):
            continue
        count = struct.unpack_from("<I", raw, pos)[0]; pos += 4
        for _ in range(count):
            if pos + 32 > len(raw):
                break
            values = struct.unpack_from("<10H2h2Hl", raw, pos); pos += 32
            script_id = values[5]
            if 3000 <= script_id < 3737:
                trainer_id = script_id - 2999
            elif 5000 <= script_id < 5737:
                trainer_id = script_id - 4999
            else:
                continue
            found.setdefault(trainer_id, set()).update(event_to_maps.get(event_id, ()))
    return found

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--target", type=Path, required=True)
    p.add_argument("--trainers-json", type=Path, default=Path("docs/trainers-all-final.json"))
    p.add_argument("--scr-disasm", type=Path, required=True)
    p.add_argument("--scrcmd-json", type=Path, required=True)
    p.add_argument("--mapname-bin", type=Path, required=True)
    p.add_argument("--output", type=Path, default=Path("docs/trainer-locations.json"))
    a = p.parse_args()
    h = hashlib.sha256(a.target.read_bytes()).hexdigest()
    if h != TARGET_SHA:
        raise SystemExit(f"target SHA mismatch: {h}")
    try:
        import ndspy.narc, ndspy.rom
    except ImportError as exc:
        raise SystemExit("ndspy is required from the existing local build environment") from exc
    spec = importlib.util.spec_from_file_location("trainer_scr_disasm", a.scr_disasm)
    mod = importlib.util.module_from_spec(spec); assert spec.loader; spec.loader.exec_module(mod)
    rom = ndspy.rom.NintendoDSRom.fromFile(str(a.target))
    raw_names = a.mapname_bin.read_bytes()
    names = [raw_names[i:i + 16].decode(errors="replace").split("\0")[0] for i in range(0, len(raw_names), 16)]
    script_to_maps: dict[int, list[tuple[int, str]]] = {}
    event_to_maps: dict[int, list[int]] = {}
    map_sections: dict[int, int] = {}
    for map_id in range(540):
        h0 = 0xF6BE0 + map_id * 0x18
        header = rom.arm9[h0:h0 + 0x18]
        if len(header) < 0x18: continue
        script_id = struct.unpack_from("<H", header, 6)[0]
        script_to_maps.setdefault(script_id, []).append((map_id, names[map_id] if map_id < len(names) else f"MAP_{map_id}"))
        event_id = struct.unpack_from("<H", header, 0x10)[0]
        event_to_maps.setdefault(event_id, []).append(map_id)
        map_sections[map_id] = header[0x12]  # MapHeader.mapsec is an 8-bit bit-field.
    script_file = rom.files[rom.filenames.idOf("a/0/1/2")]
    members = ndspy.narc.NARC(script_file).files
    commands = mod.Comandi(a.scrcmd_json)
    decoded = mod.disassembla_tutto(members, commands)
    found: dict[int, set[tuple[int, str]]] = {}
    for member in decoded:
        for ins in member.istruzioni.values():
            if ins.op == 213 and ins.args and ins.tipi[0] == "trainer":
                found.setdefault(ins.args[0], set()).update(script_to_maps.get(member.indice, []))
            elif ins.op == 562 and ins.args:
                for value, kind in zip(ins.args[:3], ins.tipi[:3]):
                    if kind == "trainer":
                        found.setdefault(value, set()).update(script_to_maps.get(member.indice, []))
    ids = sorted({r["trainer_id"] for r in json.loads(a.trainers_json.read_text(encoding="utf-8"))["records"]})
    event_found = event_trainer_locations(rom, event_to_maps)
    trainers = {}
    for trainer_id in ids:
        locations = [{"id": m, "name": {"en": n, "es": n}, "status": "source_map_code", "evidence": "literal_script", "map_section": map_sections.get(m)} for m, n in sorted(found.get(trainer_id, set()))]
        for m in sorted(event_found.get(trainer_id, set())):
            n = names[m] if m < len(names) else f"MAP_{m}"
            locations.append({"id": m, "name": {"en": n, "es": n}, "status": "source_map_code", "evidence": "std_trainer_object_event", "map_section": map_sections.get(m)})
        locations = sorted({(x["id"], x["evidence"]): x for x in locations}.values(), key=lambda x: (x["id"], x["evidence"]))
        header = ndspy.narc.NARC(rom.files[rom.filenames.idOf("a/0/5/5")]).files[trainer_id]
        class_id = header[1] if len(header) > 1 else None
        portrait = {"src": f"web/sprites/trainers/{class_id:03d}.png", "source": "hg-engine trainer_gfx extracted local source", "class_id": class_id} if class_id is not None else None
        trainers[str(trainer_id)] = {"locations": locations, "portrait": portrait, "trainer_class_id": class_id, "status": "confirmed_script_or_std_event_location" if locations else "unverified_no_literal_trainerbattle"}
    result = {"schema": "sacred-gold-trainer-locations/v1", "target_sha256": h, "trainers": trainers, "sources": {"script_narc": "a/0/1/2", "script_opcodes": {"213": "TrainerBattle", "562": "MultiBattle"}, "event_narc": "a/0/3/2", "event_std_trainer": "object event scriptId: trainer+2999 (std_trainer) or trainer+4999 (std_trainer_2)", "map_headers": "ARM9 vanilla table offset 0xF6BE0, 0x18-byte entries", "map_section": "target map header +0x12, lower 9 bits", "map_names": str(a.mapname_bin), "trainer_class": "a/0/5/5 byte 1", "rematches": "variable/script-managed trainer IDs remain unverified", "portrait_join": "trainer header byte 1 -> trainer_gfx/{class_id:03d}.png", "runtime": "NOT_RUN"}}
    a.output.parent.mkdir(parents=True, exist_ok=True); a.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(a.output)
    return 0
if __name__ == "__main__": raise SystemExit(main())
