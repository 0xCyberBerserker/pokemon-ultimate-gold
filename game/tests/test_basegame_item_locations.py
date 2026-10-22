import copy
import json
import unittest
from pathlib import Path

from tools.basegame_item_locations import (
    PINNED_COMPARE_SHA256,
    STATIC_EVENT_STATUS,
    STATIC_HELD_STATUS,
    apply_basegame_locations,
)

ROOT = Path(__file__).resolve().parents[1]


class BasegameLocationsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.reference_path = ROOT / "docs/basegame-item-locations.json"
        cls.report_bytes = (ROOT / "docs/qa-item-basegame-compare-batch1.json").read_bytes()
        cls.report = json.loads(cls.report_bytes)
        cls.production_reference = json.loads(cls.reference_path.read_text(encoding="utf-8"))
        cls.production_data = json.loads((ROOT / "docs/wiki-data.json").read_text(encoding="utf-8"))

    def setUp(self):
        self.shop = {"location": {"id": "shop-4"}, "status": "verified_target_shop_stock"}
        self.data = {"target_sha256": "target", "items": {"412": {"acquisition": [
            {"location": {"id": "unchanged-from-heartgold"}}, self.shop]}}}
        self.row = {"location": {"id": "hgss-viridian", "name": {"en": "Viridian City", "es": "Ciudad Verde"}},
                    "method": {"en": "Talk to the man.", "es": "Habla con el hombre."},
                    "status": "documented_base_game", "source": {"title": "WikiDex", "author_reference": "https://www.wikidex.net/wiki/MT085"}}
        self.reference = {"schema": "ultimate-gold-basegame-locations/v1", "target_sha256": "target",
                          "items": {"412": {"replace_unchanged_placeholder": True, "acquisition": [self.row]}}}

    def test_reference_replaces_placeholder_without_losing_rom_shop(self):
        apply_basegame_locations(self.data, self.reference)
        rows = self.data["items"]["412"]["acquisition"]
        self.assertEqual(rows, [self.shop, self.row])
        self.assertEqual(rows[1]["status"], "documented_base_game")

    def test_repeated_merge_is_idempotent(self):
        apply_basegame_locations(self.data, self.reference)
        first = copy.deepcopy(self.data)
        apply_basegame_locations(self.data, self.reference)
        self.assertEqual(self.data, first)

    def test_wrong_target_or_unknown_item_rejected(self):
        for change in ("target", "item"):
            with self.subTest(change=change):
                reference = copy.deepcopy(self.reference)
                if change == "target":
                    reference["target_sha256"] = "other"
                else:
                    reference["items"]["999"] = reference["items"].pop("412")
                with self.assertRaises(ValueError):
                    apply_basegame_locations(self.data, reference)

    def test_reference_cannot_claim_target_verification(self):
        self.row["status"] = "verified_target"
        with self.assertRaises(ValueError):
            apply_basegame_locations(self.data, self.reference)

    def test_missing_translation_rejected_before_changing_data(self):
        del self.row["method"]["es"]
        before = copy.deepcopy(self.data)
        with self.assertRaises(ValueError):
            apply_basegame_locations(self.data, self.reference)
        self.assertEqual(self.data, before)

    def test_pinned_static_comparisons_merge_without_changing_shop_or_pending_pearl(self):
        data = copy.deepcopy(self.production_data)
        apply_basegame_locations(data, self.production_reference, self.report, self.report_bytes)
        self.assertEqual(data["basegame_location_reference"]["comparison_report_sha256"], PINNED_COMPARE_SHA256)
        for item_id in ("412", "414", "415"):
            rows = data["items"][item_id]["acquisition"]
            self.assertIn(STATIC_EVENT_STATUS, [row["status"] for row in rows])
        item414 = data["items"]["414"]["acquisition"]
        self.assertIn("verified_target_shop_stock", [row["status"] for row in item414])
        item88 = data["items"]["88"]["acquisition"]
        self.assertIn("documented_base_game", [row["status"] for row in item88])
        self.assertIn(STATIC_HELD_STATUS, [row["status"] for row in item88])
        for item_id in ("87", "88", "89", "90"):
            self.assertIn(STATIC_HELD_STATUS, [row["status"] for row in data["items"][item_id]["acquisition"]])

    def test_static_claim_rejects_report_bytes_or_rom_hash_drift(self):
        for change in ("bytes", "base", "target"):
            with self.subTest(change=change):
                reference = copy.deepcopy(self.production_reference)
                report_bytes = self.report_bytes
                if change == "bytes":
                    report_bytes += b" "
                elif change == "base":
                    reference["comparison_evidence"]["base_rom_sha256"] = "0" * 64
                else:
                    reference["comparison_evidence"]["target_sha256"] = "0" * 64
                with self.assertRaises(ValueError):
                    apply_basegame_locations(copy.deepcopy(self.production_data), reference,
                                             self.report, report_bytes)

    def test_static_status_without_report_proof_is_rejected(self):
        reference = copy.deepcopy(self.production_reference)
        reference["items"]["412"]["acquisition"][0]["evidence"]["proof"]["item_id"] = 415
        with self.assertRaises(ValueError):
            apply_basegame_locations(copy.deepcopy(self.production_data), reference,
                                     self.report, self.report_bytes)
        with self.assertRaises(ValueError):
            apply_basegame_locations(copy.deepcopy(self.production_data), reference)

    def test_held_item_claim_must_match_report_species_and_both_rom_slots(self):
        reference = copy.deepcopy(self.production_reference)
        held = next(row for row in reference["items"]["88"]["acquisition"]
                    if row["status"] == STATIC_HELD_STATUS)
        held["evidence"]["proof"]["species_ids"] = [46]
        with self.assertRaises(ValueError):
            apply_basegame_locations(copy.deepcopy(self.production_data), reference,
                                     self.report, self.report_bytes)


if __name__ == "__main__":
    unittest.main()
