#!/usr/bin/env python3
"""Build a derived base-stat comparison from the pinned clean and Alpha 2 ROMs."""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "docs"))
from generate_species_table import Rom, narc

BASELINE_SHA256 = "65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105"
TARGET_SHA256 = "24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6"
PERSONAL_PATH = "a/0/0/2"
STAT_ORDER = ["hp", "attack", "defense", "speed", "special_attack", "special_defense"]
WEB_DISPLAY_ORDER = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def classify_stats(before: list[int], after: list[int]) -> dict:
    if len(before) != 6 or len(after) != 6 or any(type(value) is not int for value in before + after):
        raise ValueError("Each species must have six integer base stats")
    delta = [new - old for old, new in zip(before, after)]
    before_total, after_total = sum(before), sum(after)
    status = ("unchanged" if not any(delta) else
              "boosted" if after_total > before_total else
              "lower_total" if after_total < before_total else "redistributed")
    return {
        "baseline_stats": before,
        "target_stats": after,
        "delta": delta,
        "baseline_total": before_total,
        "target_total": after_total,
        "total_delta": after_total - before_total,
        "status": status,
        "increased_stat_indices": [index for index, value in enumerate(delta) if value > 0],
        "decreased_stat_indices": [index for index, value in enumerate(delta) if value < 0],
    }


def read_personal_records(path: Path, expected_sha256: str) -> list[bytes]:
    actual = sha256(path)
    if actual != expected_sha256:
        raise ValueError(f"Unexpected ROM SHA-256: {actual}")
    records = narc(Rom(path).file(PERSONAL_PATH))
    if len(records) != 508 or any(len(record) != 44 for record in records):
        raise ValueError("Personal NARC layout does not match the pinned HGSS records")
    return records


def build_comparison(baseline_path: Path, target_path: Path) -> dict:
    baseline_records = read_personal_records(baseline_path, BASELINE_SHA256)
    target_records = read_personal_records(target_path, TARGET_SHA256)
    species = []
    for species_id in range(1, 494):
        before = list(baseline_records[species_id][:6])
        after = list(target_records[species_id][:6])
        species.append({"id": species_id, **classify_stats(before, after)})

    counts = {status: sum(row["status"] == status for row in species)
              for status in ("boosted", "redistributed", "lower_total", "unchanged")}
    return {
        "schema": "ultimate-gold-heartgold-stat-comparison/v1",
        "scope": "National Dex species 1..493; base stats only.",
        "sources": {
            "baseline": {"label": "Clean HeartGold USA", "sha256": BASELINE_SHA256},
            "target": {"label": "Ultimate Gold Alpha 2 FIX6a", "sha256": TARGET_SHA256},
        },
        "record_layout": {
            "path": PERSONAL_PATH,
            "records": len(target_records),
            "record_size": 44,
            "base_stat_offsets": [0, 1, 2, 3, 4, 5],
            "base_stat_order": STAT_ORDER,
            "wiki_display_order": WEB_DISPLAY_ORDER,
        },
        "criterion": {
            "boosted": "Target base-stat total is higher than clean HeartGold.",
            "redistributed": "At least one base stat changed but the total is unchanged; excluded from the boosted filter.",
            "lower_total": "Target base-stat total is lower; excluded from the boosted filter.",
            "unchanged": "All six base stats match.",
            "excluded_claims": "Type, ability, and move changes are not automatically classified as improvements.",
        },
        "counts": counts,
        "species": species,
    }


def validate_comparison(comparison: dict) -> None:
    if comparison.get("schema") != "ultimate-gold-heartgold-stat-comparison/v1":
        raise ValueError("Unsupported species stat comparison schema")
    sources = comparison.get("sources", {})
    if (sources.get("baseline", {}).get("sha256") != BASELINE_SHA256
            or sources.get("target", {}).get("sha256") != TARGET_SHA256):
        raise ValueError("Species stat comparison ROM pins do not match")
    layout = comparison.get("record_layout", {})
    if (layout.get("path") != PERSONAL_PATH or layout.get("records") != 508
            or layout.get("record_size") != 44 or layout.get("base_stat_offsets") != [0, 1, 2, 3, 4, 5]
            or layout.get("base_stat_order") != STAT_ORDER
            or layout.get("wiki_display_order") != WEB_DISPLAY_ORDER):
        raise ValueError("Species stat comparison record layout does not match")
    species = comparison.get("species", [])
    if [row.get("id") for row in species] != list(range(1, 494)):
        raise ValueError("Species stat comparison must contain National Dex IDs 1..493 once")
    counts = {status: 0 for status in ("boosted", "redistributed", "lower_total", "unchanged")}
    for row in species:
        expected = classify_stats(row.get("baseline_stats", []), row.get("target_stats", []))
        if any(row.get(key) != value for key, value in expected.items()):
            raise ValueError(f"Species stat comparison classification is invalid for #{row['id']}")
        counts[expected["status"]] += 1
    if comparison.get("counts") != counts:
        raise ValueError("Species stat comparison counts do not match its rows")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline", type=Path, required=True, help="exact clean HeartGold USA ROM")
    parser.add_argument("--target", type=Path, required=True, help="exact Ultimate Gold Alpha 2 FIX6a ROM")
    parser.add_argument("--output", type=Path, default=ROOT / "docs/species-stat-comparison.json")
    args = parser.parse_args()
    comparison = build_comparison(args.baseline, args.target)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(comparison, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"species": len(comparison["species"]), "counts": comparison["counts"]}))


if __name__ == "__main__":
    main()
