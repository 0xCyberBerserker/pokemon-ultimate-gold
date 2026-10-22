"""Semantic checks for ROM-derived data and localized reference joins."""
import importlib.util
import json
from pathlib import Path
import struct
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("wiki_builder", ROOT / "tools/build_wiki_data.py")
BUILDER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(BUILDER)


class WikiDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / "docs/wiki-data.json").read_text(encoding="utf-8"))

    def test_reused_ids_use_target_names_and_matching_translations(self):
        moves, items = self.data["moves"], self.data["items"]
        self.assertEqual(moves["27"]["name"], {"en": "Disarm Voice", "es": "Voz Cautivadora"})
        self.assertEqual(moves["33"]["name"]["en"], "Tackle")
        self.assertEqual(items["467"]["name"]["es"], "Orbe Pacto")
        self.assertEqual(items["467"]["sprite"], "../sprites/items/467.png")

    def test_tmhm_descriptions_follow_the_real_move(self):
        items, moves = self.data["items"], self.data["moves"]
        tm85 = items["412"]
        self.assertEqual(tm85["move_id"], 138)
        self.assertEqual(tm85["description"]["es"], moves["138"]["description"]["es"])
        for item_id in (328, 412, 420, 427):
            item = items[str(item_id)]
            self.assertEqual(item["description"]["es"], moves[str(item["move_id"])] ["description"]["es"])
        self.assertEqual(BUILDER.tmhm_description({"en": "Original", "es": "wrong"}, {"en": "Move", "es": "Movimiento"}),
                         {"en": "Original", "es": "Movimiento"})
        self.assertEqual(BUILDER.tmhm_description({"en": "Original", "es": "wrong"}, {"en": "Move"}),
                         {"en": "Original", "es": "No hay traducción española disponible para este movimiento."})

    def test_item_spanish_flavors_follow_the_canonical_version(self):
        items = self.data["items"]
        self.assertEqual(items["458"]["description"]["en"],
                         "A stone formed when boulders melted in intensely hot magma, then hardened. Magma remains sealed inside.")
        self.assertEqual(items["458"]["description"]["es"],
                         "Formada a partir de magma enfriado y endurecido. Aún hay magma líquido en su interior.")
        self.assertEqual(items["536"]["description"]["es"],
                         "Esfera cristalina encontrada bajo tierra. A pesar de estar cubierta de roca y tierra, su belleza es increíble.")
        with tempfile.NamedTemporaryFile("w", suffix=".csv", encoding="utf-8") as fixture:
            fixture.write("item_id,language_id,version_group_id,flavor_text\n1,7,15,Wrong\n1,7,17,Correct\n")
            fixture.flush()
            selected = BUILDER.reference_flavors(Path(fixture.name), "item_id", (10, 17, 18, 19, 20))
        self.assertEqual(selected[1]["es"], "Correct")

    def test_item_spanish_flavors_keep_hgss_mechanics(self):
        items = self.data["items"]
        for item_id, amount in ((25, "200"), (26, "50"), (30, "50"), (31, "60"), (32, "80")):
            self.assertIn(amount + " PS", items[str(item_id)]["description"]["es"])
            self.assertIn(amount + " points", items[str(item_id)]["description"]["en"])
        self.assertNotIn("mucho", items["57"]["description"]["es"].casefold())
        self.assertEqual(items["57"]["description"]["en"],
                         "An item that raises the Attack stat of a Pokémon in battle. It wears off if the Pokémon is withdrawn.")
        self.assertEqual(items["58"]["reference_id"], 58)
        self.assertEqual(items["58"]["name"]["es"], "Defensa X")
        self.assertIn("Defensa", items["58"]["description"]["es"])
        self.assertEqual(items["61"]["reference_id"], 61)
        self.assertEqual(items["61"]["name"]["es"], "At. Especial X")
        self.assertIn("Ataque Especial", items["61"]["description"]["es"])
        for item_id in (156, 159, 160, 161, 162, 163):
            self.assertIn("confus", items[str(item_id)]["description"]["es"].casefold())
        self.assertIn("menos", items["68"]["description"]["es"])
        self.assertIn("más", items["69"]["description"]["es"])
        exp_share = items["216"]["description"]
        self.assertIn("The holder gets a share", exp_share["en"])
        self.assertIn("El Pokémon que lo lleva", exp_share["es"])
        self.assertNotIn("todo el equipo", exp_share["es"])
        self.assertIn("Ataque Especial", items["225"]["description"]["es"])
        self.assertIn("Pueblo Caoba", items["504"]["description"]["es"])
        for item_id, reference_id in ((22, 22), (259, 236), (471, 465), (486, 460), (487, 459),
                                      (488, 461), (489, 462), (490, 463), (491, 464)):
            self.assertEqual(items[str(item_id)]["reference_id"], reference_id)
            self.assertIn("en", items[str(item_id)]["description"])
            self.assertIn("es", items[str(item_id)]["description"])
        self.assertIn("campo verde", items["137"]["description"]["es"])

    def test_target_custom_item_icons_and_acquisition_evidence(self):
        manifest = json.loads((ROOT / "patches/manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(self.data["target_sha256"], manifest["target"]["sha256"])
        alpha2 = self.data["target_sha256"] == BUILDER.ALPHA2_TARGET_SHA
        items = self.data["items"]
        for ident in (433, 436, 438, 439, 454, 467):
            self.assertEqual(items[str(ident)]["sprite"], f"../sprites/items/{ident}.png")
            self.assertEqual(items[str(ident)]["icon_status"], "rom_extracted")
        self.assertEqual(items["113"]["sprite"], "../sprites/items/113.png")
        self.assertEqual(items["113"]["icon_status"], "rom_placeholder")
        gift = items["113"]["acquisition"][0]
        self.assertEqual(gift["evidence"]["scope"], "native_gift_runtime_only" if alpha2 else "native_exact_target_gift")
        self.assertEqual(gift["evidence"]["rom_sha256"], self.data["target_sha256"])
        if alpha2:
            for ident, label in ((114, "Party Healer"), (118, "Cheat Kit")):
                custom = items[str(ident)]
                self.assertEqual(custom["name"]["en"], label)
                self.assertEqual(custom["sprite"], "../sprites/items/113.png")
                self.assertEqual(custom["icon_status"], "rom_placeholder")
                self.assertEqual(custom["acquisition"][0]["status"], "native_gift_runtime_only")
        store_rows = [entry for item in items.values() for entry in item.get("acquisition", [])
                      if entry.get("shop_id") == 4 and entry["location"]["id"] == 192
                      and entry.get("status") == "verified_target_shop_stock"]
        self.assertTrue(store_rows)
        for entry in store_rows:
            self.assertEqual(entry["evidence"]["scope"], "verified_target_shop_stock" if alpha2 else "prototype_location")
            self.assertEqual(entry["evidence"]["rom_sha256"], self.data["target_sha256"] if alpha2 else
                             "231a0a2fe3f873d0d369f6adbde6e6f69abe74e6d4bf9642fe1b1df8c8a7e514")

    def test_species_and_trainer_references_are_complete(self):
        data = self.data
        species = {p["id"]: p for p in data["species"]}
        self.assertEqual(set(species), set(range(1, 494)))
        self.assertEqual(len(data["moves"]), 467)
        self.assertEqual(len(data["trainers"]), 737)
        self.assertEqual(sum(len(t["members"]) for t in data["trainers"]), 2086)
        for p in species.values():
            self.assertEqual([slot["slot"] for slot in p["ability_slots"]], [1, 2])
            self.assertTrue(all(slot["kind"] == "standard" for slot in p["ability_slots"]))
            self.assertEqual(p["hidden_ability"]["status"], "not_implemented_in_target_format")
            self.assertIsNone(p["hidden_ability"]["ability_id"])
            for entry in p["learnset"]:
                self.assertIn(str(entry["move_id"]), data["moves"])
            for evolution in p["evolutions"]:
                self.assertIn(evolution["target"], species)
                self.assertEqual(set(evolution["condition"]), {"en", "es"})
        for trainer in data["trainers"]:
            for member in trainer["members"]:
                self.assertIn(member["species_id"], species)
                self.assertLessEqual(len(member["move_ids"]), 4)
                for move in member["move_ids"]:
                    self.assertIn(str(move), data["moves"])

    def test_every_species_has_a_real_local_png(self):
        for ident in range(1, 494):
            sprite = ROOT / "web/sprites/pokemon" / f"{ident}.png"
            self.assertEqual(sprite.read_bytes()[:8], b"\x89PNG\r\n\x1a\n")

    def test_native_default_moves_relearn_evicted_moves(self):
        entries = [{"level": 1, "move_id": move} for move in [1, 2, 3, 4, 5, 1]]
        self.assertEqual(BUILDER.default_moves(entries, 1), [3, 4, 5, 1])
        entries = [{"level": 1, "move_id": move} for move in [1, 2, 1, 3, 4]]
        self.assertEqual(BUILDER.default_moves(entries, 1), [1, 2, 3, 4])
        self.assertEqual(BUILDER.default_moves([{"level": 2, "move_id": 1},
                                               {"level": 1, "move_id": 2}], 1), [])

    def test_trainer_journey_and_stat_spreads_preserve_rom_facts(self):
        trainers = {trainer["id"]: trainer for trainer in self.data["trainers"]}
        ordered = [trainer for trainer in trainers.values() if trainer.get("journey")]
        self.assertEqual(len(ordered), 639)
        self.assertEqual(trainers[21]["journey"]["match"], "name_and_species_with_incomplete_reference_levels")
        self.assertEqual(trainers[27]["journey"]["source_line"], 82)
        first = min(ordered, key=lambda trainer: trainer["journey"]["order"])
        self.assertEqual(first["id"], 495)
        self.assertEqual(trainers[8]["journey"]["kind"], "first_visit")
        self.assertEqual(trainers[279]["journey"]["kind"], "rematch")
        self.assertEqual(trainers[1]["members"][2]["level"], 19)
        self.assertEqual(trainers[1]["journey"]["match"], "name_and_species_with_documented_level_discrepancy")
        for trainer in trainers.values():
            for member in trainer["members"]:
                self.assertEqual(len(member["ivs"]), 6)
                self.assertTrue(all(0 <= value <= 31 for value in member["ivs"]))
                self.assertEqual(len(set(member["ivs"])), 1)
                self.assertEqual(member["evs"], [0] * 6)
                self.assertEqual(member["ev_source"], "native_creation_default_no_custom_spread")
                self.assertEqual(member["levels_by_mode"]["normal"], member["level"])
                self.assertGreaterEqual(member["levels_by_mode"]["plus"], member["level"])
                self.assertLessEqual(member["levels_by_mode"]["plus"], 100)
        self.assertEqual(trainers[1]["members"][2]["levels_by_mode"], {"normal": 19, "plus": 21})

    def test_shop_acquisition_binds_exact_target_and_deduplicates_map_calls(self):
        place = {"id": 192, "name": {"en": "Store 2F", "es": "Tienda 2F"}}
        document = {"target_sha256": "expected", "shops": [{"id": 4,
            "locations": [{"maps": [place]}, {"maps": [place]}],
            "items": [{"id": 82, "price": 2100}]}]}
        items = {82: {"name": {"en": "Fire Stone", "es": "Piedra Fuego"}}}
        with self.assertRaises(ValueError):
            BUILDER.add_shop_acquisitions(items, document, "different")
        BUILDER.add_shop_acquisitions(items, document, "expected")
        entries = items[82]["acquisition"]
        self.assertEqual(len(entries), 1)
        self.assertEqual(entries[0]["location"]["id"], 192)
        self.assertEqual(entries[0]["price"], 2100)
        self.assertIn("not yet tested", entries[0]["method"]["en"])
        self.assertIn("aún sin probar", entries[0]["method"]["es"])

    def test_alpha2_item_icons_bind_placeholder_aliases_to_target_table(self):
        manifest = json.loads((ROOT / "docs/item-icon-evidence.json").read_text(encoding="utf-8"))
        overlay = manifest["additional_targets"][BUILDER.ALPHA2_TARGET_SHA]
        self.assertEqual(overlay["source_report"]["path"], "docs/qa-alpha2-build.json")
        self.assertEqual(set(overlay["items"]), {"114", "118"})
        arm9 = bytearray(0x100194 + 119 * 8)
        for item_id, member in ((114, 516), (118, 515)):
            entry = overlay["items"][str(item_id)]
            self.assertEqual(entry["asset_status"], "rom_placeholder")
            self.assertEqual(entry["alias_item_id"], 113)
            struct.pack_into("<4H", arm9, 0x100194 + item_id * 8, member, 793, 794, 0)
            BUILDER.verify_item_icon_table(arm9, item_id, entry)
            wrong = dict(entry, data_member=member + 1)
            with self.assertRaises(ValueError):
                BUILDER.verify_item_icon_table(arm9, item_id, wrong)

    def test_alpha1_acquisition_profile_remains_distinct(self):
        evidence = BUILDER.load_item_acquisition_evidence(BUILDER.NATIVE_TARGET_SHA)
        self.assertEqual(set(evidence), {("item", 113, 60), ("shop", 4, 192)})
        self.assertEqual(evidence[("item", 113, 60)]["rom_sha256"], BUILDER.NATIVE_TARGET_SHA)
        self.assertEqual(evidence[("shop", 4, 192)]["scope"], "prototype_location")
        self.assertNotEqual(evidence[("shop", 4, 192)]["rom_sha256"], BUILDER.NATIVE_TARGET_SHA)

    def test_alpha2_acquisition_evidence_is_exact_and_bounded(self):
        evidence = BUILDER.load_item_acquisition_evidence(BUILDER.ALPHA2_TARGET_SHA)
        self.assertEqual(set(evidence), {
            ("item", 113, 60), ("item", 114, 60), ("item", 118, 60),
            ("shop_item", 81, 4, 192), ("shop_item", 467, 4, 192),
        })
        for item_id in (113, 114, 118):
            proof = evidence[("item", item_id, 60)]
            self.assertEqual(proof["scope"], "native_gift_runtime_only")
            self.assertEqual(proof["rom_sha256"], BUILDER.ALPHA2_TARGET_SHA)
            self.assertEqual(proof["report"]["source_sha256"],
                             "536089678104335b246edd63cb8f05b961932ff591840b3483f1dd2e266e1b69")
        for item_id, price in ((81, 2100), (467, 3500)):
            proof = evidence[("shop_item", item_id, 4, 192)]
            self.assertEqual(proof["scope"], "native_purchase_save_cold_bounded")
            self.assertEqual(proof["price"], price)
            self.assertEqual(proof["rom_sha256"], BUILDER.ALPHA2_TARGET_SHA)
            self.assertEqual(proof["report"]["source_sha256"],
                             "939507da49726aad09c452692cf421e8445a7f05f5c36b0848f1823fdeaa2cc6")

    def test_alpha2_acquisition_rows_do_not_inherit_pickups(self):
        evidence = BUILDER.load_item_acquisition_evidence(BUILDER.ALPHA2_TARGET_SHA)
        items = {81: {"name": {"en": "Moon Stone"}},
                 467: {"name": {"en": "Covenant Orb"}},
                 113: {}, 114: {}, 118: {}}
        BUILDER.add_alpha2_shop_purchases(items, evidence)
        BUILDER.add_alpha2_gift_acquisitions(items, evidence)
        self.assertEqual(items[81]["acquisition"][0]["status"], "bounded_native_purchase_save_cold_verified")
        self.assertEqual(items[467]["acquisition"][0]["price"], 3500)
        for item_id in (113, 114, 118):
            self.assertEqual(len(items[item_id]["acquisition"]), 1)
            self.assertEqual(items[item_id]["acquisition"][0]["status"], "native_gift_runtime_only")
            self.assertIn("not tested", items[item_id]["acquisition"][0]["method"]["en"])

    def test_alpha2_retains_documented_upstream_item_notes(self):
        source = json.loads((ROOT / "docs/item-locations.json").read_text(encoding="utf-8"))
        items = {int(ident): {} for ident in source["items"]}
        BUILDER.add_documented_upstream_acquisitions(items)
        entries = [entry for item in items.values() for entry in item.get("acquisition", [])]
        self.assertEqual(len(entries), 150)
        self.assertTrue(all(entry["status"] == "documented_upstream" for entry in entries))
        claims = [entry["source"]["claim"] for entry in entries]
        self.assertEqual(claims.count("Upstream documentation; not verified in this target ROM."), 107)
        self.assertEqual(claims.count("The guide explicitly says no location change; exact base-game spot not transcribed."), 43)

    def test_alpha2_shop_stock_preserves_full_static_catalog(self):
        report = json.loads((ROOT / "docs/shop-locations-alpha2.json").read_text(encoding="utf-8"))
        self.assertEqual(BUILDER.digest(ROOT / "docs/shop-locations-alpha2.json"), BUILDER.ALPHA2_SHOP_REPORT_SHA)
        self.assertEqual(report["target_sha256"], BUILDER.ALPHA2_TARGET_SHA)
        self.assertEqual(sum(len(shop["items"]) for shop in report["shops"]), 194)
        self.assertEqual(sum(len(link["maps"]) for shop in report["shops"] for link in shop["locations"]), 34)
        items = {}
        for shop in report["shops"]:
            for stock in shop["items"]:
                items[stock["id"]] = {"name": stock["name"]}
        BUILDER.add_alpha2_shop_stock(items, report)
        entries = [entry for item in items.values() for entry in item.get("acquisition", [])]
        self.assertEqual(len(entries), 208)
        self.assertTrue(all(entry["status"] == "verified_target_shop_stock" for entry in entries))

    def test_alpha2_shop_delta_is_only_22_additions_at_shop_four(self):
        alpha1 = json.loads((ROOT / "docs/shop-locations.json").read_text(encoding="utf-8"))
        alpha2 = json.loads((ROOT / "docs/shop-locations-alpha2.json").read_text(encoding="utf-8"))
        by_shop = lambda report: {
            shop["id"]: {row["id"]: row["price"] for row in shop["items"]}
            for shop in report["shops"]
        }
        old, new = by_shop(alpha1), by_shop(alpha2)
        additions = {80, 81, 110, 221, 226, 227, 233, 235, 252, 321, 322,
                     323, 324, 325, 326, 327, 433, 436, 438, 439, 454, 467}
        self.assertEqual(sum(map(len, old.values())), 172)
        self.assertEqual(sum(map(len, new.values())), 194)
        for shop_id in range(30):
            removed = set(old[shop_id]) - set(new[shop_id])
            added = set(new[shop_id]) - set(old[shop_id])
            self.assertEqual(removed, set())
            self.assertEqual(added, additions if shop_id == 4 else set())
            self.assertTrue(all(old[shop_id][item_id] == new[shop_id][item_id]
                                for item_id in old[shop_id].keys() & new[shop_id].keys()))

        def shop_map_calls(report):
            return sorted((shop["id"], link["script_member"], place["id"])
                          for shop in report["shops"] for link in shop["locations"]
                          for place in link["maps"])

        self.assertEqual(shop_map_calls(alpha1), shop_map_calls(alpha2))
        expanded = lambda report: sum(
            len(shop["items"]) * sum(len(link["maps"]) for link in shop["locations"])
            for shop in report["shops"]
        )
        self.assertEqual(expanded(alpha1), 186)
        self.assertEqual(expanded(alpha2), 208)

    def test_alpha2_journey_inheritance_is_bound_to_identical_trainer_data(self):
        report, audit = BUILDER.load_alpha2_build_audit()
        journey_path = ROOT / "docs/trainer-journey.json"
        journey = json.loads(journey_path.read_text(encoding="utf-8"))
        self.assertEqual(BUILDER.digest(journey_path), BUILDER.ALPHA1_TRAINER_JOURNEY_SHA)
        self.assertEqual(len(journey["stages"]), 90)
        self.assertEqual(len(journey["trainers"]), 639)
        self.assertEqual(audit["byte_identical_metadata_narcs"]["trainer_headers"]["path"], "a/0/5/5")
        self.assertTrue(audit["byte_identical_metadata_narcs"]["trainer_headers"]["byte_identical"])
        self.assertEqual(audit["byte_identical_metadata_narcs"]["trainer_parties"]["path"], "a/0/5/6")
        self.assertTrue(audit["byte_identical_metadata_narcs"]["trainer_parties"]["byte_identical"])
        self.assertEqual(report["build"]["target"]["sha256"], BUILDER.ALPHA2_TARGET_SHA)


if __name__ == "__main__":
    unittest.main()
