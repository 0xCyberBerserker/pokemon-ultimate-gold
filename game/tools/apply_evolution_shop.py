#!/usr/bin/env python3
"""Stage evolution-shop QoL in an already allocated Ultimate Gold reserve.

Run with the existing isolated ndspy environment. This does not create a reserve,
change item prices, publish a ROM, or imply runtime purchase acceptance.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import struct

import ndspy.narc
import ndspy.rom

ROOT = Path(__file__).resolve().parents[1]
TABLE = 0x0210FA3C
STOCK_ID = 4
OLD_POINTER = 0x020FBC1A
OLD_STOCK = [4, 3, 2, 78, 63, 79, 76, 77, 82, 83, 84, 85]
RESERVE = 0x023D7000
DESTINATION = 0x023D7C00
CAPACITY = 240


def sha(data):
    return hashlib.sha256(data).hexdigest()


def section_at(code, address, size):
    matches = [s for s in code.sections if s.ramAddress <= address
               and address + size <= s.ramAddress + len(s.data)]
    if len(matches) != 1:
        raise ValueError(f"Address 0x{address:08X} is not mapped uniquely")
    return matches[0]


def read(code, address, size):
    section = section_at(code, address, size)
    offset = address - section.ramAddress
    return bytes(section.data[offset:offset + size])


def write(code, address, data):
    section = section_at(code, address, len(data))
    offset = address - section.ramAddress
    updated = bytearray(section.data)
    updated[offset:offset + len(data)] = data
    section.data = updated


def stock(code, pointer):
    values = []
    for index in range(64):
        value, = struct.unpack("<H", read(code, pointer + index * 2, 2))
        if value == 0xFFFF:
            return values
        if not 1 <= value <= 536 or value in values:
            raise ValueError("Invalid or duplicate stock item")
        values.append(value)
    raise ValueError("Unterminated stock")


def compare_sections(before, after, allowed):
    if len(before.sections) != len(after.sections):
        raise ValueError("Section count changed during the shop-only patch")
    changed = []
    for old, new in zip(before.sections, after.sections):
        if (old.ramAddress, old.bssSize, old.implicit, len(old.data)) != (
                new.ramAddress, new.bssSize, new.implicit, len(new.data)):
            raise ValueError("Existing section layout changed")
        for offset, (a, b) in enumerate(zip(old.data, new.data)):
            address = old.ramAddress + offset
            if a != b:
                if not any(start <= address < end for start, end in allowed):
                    raise ValueError(f"Undeclared ARM9 change at 0x{address:08X}")
                changed.append(address)
    return changed


def build(source, expected_hash, output, report):
    source, output = source.resolve(), output.resolve()
    if output == source or output.exists() or report.exists():
        raise ValueError("Use new output and report paths; existing artifacts are preserved")
    if output.is_relative_to(ROOT):
        raise ValueError("ROM output must remain outside the repository")
    raw = source.read_bytes()
    if sha(raw) != expected_hash:
        raise ValueError("Input ROM SHA-256 mismatch")
    rom = ndspy.rom.NintendoDSRom(raw)
    original = rom.loadArm9()
    code = rom.loadArm9()
    reserve = section_at(code, RESERVE, 4096)
    if reserve.ramAddress != RESERVE or len(reserve.data) != 4096 or reserve.bssSize:
        raise ValueError("The registered additive 4 KiB reserve is missing")
    if read(code, 0x020D2BB0, 4) != struct.pack("<I", RESERVE):
        raise ValueError("Arena high does not protect the allocated reserve")
    stamps = {
        RESERVE: b"UG-LOW-GUARD-v1\0".ljust(32, b"\xA5"),
        0x023D7020: struct.pack("<8I", 0x31524755, 1, RESERVE, 4096, 0x023D7100, 2816, DESTINATION, 256),
        0x023D7BF0: b"UG-HM-CANARY-v1\0",
        0x023D7CF0: b"UG-SHOP-CANARY1\0",
        0x023D7F00: b"UG-HIGH-GUARD-v1\0".ljust(32, b"\x5A"),
    }
    if any(read(code, address, len(value)) != value for address, value in stamps.items()):
        raise ValueError("Registered reserve metadata or canary differs")
    if any(read(code, DESTINATION, CAPACITY)):
        raise ValueError("Evolution-shop data block is not empty")
    pointer_address = TABLE + STOCK_ID * 4
    if read(code, pointer_address, 4) != struct.pack("<I", OLD_POINTER):
        raise ValueError("Goldenrod stock pointer preimage changed")
    if stock(code, OLD_POINTER) != OLD_STOCK:
        raise ValueError("Goldenrod stock preimage changed")
    document = json.loads((ROOT / "docs/shop-locations.json").read_text(encoding="utf-8"))
    needed = document["evolution_item_ids"]
    missing = document["evolution_items_not_in_fixed_money_shops"]
    if len(needed) != 29 or len(missing) != 22 or len(set(needed)) != 29:
        raise ValueError("Unexpected evolution-item extraction")
    new_stock = OLD_STOCK + [item for item in missing if item not in OLD_STOCK]
    blob = struct.pack(f"<{len(new_stock) + 1}H", *new_stock, 0xFFFF)
    if len(blob) > CAPACITY:
        raise ValueError("Evolution stock exceeds its allocated data block")
    item_records = ndspy.narc.NARC(rom.getFileByName("a/0/1/7")).files
    prices = {}
    for item in needed:
        member, = struct.unpack("<H", read(code, 0x02100194 + item * 8, 2))
        price, = struct.unpack_from("<H", item_records[member])
        if not price:
            raise ValueError(f"Evolution item {item} has a zero price")
        prices[str(item)] = price
    write(code, DESTINATION, blob)
    write(code, pointer_address, struct.pack("<I", DESTINATION))
    allowed = [(DESTINATION, DESTINATION + len(blob)), (pointer_address, pointer_address + 4)]
    rom.arm9 = code.save(compress=False)
    output.parent.mkdir(parents=True, exist_ok=True)
    staged = output.with_suffix(".staged.nds")
    if staged.exists():
        raise ValueError("Staged output already exists")
    try:
        rom.saveToFile(str(staged))
        result = ndspy.rom.NintendoDSRom.fromFile(str(staged))
        readback = result.loadArm9()
        changed = compare_sections(original, readback, allowed)
        if result.files != rom.files or result.arm7 != rom.arm7:
            raise ValueError("Filesystem or ARM7 changed")
        if result.arm9OverlayTable != rom.arm9OverlayTable or result.arm7OverlayTable != rom.arm7OverlayTable:
            raise ValueError("Overlay table changed")
        if stock(readback, DESTINATION) != new_stock or stock(readback, OLD_POINTER) != OLD_STOCK:
            raise ValueError("New or preserved stock failed read-back")
        if read(readback, pointer_address, 4) != struct.pack("<I", DESTINATION):
            raise ValueError("Stock pointer failed read-back")
        covered = set(new_stock) | set(document["evolution_items_in_fixed_money_shops"])
        if not set(needed) <= covered:
            raise ValueError("An evolution item remains unavailable in fixed stock")
        staged.replace(output)
    finally:
        if staged.exists():
            staged.unlink()
    evidence = {
        "schema": "ultimate-gold-evolution-shop-build/v1", "status": "STATIC_PASS_RUNTIME_PENDING",
        "input_sha256": expected_hash, "output_sha256": sha(output.read_bytes()),
        "stock_id": STOCK_ID, "old_stock_preserved": OLD_STOCK,
        "new_stock": new_stock, "added": missing, "data_address": hex(DESTINATION),
        "data_bytes": len(blob), "changed_arm9_bytes": len(changed),
        "all_evolution_items_in_fixed_stock": len(needed), "native_prices_unchanged": prices,
        "filesystem_arm7_and_overlay_tables": "IDENTICAL",
        "runtime_purchase": "NOT_TESTED", "battery_save_recovery": "NOT_TESTED",
    }
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return evidence


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--input-sha256", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()
    evidence = build(args.input, args.input_sha256, args.output, args.report)
    print(json.dumps({key: evidence[key] for key in ("status", "output_sha256", "added", "data_bytes")}))


if __name__ == "__main__":
    main()
