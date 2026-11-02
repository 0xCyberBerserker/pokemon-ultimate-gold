import hashlib
import json
import unittest
from pathlib import Path

from tools import build_site


ROOT = Path(__file__).resolve().parents[1]


class TrainingMenuCatalogTests(unittest.TestCase):
    def setUp(self):
        self.alpha1 = json.loads((ROOT / 'patches/manifest-alpha1.json').read_text())
        self.alpha2 = json.loads((ROOT / 'patches/manifest-alpha2.json').read_text())
        self.kris = json.loads((ROOT / 'patches/manifest-kris-sprint2.json').read_text())
        self.training = json.loads((ROOT / 'patches/manifest-training-menu.json').read_text())

    def test_default_and_wiki_data_are_independent(self):
        catalog = build_site.build_patch_catalog(self.alpha1, self.alpha2, self.kris, self.training)
        self.assertEqual(catalog['default'], 'training-menu')
        self.assertEqual(catalog['wiki_data'], 'alpha2')
        self.assertEqual(list(catalog['versions']), ['alpha1', 'alpha2', 'kris-sprint2', 'training-menu'])
        self.assertTrue(catalog['versions']['training-menu']['experimental'])
        self.assertEqual(catalog['versions']['training-menu']['status'], self.training['status'])
        self.assertIn('Bag crop and contrast', catalog['versions']['training-menu']['note']['en'])
        self.assertIn('recorte y contraste de Kris', catalog['versions']['training-menu']['note']['es'])

    def test_unknown_default_and_wrong_source_are_rejected(self):
        with self.assertRaisesRegex(SystemExit, 'Unknown default'):
            build_site.build_patch_catalog(self.alpha1, self.alpha2, self.kris, self.training, 'unknown')
        invalid = dict(self.training, source={'sha256': 'wrong'})
        with self.assertRaisesRegex(SystemExit, 'Training menu'):
            build_site.build_patch_catalog(self.alpha1, self.alpha2, self.kris, invalid)
        invalid = dict(self.training, source=dict(self.training['source'], size=1))
        with self.assertRaisesRegex(SystemExit, 'Training menu'):
            build_site.build_patch_catalog(self.alpha1, self.alpha2, self.kris, invalid)
        invalid = dict(self.training, source=dict(self.training['source'], filename='wrong.nds'))
        with self.assertRaisesRegex(SystemExit, 'Training menu'):
            build_site.build_patch_catalog(self.alpha1, self.alpha2, self.kris, invalid)

    def test_provisional_delta_and_target_match_dev_receipt(self):
        manifest = build_site.verify_manifest(ROOT / 'patches/manifest-training-menu.json')
        delta = ROOT / 'patches' / manifest['delta']['file']
        self.assertEqual(manifest['source']['sha256'], '65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105')
        self.assertEqual(manifest['target']['sha256'], '9b910d3ae666a893030acd651e7a4deed41a0fbf8093c82cad0d4336283dedd1')
        self.assertEqual(manifest['target']['size'], 127125512)
        self.assertEqual(manifest['delta']['sha256'], '5d3cc86acf09863efca8fbdefc8c1493956ea7ae6226fded16a760d66a39a056')
        self.assertEqual(delta.stat().st_size, 7533718)
        self.assertEqual(hashlib.sha256(delta.read_bytes()).hexdigest(), manifest['delta']['sha256'])


if __name__ == '__main__':
    unittest.main()
