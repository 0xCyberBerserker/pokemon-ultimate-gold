#!/usr/bin/env python3
"""Derive fixed money-shop inventories, prices and map links from a verified ROM."""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import struct
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "docs"))
from generate_mod_tables import Rom, narc

TARGETS = {
    "fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e",
    "6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132",
}
SHOP_POINTER_TABLE = 0x10FA3C
SHOP_COUNT = 30
MAP_TABLE = 0xF6BE0
ITEM_MAP = 0x100194
ITEM_EVOLUTIONS = {6, 7, 16, 17, 18, 19}


def mapped_reader(arm9: bytes):
    """Resolve initialized HGSS ARM9 autoload sections, including relocated stock."""
    if len(arm9) < 0xBC4:
        raise ValueError("Truncated ARM9 module settings")
    table_start, table_end, data_start, _, _, compressed, _, magic1, magic2 = struct.unpack_from("<9I", arm9, 0xBA0)
    if compressed or (magic1, magic2) != (0xDEC00621, 0x2106C0DE):
        raise ValueError("Unexpected ARM9 compression or module signature")
    base = 0x02000000
    begin, end, cursor = table_start - base, table_end - base, data_start - base
    if not 0xBC4 <= cursor <= begin <= end <= len(arm9) or (end - begin) % 12:
        raise ValueError("Invalid autoload table bounds")
    segments = [(base, 0, cursor)]
    for pos in range(begin, end, 12):
        address, size, _bss = struct.unpack_from("<3I", arm9, pos)
        if cursor + size > begin:
            raise ValueError("Autoload data overlaps its table")
        if size:
            if any(address < old + length and old < address + size for old, _, length in segments):
                raise ValueError("Overlapping initialized ARM9 sections")
            segments.append((address, cursor, size))
        cursor += size

    def read(address, size):
        matches = [(offset + address - start) for start, offset, length in segments
                   if start <= address and address + size <= start + length]
        if size <= 0 or len(matches) != 1:
            raise ValueError("Shop address is outside initialized ARM9 sections")
        return arm9[matches[0]:matches[0] + size]
    return read


def inventory(arm9: bytes, pointer: int, reader=None) -> list[int]:
    offset = pointer - 0x02000000
    if pointer & 1 or (reader is None and not 0 <= offset <= len(arm9) - 2):
        raise ValueError("Shop inventory pointer is outside the static ARM9 image")
    result = []
    for index in range(64):
        pos = offset + index * 2
        if reader is None and pos + 2 > len(arm9):
            break
        item = struct.unpack("<H", reader(pointer + index * 2, 2))[0] if reader else struct.unpack_from("<H", arm9, pos)[0]
        if item == 0xFFFF:
            return result
        if not 1 <= item <= 536 or item in result:
            raise ValueError("Invalid or duplicate fixed-shop item")
        result.append(item)
    raise ValueError("Fixed-shop list has no bounded terminator")


def map_label(constant: str) -> dict[str, str]:
    english = constant.removeprefix("MAP_").replace("_", " ").title()
    english = re.sub(r"\b(\d+)([Fb])\b", lambda m: m[1] + m[2].upper(), english)
    spanish = english
    for en, es in {
        "Goldenrod Department Store": "Centro Comercial de Ciudad Trigal",
        "Blackthorn Pokemart": "Tienda de Ciudad Endrino",
        "Frontier Access Pokemart": "Tienda de la entrada del Frente Batalla",
        "Goldenrod": "Ciudad Trigal", "Blackthorn": "Ciudad Endrino",
        "Celadon": "Ciudad Azulona", "Vermilion": "Ciudad Carmín",
        "Viridian": "Ciudad Verde", "Pewter": "Ciudad Plateada",
        "Cerulean": "Ciudad Celeste", "Lavender": "Pueblo Lavanda",
        "Olivine": "Ciudad Olivo", "Cianwood": "Ciudad Orquídea",
        "Ecruteak": "Ciudad Iris", "Azalea": "Pueblo Azalea",
        "Mahogany": "Pueblo Caoba", "Violet": "Ciudad Malva",
        "Cherrygrove": "Ciudad Cerezo", "Pokemart": "Tienda",
        "Route ": "Ruta ",
    }.items():
        spanish = spanish.replace(en, es)
    return {"en": english, "es": spanish}


def build(target: Path, decoder: Path, commands: Path, maps: Path) -> dict:
    digest = hashlib.sha256(target.read_bytes()).hexdigest()
    if digest not in TARGETS:
        raise ValueError("Unverified target hash for shop extraction")
    rom = Rom(target)
    offset, size = struct.unpack_from("<I", rom.data, 0x20)[0], struct.unpack_from("<I", rom.data, 0x2C)[0]
    arm9 = rom.data[offset:offset + size]
    read_arm9 = mapped_reader(arm9)
    spec = importlib.util.spec_from_file_location("shop_script_decoder", decoder)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    decoded = module.disassembla_tutto(narc(rom.file("a/0/1/2")), module.Comandi(commands))
    map_names = {int(number): constant for constant, number in re.findall(r"^#define\s+(MAP_\w+)\s+(\d+)\b", maps.read_text(), re.MULTILINE) if constant != "MAP_ID_MAX"}
    script_maps = {}
    for map_id, constant in map_names.items():
        script = struct.unpack_from("<H", arm9, MAP_TABLE + map_id * 24 + 6)[0]
        script_maps.setdefault(script, []).append({"id": map_id, "constant": constant, "name": map_label(constant)})
    locations = {i: [] for i in range(SHOP_COUNT)}
    unresolved = []
    for script in decoded:
        previous = None
        for instruction in sorted(script.istruzioni.values(), key=lambda value: value.off):
            if instruction.nome == "CallStd" and instruction.args == [2052]:
                if previous and previous.nome == "SetVar" and previous.args[0] == 0x8004 and previous.fine == instruction.off and 0 <= previous.args[1] < SHOP_COUNT:
                    locations[previous.args[1]].append({"script_member": script.indice, "script_offset": instruction.off, "maps": script_maps.get(script.indice, []), "status": "verified_target_script"})
                else:
                    unresolved.append({"script_member": script.indice, "script_offset": instruction.off})
            previous = instruction
    wiki = json.loads((ROOT / "docs/wiki-data.json").read_text(encoding="utf-8"))
    records = narc(rom.file("a/0/1/7"))
    shops = []
    for index in range(SHOP_COUNT):
        pointer = struct.unpack_from("<I", arm9, SHOP_POINTER_TABLE + index * 4)[0]
        items = []
        for item_id in inventory(arm9, pointer, read_arm9):
            member = struct.unpack_from("<H", arm9, ITEM_MAP + item_id * 8)[0]
            price = struct.unpack_from("<H", records[member])[0]
            items.append({"id": item_id, "name": wiki["items"].get(str(item_id), {}).get("name", {"en": str(item_id), "es": str(item_id)}), "price": price, "item_data_member": member})
        shops.append({"id": index, "inventory_pointer": f"0x{pointer:08X}", "items": items, "locations": locations[index], "runtime_purchase": "NOT_TESTED"})
    required = sorted({e["param"] for species in wiki["species"] for e in species["evolutions"] if e["method"] in ITEM_EVOLUTIONS})
    sold = {entry["id"] for shop in shops if shop["locations"] for entry in shop["items"]}
    return {"schema": "ultimate-gold-fixed-shops/v1", "target_sha256": digest, "shops": shops,
            "evolution_item_ids": required, "evolution_items_in_fixed_money_shops": sorted(set(required) & sold),
            "evolution_items_not_in_fixed_money_shops": sorted(set(required) - sold), "unresolved_special_mart_calls": unresolved,
            "sources": {"pointer_table": "ARM9 + 0x10FA3C, 30 entries", "stock": "Terminated target ARM9 lists", "prices": "Target item map and a/0/1/7 records", "maps": "Target map headers +0xF6BE0, 24-byte records; source constants for display names", "script": "Contiguous literal SetVar 0x8004 then CallStd 2052; dynamic paths excluded", "decoder_sha256": hashlib.sha256(decoder.read_bytes()).hexdigest(), "commands_sha256": hashlib.sha256(commands.read_bytes()).hexdigest(), "scope": "Fixed money shops only; badge-tier stock, point exchanges and runtime reachability are separate."}}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", type=Path, required=True)
    parser.add_argument("--decoder", type=Path, required=True)
    parser.add_argument("--commands", type=Path, required=True)
    parser.add_argument("--maps", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=ROOT / "docs/shop-locations.json")
    args = parser.parse_args()
    data = build(args.target, args.decoder, args.commands, args.maps)
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"shops": len(data["shops"]), "locations": sum(len(s["locations"]) for s in data["shops"]), "evolution_items_sold": data["evolution_items_in_fixed_money_shops"], "missing_count": len(data["evolution_items_not_in_fixed_money_shops"])}))


if __name__ == "__main__":
    main()
