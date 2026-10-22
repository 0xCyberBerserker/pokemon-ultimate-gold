"""Regression checks for notation in the credited trainer reference."""
import unittest

from tools import build_trainer_journey as journey


class TrainerReferenceTests(unittest.TestCase):
    def test_gender_symbols_do_not_merge_species(self):
        self.assertNotEqual(journey.normalize("Nidoran♀"), journey.normalize("Nidoran♂"))

    def test_reference_notation_preserves_every_roster_member(self):
        species = {journey.normalize(name): ident for name, ident in [
            ("Geodude", 74), ("Machop", 66), ("Pinsir", 127), ("Scyther", 123),
            ("Hypno", 97), ("Girafarig", 203), ("Medicham", 308), ("Crobat", 169),
            ("Mr. Mime", 122), ("Mime Jr.", 439)]}
        cases = [
            ("Geodude Lv . 16, Machop lv. 16", [(74, 16), (66, 16)]),
            ("Pinsir, Scyther Lv. 21", [(127, None), (123, 21)]),
            ("Hypno Lv. 63, Girafarig Lv. 63. Medicham Lv. 63", [(97, 63), (203, 63), (308, 63)]),
            ("Crobat Lv, 73", [(169, 73)]),
            ("Machop Lv 16", [(66, 16)]),
            ("Mr. Mime Lv. 63, Mime Jr. Lv. 22", [(122, 63), (439, 22)]),
        ]
        for text, expected in cases:
            with self.subTest(text=text):
                self.assertEqual(journey.parse_roster(text, species), expected)


if __name__ == "__main__":
    unittest.main()
