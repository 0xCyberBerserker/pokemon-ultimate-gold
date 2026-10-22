import json
import hashlib
import unittest
from pathlib import Path

from tools.build_species_stat_comparison import classify_stats, validate_comparison
from tools.build_wiki_data import load_species_stat_comparison

ROOT = Path(__file__).resolve().parents[1]


class SpeciesStatComparisonTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / "docs/species-stat-comparison.json").read_text(encoding="utf-8"))
        cls.rows = {row["id"]: row for row in cls.data["species"]}

    def test_dataset_pins_both_roms_and_all_species(self):
        self.assertEqual(hashlib.sha256((ROOT / "docs/species-stat-comparison.json").read_bytes()).hexdigest(),
                         "f2d3431d8c85a2aaf2558809891a2964cd15b97a1552aeb55dc1e6325630ebed")
        self.assertEqual(self.data["sources"]["baseline"]["sha256"],
                         "65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105")
        self.assertEqual(self.data["sources"]["target"]["sha256"],
                         "24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6")
        self.assertEqual(set(self.rows), set(range(1, 494)))
        self.assertEqual(self.data["counts"], {
            "boosted": 97, "redistributed": 1, "lower_total": 0, "unchanged": 395,
        })
        validate_comparison(self.data)

    def test_comparison_is_bound_to_wiki_stats_and_has_negative_guard(self):
        species_doc = json.loads((ROOT / "docs/species-493.json").read_text(encoding="utf-8"))
        comparison = load_species_stat_comparison(
            "24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6", species_doc)
        self.assertEqual(comparison["counts"]["boosted"], 97)
        tampered = json.loads(json.dumps(self.data))
        tampered["species"][165]["delta"][4] += 1
        with self.assertRaises(ValueError):
            validate_comparison(tampered)
        changed_species = json.loads(json.dumps(species_doc))
        changed_species["species"][165]["base_stats"][4] += 1
        with self.assertRaises(ValueError):
            load_species_stat_comparison(
                "24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6", changed_species)

    def test_generated_wiki_payload_exposes_only_changed_comparisons(self):
        wiki = json.loads((ROOT / "docs/wiki-data.json").read_text(encoding="utf-8"))
        counts = wiki["species_stat_comparison"]["counts"]
        self.assertEqual(counts["boosted"] + counts["redistributed"], 98)
        self.assertEqual(counts["unchanged"], 395)
        self.assertEqual(sum(counts.values()), 493)
        rows = {row["id"]: row for row in wiki["species"]}
        self.assertEqual(rows[166]["stat_comparison"]["delta"], [0, 60, 0, 0, -20, 0])
        self.assertEqual(rows[136]["stat_comparison"]["status"], "redistributed")
        self.assertNotIn("stat_comparison", rows[1])

    def test_classification_requires_higher_total_and_marks_tradeoffs(self):
        flareon = self.rows[136]
        self.assertEqual(flareon["status"], "redistributed")
        self.assertEqual(flareon["total_delta"], 0)
        self.assertEqual(self.rows[166]["status"], "boosted")
        self.assertEqual(self.rows[166]["delta"], [0, 60, 0, 0, -20, 0])
        self.assertEqual(self.rows[166]["decreased_stat_indices"], [4])
        tradeoffs = [row for row in self.rows.values()
                     if row["status"] == "boosted" and row["decreased_stat_indices"]]
        self.assertEqual({row["id"] for row in tradeoffs}, {166, 313, 314, 362})
        self.assertEqual(classify_stats([100, 100, 100, 100, 100, 100],
                                        [99, 100, 100, 100, 100, 100])["status"], "lower_total")

    def test_source_and_display_stat_orders_are_explicit(self):
        layout = self.data["record_layout"]
        self.assertEqual(layout["base_stat_order"],
                         ["hp", "attack", "defense", "speed", "special_attack", "special_defense"])
        self.assertEqual(layout["wiki_display_order"],
                         ["hp", "attack", "defense", "special_attack", "special_defense", "speed"])


if __name__ == "__main__":
    unittest.main()
