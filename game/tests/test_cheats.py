"""Check complete catalog data, exact-target binding and honest acceptance labels."""
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("cheat_builder", ROOT / "tools/build_cheat_catalog.py")
BUILDER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(BUILDER)


class CheatCatalogTests(unittest.TestCase):
    def test_catalog_is_complete_and_matches_download_target(self):
        data = json.loads((ROOT / "docs/cheat-catalog.json").read_text())
        manifest = json.loads((ROOT / "patches/manifest.json").read_text())
        self.assertEqual(data["target_sha256"], manifest["target"]["sha256"])
        self.assertEqual(len(data["entries"]), 2110)
        self.assertEqual(len(data["folders"]), 67)
        self.assertEqual(len({entry["id"] for entry in data["entries"]}), 2110)
        self.assertEqual({entry["category"] for entry in data["entries"]}, set(data["categories"]))
        for entry in data["entries"]:
            self.assertEqual(BUILDER.format_code(entry["code"]), entry["code"])
            self.assertEqual(entry["effect_runtime"], "NOT_TESTED")
            self.assertEqual(entry["capture_persistence"], "NOT_TESTED")
            self.assertEqual(entry["status"] == "guard_mismatch", bool(entry["guard_mismatches"]))
        capture = next(entry for entry in data["entries"] if entry["id"] == "30-004")
        self.assertEqual(capture["title"]["es"], "Capturar Pokémon de entrenadores")
        self.assertEqual(capture["code"], "9224670A 00002101\n1224670A 00002100\nD2000000 00000000")
        self.assertTrue(any(entry["requires_custom_wrapper"] for entry in data["entries"]))

    def test_partial_or_malformed_codes_are_rejected(self):
        for code in ["", "D2000000", "ZZ000000 00000000", "0000 00000000"]:
            with self.assertRaises(ValueError):
                BUILDER.format_code(code)


if __name__ == "__main__":
    unittest.main()
