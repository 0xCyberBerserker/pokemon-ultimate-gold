import importlib.util
from pathlib import Path
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("build_site", ROOT / "tools" / "build_site.py")
build_site = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(build_site)

CSP = "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'"
HTML = f'''<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="{CSP}">
<script type="module" src="./assets/app-abc.js"></script><link rel="stylesheet" href="./assets/app-abc.css"></head><body></body></html>'''


class ReactSiteIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.dist = self.root / "dist"
        self.assets = self.dist / "assets"
        self.assets.mkdir(parents=True)
        (self.dist / "index.html").write_text(HTML, encoding="utf-8")
        (self.assets / "app-abc.js").write_text("export {}", encoding="utf-8")
        (self.assets / "app-abc.css").write_text("body {}", encoding="utf-8")
        self.wiki = self.root / "web" / "wiki"
        self.wiki.mkdir(parents=True)
        self.legacy = b"legacy index"
        (self.wiki / "index.html").write_bytes(self.legacy)
        (self.wiki / "redirect.html").write_text("redirect", encoding="utf-8")

    def test_installs_only_frontend_files_and_preserves_redirects(self):
        plan = build_site.prepare_react_site(self.dist, self.wiki, self.legacy)
        build_site.install_react_site(plan, self.wiki)
        self.assertEqual((self.wiki / "index.html").read_text(encoding="utf-8"), HTML)
        self.assertEqual((self.wiki / "assets" / "app-abc.js").read_text(), "export {}")
        self.assertEqual((self.wiki / "redirect.html").read_text(), "redirect")

    def test_rejects_modified_index_and_colliding_asset_before_writing(self):
        (self.wiki / "index.html").write_text("unsaved user edit")
        with self.assertRaisesRegex(ValueError, "index"):
            build_site.prepare_react_site(self.dist, self.wiki, self.legacy)
        self.assertEqual((self.wiki / "index.html").read_text(), "unsaved user edit")
        (self.wiki / "index.html").write_bytes(self.legacy)
        (self.wiki / "assets").mkdir()
        (self.wiki / "assets" / "app-abc.js").write_text("existing different file")
        with self.assertRaisesRegex(ValueError, "asset"):
            build_site.prepare_react_site(self.dist, self.wiki, self.legacy)
        self.assertEqual((self.wiki / "assets" / "app-abc.js").read_text(), "existing different file")

    def test_rejects_missing_assets_and_relaxed_csp(self):
        (self.assets / "app-abc.js").unlink()
        with self.assertRaises(ValueError):
            build_site.prepare_react_site(self.dist, self.wiki, self.legacy)
        (self.assets / "app-abc.js").write_text("export {}")
        (self.dist / "index.html").write_text(HTML.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'"))
        with self.assertRaises(ValueError):
            build_site.prepare_react_site(self.dist, self.wiki, self.legacy)

    def test_rejects_duplicate_csp_directives(self):
        (self.dist / "index.html").write_text(HTML.replace("script-src 'self'", "script-src https://outside.invalid; script-src 'self'"))
        with self.assertRaises(ValueError):
            build_site.prepare_react_site(self.dist, self.wiki, self.legacy)

    def test_rejects_duplicate_attributes_in_entry_html(self):
        invalid = HTML.replace(f'content="{CSP}"', f'content="default-src *" content="{CSP}"')
        (self.dist / "index.html").write_text(invalid)
        with self.assertRaises(ValueError):
            build_site.prepare_react_site(self.dist, self.wiki, self.legacy)

    def test_rejects_csp_after_scripts_or_outside_head(self):
        prior_script = HTML.replace('<meta http-equiv=', '<script src="./assets/app-abc.js"></script><meta http-equiv=')
        outside_head = HTML.replace('<head><meta', '<head></head><meta').replace('</head><body>', '<body>')
        for html in (prior_script, outside_head):
            with self.subTest(html=html):
                (self.dist / "index.html").write_text(html)
                with self.assertRaises(ValueError):
                    build_site.prepare_react_site(self.dist, self.wiki, self.legacy)

    def test_update_prior_generated_index_without_overwriting_user_edits(self):
        build_site.install_react_site(build_site.prepare_react_site(self.dist, self.wiki, self.legacy), self.wiki)
        next_html = HTML.replace("app-abc", "app-def")
        (self.dist / "index.html").write_text(next_html)
        (self.assets / "app-def.js").write_text("export const next = 1")
        (self.assets / "app-def.css").write_text("body { color: black }")
        plan = build_site.prepare_react_site(self.dist, self.wiki, self.legacy)
        build_site.install_react_site(plan, self.wiki)
        self.assertEqual((self.wiki / "index.html").read_text(), next_html)
        self.assertEqual((self.wiki / "assets" / "app-abc.js").read_text(), "export {}")
        (self.wiki / "index.html").write_text("unsaved edit")
        with self.assertRaisesRegex(ValueError, "index"):
            build_site.prepare_react_site(self.dist, self.wiki, self.legacy)


if __name__ == "__main__":
    unittest.main()
