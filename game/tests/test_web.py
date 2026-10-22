import hashlib
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import importlib.util
import json

ROOT = Path(__file__).resolve().parents[1]
CLEAN = os.environ.get("SACRED_GOLD_CLEAN_ROM")
_spec = importlib.util.spec_from_file_location("build_site", ROOT / "tools" / "build_site.py")
build_site = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(build_site)

class WebBuildTests(unittest.TestCase):
    def test_location_captures_crop_but_qa_menus_keep_both_screens(self):
        location = build_site.guide_image_gallery('![Field](../assets/locations/field.png)')
        menu = build_site.guide_image_gallery('![Menu](../assets/qa/menu.png)')
        self.assertNotIn('guide-capture-full', location)
        self.assertIsNotNone(menu)
        self.assertIn('guide-capture-full', menu)
        for path in ('https://example.com/menu.png', '../assets/qa/../private.png'):
            self.assertIsNone(build_site.guide_image_gallery(f'![Menu]({path})'))

    def test_renderer_links_and_single_table(self):
        rendered = build_site.render_markdown("| Name | Value |\n| --- | --- |\n| [local](README.md) | [upstream](https://example.com) |")
        self.assertEqual(rendered.count("<table>"), 1)
        self.assertIn('href="README.html"', rendered)
        self.assertIn('href="https://example.com"', rendered)

    def test_wiki_catalog_reference_uses_the_current_pages_base(self):
        rendered = build_site.render_markdown("[catalog](../web/wiki/#/cheats)")
        self.assertIn('href="#/cheats"', rendered)
        self.assertNotIn('../web/wiki/', rendered)

    def test_versioned_manifest_links_use_shipped_local_data(self):
        for name in ("manifest.json", "manifest-alpha1.json", "manifest-alpha2.json"):
            with self.subTest(manifest=name):
                rendered = build_site.render_markdown(f"[manifest](../patches/{name})")
                self.assertIn(f'href="../data/patch-{name}"', rendered)

    def test_manifest_rejects_wrong_delta(self):
        with tempfile.TemporaryDirectory() as directory:
            bad = Path(directory) / "manifest.json"
            data = json.loads(build_site.MANIFEST.read_text(encoding="utf-8")); data["delta"]["sha256"] = "0" * 64
            bad.write_text(json.dumps(data), encoding="utf-8")
            original = build_site.MANIFEST; build_site.MANIFEST = bad
            try:
                with self.assertRaises(SystemExit): build_site.verify_manifest()
            finally: build_site.MANIFEST = original

    def test_alpha2_manifest_is_experimental_and_uses_the_clean_input(self):
        alpha1 = build_site.verify_manifest(build_site.MANIFEST_ALPHA1)
        alpha2 = build_site.verify_manifest(build_site.MANIFEST_ALPHA2)
        self.assertEqual(alpha2["status"], "EXPERIMENTAL_TESTED_PARTIAL")
        self.assertEqual(alpha2["default"], build_site.verify_manifest() == alpha2)
        self.assertEqual(alpha1["source"], alpha2["source"])
        self.assertEqual(alpha2["target"]["sha256"], "24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6")

    def test_manifest_rejects_stale_qa_evidence(self):
        with tempfile.TemporaryDirectory() as directory:
            bad = Path(directory) / "manifest.json"
            manifest = json.loads(build_site.MANIFEST_ALPHA2.read_text(encoding="utf-8"))
            manifest["evidence_reports"][0]["sha256"] = "0" * 64
            bad.write_text(json.dumps(manifest), encoding="utf-8")
            with self.assertRaisesRegex(SystemExit, "QA report does not match"):
                build_site.verify_manifest(bad)

    def test_default_build_matches_wiki_and_cheat_catalog(self):
        expected = build_site.verify_manifest()["target"]["sha256"]
        for name in ("wiki-data.json", "cheat-catalog.json"):
            with self.subTest(dataset=name):
                data = json.loads((ROOT / "docs" / name).read_text(encoding="utf-8"))
                self.assertEqual(data["target_sha256"], expected)

    def test_wiki_keeps_documented_journey_and_item_locations(self):
        data = json.loads((ROOT / "docs/wiki-data.json").read_text(encoding="utf-8"))
        self.assertEqual(len(data["trainer_journey"]["stages"]), 90)
        ordered = [trainer for trainer in data["trainers"] if
                   (trainer.get("journey") or {}).get("status") == "documented_recommended_order"]
        self.assertGreaterEqual(len(ordered), 639)
        acquisition = [row for item in data["items"].values() for row in item.get("acquisition", [])]
        self.assertGreaterEqual(sum(row.get("status") == "documented_upstream" for row in acquisition), 150)
        self.assertGreaterEqual(sum(row.get("status") == "verified_target_shop_stock" for row in acquisition), 186)

    def test_patch_catalog_matches_default_and_keeps_both_builds_visible(self):
        alpha1 = json.loads(build_site.MANIFEST_ALPHA1.read_text(encoding="utf-8"))
        alpha2 = json.loads(build_site.MANIFEST_ALPHA2.read_text(encoding="utf-8"))
        default = "alpha2" if build_site.verify_manifest() == alpha2 else "alpha1"
        catalog = build_site.build_patch_catalog(alpha1, alpha2, default)
        self.assertEqual(catalog["default"], default)
        self.assertIn("alpha1", catalog["versions"])
        self.assertIn("alpha2", catalog["versions"])
        self.assertTrue(catalog["versions"]["alpha2"]["experimental"])
        self.assertIn("EVIV", catalog["versions"]["alpha2"]["note"]["en"])

    def test_patch_catalog_requires_consistent_experimental_default(self):
        alpha1 = json.loads(build_site.MANIFEST_ALPHA1.read_text(encoding="utf-8"))
        alpha2 = json.loads(build_site.MANIFEST_ALPHA2.read_text(encoding="utf-8"))
        alpha2["default"] = True
        catalog = build_site.build_patch_catalog(alpha1, alpha2, "alpha2")
        self.assertEqual(catalog["default"], "alpha2")
        self.assertTrue(catalog["versions"]["alpha2"]["experimental"])
        self.assertNotIn("Selected by default", catalog["versions"]["alpha1"]["note"]["en"])
        with self.assertRaises(SystemExit):
            build_site.build_patch_catalog(alpha1, alpha2, "alpha1")

    def test_patch_payload_exports_both_local_builds_without_roms(self):
        alpha1 = build_site.verify_manifest(build_site.MANIFEST_ALPHA1)
        alpha2 = build_site.verify_manifest(build_site.MANIFEST_ALPHA2)
        default = "alpha2" if build_site.verify_manifest() == alpha2 else "alpha1"
        with tempfile.TemporaryDirectory() as directory:
            web = Path(directory)
            build_site.export_patch_payload(web, alpha1, alpha2, default)
            catalog = json.loads((web / "data/patch-catalog.json").read_text(encoding="utf-8"))
            self.assertEqual(catalog["default"], default)
            for manifest in (alpha1, alpha2):
                self.assertTrue((web / "assets" / manifest["delta"]["file"]).is_file())
                self.assertEqual(hashlib.sha256((web / "assets" / manifest["delta"]["file"]).read_bytes()).hexdigest(), manifest["delta"]["sha256"])
            self.assertFalse(any(web.rglob("*.nds")))
            self.assertFalse(any(web.rglob("*.sav")))

    def test_built_legacy_cheat_is_available(self):
        self.assertTrue((ROOT / "web/assets/Sacred-Gold-Plus-Drayano-QoL-fix1.cht").is_file())

    def test_project_updates_have_separate_bilingual_pages(self):
        guides = build_site.localized_guides()
        for slug in guides:
            with self.subTest(guide=slug):
                self.assertGreater(len(guides[slug]["body"].get("en", "")), 100)
                self.assertGreater(len(guides[slug]["body"].get("es", "")), 100)
                self.assertNotEqual(guides[slug]["body"]["en"], guides[slug]["body"]["es"])


@unittest.skipUnless(CLEAN and Path(CLEAN).is_file() and shutil.which("node"), "external ROM or node unavailable")
class WebEngineTests(unittest.TestCase):
    def test_real_vcdiff_and_hash_negative(self):
        script = r'''
const fs=require('fs'), crypto=require('crypto');
process.chdir(process.env.TEST_ROOT);
const BF=require(process.env.TEST_ROOT+'/web/vendor/rompatcher/BinFile.js');
const VCDIFF=require(process.env.TEST_ROOT+'/web/vendor/rompatcher/vcdiff.js');
const source=fs.readFileSync(process.env.SACRED_GOLD_CLEAN_ROM);
const spec=JSON.parse(fs.readFileSync('./patches/manifest.json','utf8'));
const delta=fs.readFileSync('./patches/'+spec.delta.file);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
if (sha(source)!==spec.source.sha256) process.exit(2);
const result=new VCDIFF(new BF(delta)).apply(new BF(source),false)._u8array;
if (sha(result)!==spec.target.sha256) process.exit(3);
const bad=Buffer.from(source); bad[0]^=1;
const wrong=new VCDIFF(new BF(delta)).apply(new BF(bad),false)._u8array;
if (sha(wrong)===spec.target.sha256) process.exit(4);
const badDelta=Buffer.from(delta); badDelta[1000]^=1; let corruptRejected=false;
try { const corrupt=new VCDIFF(new BF(badDelta)).apply(new BF(source),false)._u8array; corruptRejected=sha(corrupt)!==spec.target.sha256; } catch (_) { corruptRejected=true; }
if (!corruptRejected) process.exit(5);
'''
        with tempfile.NamedTemporaryFile("w", suffix=".cjs") as handle:
            handle.write(script); handle.flush()
            env = os.environ.copy(); env["TEST_ROOT"] = str(ROOT)
            result = subprocess.run(["node", handle.name], cwd=ROOT, env=env, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
