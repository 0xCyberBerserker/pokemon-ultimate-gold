#!/usr/bin/env python3
"""Cross-match the credited adventure-order reference with exact ROM rosters."""
from __future__ import annotations

import argparse
from collections import defaultdict
import hashlib
import json
from pathlib import Path
import re
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
SOURCE_SHA = "bc6bef8b1009bfb93a565e0e95ee5296925efd883bee2a110fe588ebdef70d05"
PLACES = {
    "Cherrygrove City": "Ciudad Cerezo", "Sprout Tower": "Torre Bellsprout",
    "Ruins of Alph": "Ruinas Alfa", "Violet City": "Ciudad Malva",
    "Union Cave": "Cueva Unión", "Slowpoke Well": "Pozo Slowpoke",
    "Azalea Town": "Pueblo Azalea", "Goldenrod Tunnel": "Subterráneo de Trigal",
    "Goldenrod City": "Ciudad Trigal", "National Park": "Parque Nacional",
    "Burned Tower": "Torre Quemada", "Ecruteak City": "Ciudad Iris",
    "Olivine Lighthouse": "Faro de Olivo", "Olivine City": "Ciudad Olivo",
    "Cianwood City": "Ciudad Orquídea", "Cliff Edge Gate": "Paso Acantilado",
    "Cliff Cave": "Cueva Acantilado", "Safari Zone Gate": "Entrada a la Zona Safari",
    "Mt. Mortar": "Monte Mortero", "Team Rocket HQ": "Guarida Rocket",
    "Mahogany Town": "Pueblo Caoba", "Radio Tower": "Torre Radio",
    "Blackthorn City": "Ciudad Endrino", "Dragon's Den": "Guarida Dragón",
    "Victory Road": "Calle Victoria", "Pokemon League": "Liga Pokémon",
    "S.S. Aqua": "S.S. Aqua", "Pewter City": "Ciudad Plateada", "Mt. Moon": "Monte Moon",
    "Cerulean City": "Ciudad Celeste", "Vermilion City": "Ciudad Carmín",
    "Fuchsia City": "Ciudad Fucsia", "Celadon City": "Ciudad Azulona",
    "Saffron City": "Ciudad Azafrán", "Seafoam Islands": "Islas Espuma",
    "Viridian City": "Ciudad Verde", "Viridian Forest": "Bosque Verde",
    "Mt. Silver Cave": "Cueva del Monte Plateado", "Cerulean Cave": "Cueva Celeste",
}


def normalize(value):
    value = value.replace("♀", "female").replace("♂", "male")
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]", "", value.lower())


def localized_place(value):
    spanish = value
    for english, translated in sorted(PLACES.items(), key=lambda pair: -len(pair[0])):
        spanish = spanish.replace(english, translated)
    for english, translated in {"Route ": "Ruta ", " Gym": " · Gimnasio", " Dojo": " · Dojo",
                                "First Voyage": "Primer viaje", "North": "Norte", "South": "Sur",
                                "East": "Este", "West": "Oeste", " to ": " a "}.items():
        spanish = spanish.replace(english, translated)
    return {"en": value.replace("Pokemon", "Pokémon"), "es": spanish}


def roster_match(candidates, label):
    """Use source names to resolve duplicate rosters, never numeric trainer ID order."""
    named = [trainer for trainer in candidates if normalize(trainer["name"]["en"]) in normalize(label)
             or ("rival" in normalize(label) and "rival" in normalize(trainer["class_name"]["en"]))]
    return named if named else candidates


def parse_roster(text, species):
    """Accept reference punctuation without inventing omitted levels."""
    roster = []
    for segment in re.split(r",\s+(?!\d)|(?<=\d)\.\s+(?=[A-Z])", text.strip()):
        match = re.search(r"\s+Lv\s*[.,]?\s*(\d+)", segment, re.IGNORECASE)
        name = segment[:match.start()] if match else segment
        name = re.sub(r"\([^)]*\)", "", name).strip()
        roster.append((species.get(normalize(name)), int(match[1]) if match else None))
    return roster


def build(source, wiki):
    if hashlib.sha256(source.read_bytes()).hexdigest() != SOURCE_SHA:
        raise ValueError("Unexpected trainer-order source hash")
    lines = source.read_text(encoding="utf-8").splitlines()
    species = {normalize(entry["name"]["en"]): entry["id"] for entry in wiki["species"]}
    # Explicit spelling corrections in this pinned transcription; not new species.
    species.update(chikarita=152, tailow=276, hercross=214)
    exact, species_only = defaultdict(list), defaultdict(list)
    for trainer in wiki["trainers"]:
        exact[tuple(sorted((member["species_id"], member["level"]) for member in trainer["members"]))].append(trainer)
        species_only[tuple(sorted(member["species_id"] for member in trainer["members"]))].append(trainer)
    stages, records, unresolved = [], {}, []
    stage, rematch = None, False
    for index, line in enumerate(lines):
        if index > 20 and index + 1 < len(lines) and line.strip() and lines[index + 1].strip().startswith("===="):
            stage = {"id": f"stage-{len(stages) + 1:02}", "order": len(stages),
                     "name": localized_place(line.strip()), "source_line": index + 1,
                     "region": "johto" if index + 1 < 901 else "kanto"}
            stages.append(stage)
            rematch = False
        if line.strip() == "Rematches":
            rematch = True
        pieces = re.split(r"\s{2,}", line.strip(), maxsplit=1)
        if stage is None or len(pieces) != 2 or not re.search(r"\bLv\s*[.,]?\s*\d+", pieces[1], re.IGNORECASE):
            continue
        roster = parse_roster(pieces[1], species)
        if not roster or any(ident is None for ident, _ in roster):
            unresolved.append({"line": index + 1, "reason": "unresolved_species"})
            continue
        complete_levels = all(level is not None for _, level in roster)
        candidates = roster_match(exact[tuple(sorted(roster))], pieces[0]) if complete_levels else []
        match_kind = "name_and_exact_species_levels"
        if len(candidates) != 1:
            alternatives = roster_match(species_only[tuple(sorted(ident for ident, _ in roster))], pieces[0])
            if len(alternatives) == 1:
                candidates = alternatives
                match_kind = ("name_and_species_with_documented_level_discrepancy" if complete_levels
                              else "name_and_species_with_incomplete_reference_levels")
        if len(candidates) != 1:
            unresolved.append({"line": index + 1, "reason": "ambiguous_or_different_roster", "candidates": len(candidates)})
            continue
        trainer = candidates[0]
        key = str(trainer["id"])
        if key in records:
            raise ValueError("A trainer was matched to multiple source rows")
        records[key] = {"stage_id": stage["id"], "stage_order": stage["order"],
                        "order": index + 1, "source_line": index + 1, "source_label": pieces[0],
                        "kind": "rematch" if rematch or "Dojo" in stage["name"]["en"] else "first_visit",
                        "match": match_kind, "status": "documented_recommended_order"}
    return {"schema": "ultimate-gold-trainer-journey/v1", "target_sha256": wiki["target_sha256"],
            "source": {"title": "SS/SG Trainer Pokémon v1.05", "credit": "JD48096761; trainer content by Drayano",
                       "sha256": SOURCE_SHA, "scope": "Order reference only; teams and levels always come from the exact target ROM. Optional routes and Kanto allow different paths."},
            "stages": stages, "trainers": records, "unresolved_rows": unresolved,
            "unmatched_trainer_ids": [trainer["id"] for trainer in wiki["trainers"] if str(trainer["id"]) not in records]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=ROOT / "docs/trainer-journey.json")
    args = parser.parse_args()
    wiki = json.loads((ROOT / "docs/wiki-data.json").read_text(encoding="utf-8"))
    data = build(args.source, wiki)
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"stages": len(data["stages"]), "ordered_trainers": len(data["trainers"]),
                      "unmatched_trainers": len(data["unmatched_trainer_ids"]), "unresolved_rows": len(data["unresolved_rows"])}))


if __name__ == "__main__":
    main()
