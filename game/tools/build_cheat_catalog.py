#!/usr/bin/env python3
"""Build a searchable, source-pinned AR catalog with exact-target static checks."""
from __future__ import annotations

import argparse
from collections import Counter
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE_SHA = "c0a0f0710060271c652577866806491125b2a7d82d40c3b4c46348b7e7a002fe"
TARGETS = {
    "6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132",
    "24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6",
}
CATEGORIES = {
    "system": {"en": "System and speed", "es": "Sistema y velocidad"},
    "player": {"en": "Player and progression", "es": "Jugador y progreso"},
    "party": {"en": "Party and training", "es": "Equipo y entrenamiento"},
    "battle": {"en": "Battles and capture", "es": "Combates y captura"},
    "wild": {"en": "Wild encounters", "es": "Encuentros salvajes"},
    "appearance": {"en": "Appearance and lists", "es": "Apariencia y listas"},
    "bag": {"en": "Bag and gifts", "es": "Bolsa y regalos"},
}
TITLES = {
    "Cattura i Pokémon degli Allenatori": ("Catch trainer-owned Pokémon", "Capturar Pokémon de entrenadores"),
    "Cattura garantita": ("Guaranteed capture", "Captura garantizada"),
    "PP infiniti": ("Infinite PP", "PP infinitos"),
    "PS infiniti": ("Infinite HP", "PS infinitos"),
    "Gli Allenatori non ti fermano": ("Trainers do not stop you", "Los entrenadores no te detienen"),
    "Affronta di nuovo gli Allenatori": ("Rematch trainers", "Volver a combatir con entrenadores"),
    "Fuggi dalla lotta": ("Run from battle", "Huir del combate"),
    "Sconfiggi con un solo colpo": ("One-hit knockouts", "Debilitar de un golpe"),
    "Pokérus": ("Pokérus", "Pokérus"),
    "Fast text": ("Fast text", "Texto rápido"),
    "Fast transitions": ("Fast transitions", "Transiciones rápidas"),
    "Fast healing": ("Fast healing", "Curación rápida"),
    "Hide 3D outlines": ("Hide 3D outlines", "Ocultar contornos 3D"),
    "Choose Pokémon and level": ("Choose Pokémon and level", "Elegir Pokémon y nivel"),
    "Testo rapido": ("Fast text", "Texto rápido"),
    "Barre PS ed esperienza immediate": ("Instant HP and EXP bars", "Barras de PS y experiencia instantáneas"),
    "Tutti gli strumenti ×999": ("All items ×999", "Todos los objetos ×999"),
    "Tutte le medicine ×999": ("All medicine ×999", "Todas las medicinas ×999"),
    "READ ME - how to use this folder": ("Read before using this folder", "Lee las instrucciones de esta categoría"),
}
KEYS = [(1, "A"), (2, "B"), (4, "Select"), (8, "Start"), (16, "Right"),
        (32, "Left"), (64, "Up"), (128, "Down"), (256, "R"), (512, "L")]


def category(number):
    return "system" if number < 10 else "player" if number < 20 else "party" if number < 30 else "battle" if number < 40 else "wild" if number < 60 else "appearance" if number < 80 else "bag"


def format_code(value):
    words = value.upper().split()
    if not words or len(words) % 2 or any(not re.fullmatch(r"[0-9A-F]{8}", word) for word in words):
        raise ValueError("Malformed Action Replay code")
    return "\n".join(" ".join(words[index:index + 2]) for index in range(0, len(words), 2))


def build(source, target, auditor):
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    target_hash = hashlib.sha256(target.read_bytes()).hexdigest()
    if source_hash != SOURCE_SHA or target_hash not in TARGETS:
        raise ValueError("Unverified catalog source or target ROM hash")
    spec = importlib.util.spec_from_file_location("upstream_cheat_audit", auditor)
    audit = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(audit)
    sections = audit.rom_sections(target)
    entries, folders = [], []
    root = ET.parse(source).getroot()
    for folder in root.iter("folder"):
        original_folder = folder.findtext("name", "")
        number = int(original_folder.split()[0])
        group = category(number)
        folder_id = f"{number:02}"
        folders.append({"id": folder_id, "category": group, "source_title": original_folder})
        for index, cheat in enumerate(folder.findall("cheat"), 1):
            original_title = cheat.findtext("name", "")
            raw = " ".join(cheat.findtext("codes", "").upper().split())
            code = format_code(raw)
            inspected = audit.analyze_cheat({"name": original_title, "codes": raw, "folders": [original_folder]}, sections)
            guards = inspected["equality_guards"]
            mismatches = [g for g in guards if g["status"] == "no_source_match"]
            status = "syntax_issue" if inspected["issues"] else "guard_mismatch" if mismatches else "static_only"
            title = TITLES.get(original_title, (original_title, original_title))
            activation = []
            instructions, _ = audit.decode(raw)
            for instruction in instructions:
                if instruction["a"] == 0x94000130 and instruction["b"] & 0xFFFF == 0:
                    mask = (~(instruction["b"] >> 16)) & 0x3FF
                    buttons = "+".join(label for bit, label in KEYS if mask & bit)
                    if buttons and buttons not in activation:
                        activation.append(buttons)
            entries.append({
                "id": f"{folder_id}-{index:03}", "category": group, "folder": folder_id,
                "title": dict(zip(("en", "es"), title)), "source_title": original_title,
                "title_localized": original_title in TITLES, "code": code,
                "source_note": cheat.findtext("note", ""),
                "activation_buttons": activation, "status": status,
                "syntax_issues": inspected["issues"],
                "guard_mismatches": [{"address": g["address"], "expected": g["expected"]} for g in mismatches],
                "guard_counts": dict(Counter(g["status"] for g in guards)),
                "effect_runtime": "NOT_TESTED", "capture_persistence": "NOT_TESTED",
                "informational": original_title.startswith("READ ME"),
                "requires_custom_wrapper": "requires melonds" in cheat.findtext("note", "").lower(),
            })
    if len(entries) != 2110 or len(folders) != 67:
        raise ValueError("Catalog count differs from the pinned source")
    return {
        "schema": "ultimate-gold-cheats/v1", "target_sha256": target_hash,
        "source": {"title": "Sacred Gold Plus 1.2.3 EN Action Replay catalog",
                   "url": "https://github.com/Umberto-DEV/sacred-gold-plus", "sha256": source_hash,
                   "upstream_commit": "5b90a788ac3c7d1e4733b4d175a97811cc6745a3",
                   "audit_tool_sha256": hashlib.sha256(auditor.read_bytes()).hexdigest()},
        "categories": CATEGORIES, "folders": folders, "entries": entries,
        "summary": dict(Counter(entry["status"] for entry in entries)),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--target", type=Path, required=True)
    parser.add_argument("--auditor", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=ROOT / "docs/cheat-catalog.json")
    args = parser.parse_args()
    data = build(args.source, args.target, args.auditor)
    args.output.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(json.dumps({"entries": len(data["entries"]), "folders": len(data["folders"]), "static_checks": data["summary"]}))


if __name__ == "__main__":
    main()
