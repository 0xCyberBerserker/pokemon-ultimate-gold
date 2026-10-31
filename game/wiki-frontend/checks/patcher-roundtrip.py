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
    parser.add_argument("--version", choices=("alpha1", "alpha2", "kris-sprint2"), default="alpha2")
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
                requests = []
                page.on("request", lambda request: requests.append((request.method, request.url)) if request.url.startswith(("http:", "https:")) else None)
                page.goto(origin + fixtures["PREFIX"] + "wiki/#/patcher", wait_until="domcontentloaded")
                frame = page.frame_locator("iframe")
                expect(frame.locator("#version")).to_have_value("alpha2")
                expect(frame.locator("#apply")).to_be_enabled()
                for version in ("alpha1", "alpha2", args.version):
                    expect(frame.locator(f'#version option[value="{version}"]')).to_have_count(1)
                if args.version != "alpha2":
                    frame.locator("#version").select_option(args.version)
                    expect(frame.locator("#apply")).to_be_enabled()
                if args.version == "kris-sprint2":
                    expect(frame.locator('#version option[value="kris-sprint2"]')).to_contain_text("experimental", ignore_case=True)
                    expect(frame.locator("#version-note")).to_contain_text("Alpha 2")
                    page.locator(".controls select").nth(1).select_option("es")
                    expect(frame.locator("#language")).to_have_value("es")
                    expect(frame.locator("#version-note")).to_contain_text("Alfa 2")
                    expect(frame.locator("#buildNote")).to_be_hidden()
                    expect(frame.locator("#tmNote")).to_be_hidden()
                    page.locator(".controls select").nth(1).select_option("en")
                    expect(frame.locator("#language")).to_have_value("en")
                    wrong = Path(output) / "wrong.nds"
                    with wrong.open("wb") as stream:
                        stream.truncate(manifest["source"]["size"])
                    frame.locator("#rom").set_input_files(str(wrong))
                    frame.locator("#apply").click()
                    expect(frame.locator("#status")).to_contain_text("does not match the required clean SHA-256", timeout=30000)
                    expect(frame.locator("#download")).to_be_hidden()
                    wrong.unlink()
                    delta = (web / "assets" / manifest["delta"]["file"]).read_bytes()
                    pattern = "**/assets/" + manifest["delta"]["file"]
                    page.route(pattern, lambda route: route.fulfill(body=delta[:-1]))
                    frame.locator("#rom").set_input_files(str(args.source))
                    frame.locator("#apply").click()
                    expect(frame.locator("#status")).to_contain_text("Patch asset is incomplete", timeout=30000)
                    expect(frame.locator("#download")).to_be_hidden()
                    page.unroute(pattern)
                frame.locator("#rom").set_input_files(str(args.source))
                frame.locator("#apply").click()
                expect(frame.locator("#download")).to_be_visible(timeout=120000)
                with page.expect_download(timeout=30000) as download:
                    frame.locator("#download").click()
                target = Path(output) / "output.nds"
                download.value.save_as(target)
                if target.stat().st_size != manifest["target"]["size"] or digest(target) != manifest["target"]["sha256"]:
                    raise ValueError("Downloaded output does not match the manifest")
                if args.version == "kris-sprint2":
                    frame.locator("#version").select_option("alpha2")
                    expect(frame.locator("#apply")).to_be_enabled()
                    expect(frame.locator("#download")).to_be_hidden()
                    assert frame.locator("#download").get_attribute("href") is None
                if digest(args.source) != source_hash:
                    raise ValueError("Source ROM changed during the test")
                assert all(method == "GET" and url.startswith(origin + "/") for method, url in requests), "Unexpected network request"
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
