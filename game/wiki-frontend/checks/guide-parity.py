"""Check source guide text on every local React guide route in both languages."""

import json
import os
import runpy
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import expect, sync_playwright


def main():
    fixtures = runpy.run_path(str(Path(__file__).with_name("browser-smoke.py")))
    web = fixtures["WEB"]
    guides = json.loads((web / "data/wiki-data.json").read_text())["guides"]
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(fixtures["LocalSite"], directory=str(web)))
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    origin = f"http://127.0.0.1:{server.server_port}"
    wiki = origin + fixtures["PREFIX"] + "wiki/"
    failures = []
    try:
        with sync_playwright() as playwright:
            path = os.environ.get("PUG_CHROMIUM")
            browser = playwright.chromium.launch(headless=True, **({"executable_path": path} if path else {}))
            try:
                context = browser.new_context()
                context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(origin + "/") else route.abort())
                page = context.new_page()
                page.goto(wiki, wait_until="domcontentloaded")
                for language in ("en", "es"):
                    page.locator(".controls select").nth(1).select_option(language)
                    for slug, guide in guides.items():
                        page.goto(wiki + "#/guide/" + slug, wait_until="domcontentloaded")
                        expect(page.locator(".guide-html > h1")).to_have_text(guide["title"][language])
                        missing = page.evaluate("""html => {
                          const source = document.createElement('div'); source.innerHTML = html;
                          const normalize = text => text.replace(/\\s+/g, ' ').trim();
                          const rendered = normalize(document.querySelector('.guide-html').textContent)
                            .replace(/ \\((?:detailed evidence not published|evidencia detallada no publicada)\\)/g, '');
                          return [...source.children].map(node => normalize(node.textContent)).filter(text => text && !rendered.includes(text));
                        }""", guide["body"][language])
                        if missing:
                            failures.append({"guide": slug, "language": language, "missing": missing[:2]})
                context.close()
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
    if failures:
        raise AssertionError(json.dumps(failures[:10], ensure_ascii=False))
    print(json.dumps({"result": "passed", "guides": len(guides), "languages": ["en", "es"]}))


if __name__ == "__main__":
    main()
