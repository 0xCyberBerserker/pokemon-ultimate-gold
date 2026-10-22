#!/usr/bin/env python3
"""Generate a factual 493-row comparison; source exports are read-only inputs."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).parent


def main():
    target = json.loads((OUT / "species-493.json").read_text(encoding="utf-8"))["species"]
    original_doc = json.loads((ROOT / "night-sprint/data/DRAYANO_PERSONAL-export.json").read_text(encoding="utf-8"))
    original = {r["national_id"]: r for r in original_doc["species"]}
    rows = []
    for row in target:
        old = original[row["national_id"]]["records"]["original_1_05"]
        changes = []
        if row["base_stats"] != old["stats"]: changes.append("base_stats")
        if row["types"] != old["types"]: changes.append("types")
        if row["abilities"] != old["abilities"]: changes.append("abilities")
        rows.append({
            "national_id": row["national_id"], "name": row["name"],
            "original_stats": old["stats"], "target_stats": row["base_stats"],
            "original_types": old["types"], "target_types": row["types"],
            "original_abilities": old["abilities"], "target_abilities": row["abilities"],
            "changed_fields": changes,
        })
    assert len(rows) == 493 and len({r["national_id"] for r in rows}) == 493
    metadata = {
        "schema": "sacred-gold-dr ayano-crosscheck/v1".replace(" ", ""),
        "scope": "National Dex 1..493 only",
        "online_original_spreadsheet": "NOT_FOUND_IN_SUPPLIED_OFFICIAL_SOURCES",
        "sources": {
            "target": {"path": "project/docs/species-493.json", "sha256": "fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e"},
            "original_v1_05_rom": {"path": "evidence/drayano-speedup/SacredGold-105-control.nds", "sha256": "49f29848878406990ea288f26872d4355c92c4a2677f56973750bbf2566c13c1"},
            "original_export": {"path": "night-sprint/data/DRAYANO_PERSONAL-export.json", "schema": original_doc["schema"]},
        },
        "crossed_fields": ["base_stats", "types", "abilities"],
        "moves": "NO_COMMON_NORMALIZED_SOURCE_SCHEMA",
        "trainers": "NO_COMMON_NORMALIZED_SOURCE_SCHEMA",
        "counts": {"species": 493, "changed_stats": sum("base_stats" in r["changed_fields"] for r in rows), "changed_types": sum("types" in r["changed_fields"] for r in rows), "changed_abilities": sum("abilities" in r["changed_fields"] for r in rows)},
        "rows": rows,
    }
    (OUT / "drayano-derived-493.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (OUT / "drayano-derived-493.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["national_id", "name", "original_stats", "target_stats", "original_types", "target_types", "original_abilities", "target_abilities", "changed_fields"])
        writer.writeheader()
        for r in rows:
            writer.writerow({**r, **{k: ",".join(map(str, r[k])) for k in ("original_stats", "target_stats", "original_types", "target_types", "original_abilities", "target_abilities")}, "changed_fields": ",".join(r["changed_fields"])})


if __name__ == "__main__":
    main()
