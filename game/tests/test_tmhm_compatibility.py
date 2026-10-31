import unittest

from tools.build_wiki_data import (
    ALPHA2_TARGET_SHA,
    KRIS_SPRINT2_TARGET_SHA,
    load_tmhm_compatibility,
)


class TmhmCompatibilityTests(unittest.TestCase):
    def test_exact_targets_receive_only_their_verified_compatibility_block(self):
        alpha2 = load_tmhm_compatibility(ALPHA2_TARGET_SHA)
        candidate = load_tmhm_compatibility(KRIS_SPRINT2_TARGET_SHA)

        self.assertEqual(alpha2["target_sha256"], ALPHA2_TARGET_SHA)
        self.assertEqual(candidate["target_sha256"], KRIS_SPRINT2_TARGET_SHA)
        self.assertEqual(len(alpha2["by_species"]), 493)
        self.assertEqual(alpha2["by_species"], candidate["by_species"])
        self.assertIsNone(load_tmhm_compatibility("unverified-target"))


if __name__ == "__main__":
    unittest.main()
