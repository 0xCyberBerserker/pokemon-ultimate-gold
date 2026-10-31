"""Verify a local patcher roundtrip with a hash-matched user-supplied ROM."""

import argparse
import hashlib
import json
import runpy
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread

from playwright.sync_api import expect, sync_playwright


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("browser", type=Path)
    parser.add_argument("--version", choices=("alpha1", "alpha2"), default="alpha2")
    args = parser.parse_args()
    fixtures = runpy.run_path(str(Path(__file__).with_name("browser-smoke.py")))
    web = fixtures["WEB"]
    manifest = json.loads((web / f"data/patch-manifest-{args.version}.json").read_text())
    source_hash = digest(args.source)
    if args.source.stat().st_size != manifest["source"]["size"] or source_hash != manifest["source"]["sha256"]:
        raise ValueError("Source ROM does not match the manifest")

    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(fixtures["LocalSite"], directory=str(web)))
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    origin = f"http://127.0.0.1:{server.server_port}"
    try:
        with TemporaryDirectory(prefix="pug-patcher-roundtrip-") as output, sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True, executable_path=str(args.browser))
            try:
                context = browser.new_context(accept_downloads=True)
                context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(origin + "/") else route.abort())
                page = context.new_page()
                page.goto(origin + fixtures["PREFIX"] + "wiki/#/patcher", wait_until="domcontentloaded")
                frame = page.frame_locator("iframe")
                expect(frame.locator("#version")).to_have_value("alpha2")
                expect(frame.locator("#apply")).to_be_enabled()
                if args.version != "alpha2":
                    frame.locator("#version").select_option(args.version)
                    expect(frame.locator("#apply")).to_be_enabled()
                frame.locator("#rom").set_input_files(str(args.source))
                frame.locator("#apply").click()
                expect(frame.locator("#download")).to_be_visible(timeout=120000)
                with page.expect_download(timeout=30000) as download:
                    frame.locator("#download").click()
                target = Path(output) / "output.nds"
                download.value.save_as(target)
                if target.stat().st_size != manifest["target"]["size"] or digest(target) != manifest["target"]["sha256"]:
                    raise ValueError("Downloaded output does not match the manifest")
                if digest(args.source) != source_hash:
                    raise ValueError("Source ROM changed during the test")
                context.close()
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
    print(json.dumps({"result": "passed", "version": args.version, "source_sha256": source_hash, "target_sha256": manifest["target"]["sha256"], "output": "temporary and deleted"}))


if __name__ == "__main__":
    main()
