"""Local-only browser checks; run only after browser automation is authorized."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import mkdtemp
from threading import Thread
from urllib.parse import unquote, urlsplit
import json
import os

from playwright.sync_api import sync_playwright, expect


ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT.parent / "web"
DIST = ROOT / "dist"
PREFIX = "/pokemon-ultimate-gold/"


class LocalSite(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        pathname = unquote(urlsplit(path).path)
        if not pathname.startswith(PREFIX):
            return str(DIST / "nonexistent")
        relative = pathname.removeprefix(PREFIX)
        if os.environ.get("PUG_INTEGRATED") == "1":
            target = (WEB / relative).resolve()
            return str(target if target.is_relative_to(WEB.resolve()) else WEB / "nonexistent")
        frontend = relative == "wiki/" or relative.startswith("wiki/assets/")
        base = DIST if frontend else WEB
        name = "index.html" if relative == "wiki/" else relative.removeprefix("wiki/") if frontend else relative or "index.html"
        target = (base / name).resolve()
        return str(target if target.is_relative_to(base.resolve()) else base / "nonexistent")

    def log_message(self, *_):
        pass


def check_accessible_names(page, route):
    missing = page.evaluate("""() => [...document.querySelectorAll('button, input:not([type=hidden]), select, textarea, a[href], img')]
      .filter(el => el.getClientRects().length && !el.closest('[hidden], [aria-hidden=true]'))
      .filter(el => el.tagName === 'IMG' ? !el.hasAttribute('alt') :
        !(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') ||
          (el.labels && [...el.labels].some(label => label.textContent.trim())) || el.textContent.trim() ||
          (el.tagName === 'A' && [...el.querySelectorAll('img[alt]')].some(img => img.alt.trim())) ||
          (el.tagName === 'INPUT' && ['submit', 'button'].includes(el.type) && el.value)))
      .map(el => el.outerHTML.slice(0, 200))""")
    assert not missing, f"Unnamed controls or images on {route}: {missing}"


def main():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(LocalSite, directory=str(WEB)))
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    origin = f"http://127.0.0.1:{server.server_port}"
    wiki = f"{origin}{PREFIX}wiki/"
    captures = Path(mkdtemp(prefix="pug-react-visual-"))
    wiki_data = json.loads((WEB / "data/wiki-data.json").read_text())
    cheat_data = json.loads((WEB / "data/cheat-catalog.json").read_text())
    cheat = next(entry for entry in cheat_data["entries"] if entry["id"] == "00-006")
    mode_trainer = next(trainer for trainer in wiki_data["trainers"] if trainer["id"] == 1)
    errors = []
    missing_resources = set()
    try:
        with sync_playwright() as playwright:
            browser_path = os.environ.get("PUG_CHROMIUM")
            browser = playwright.chromium.launch(headless=True, **({"executable_path": browser_path} if browser_path else {}))
            try:
                for name, width, height in [("desktop", 1440, 900), ("mobile", 390, 844)]:
                    context = browser.new_context(viewport={"width": width, "height": height}, reduced_motion="reduce")
                    context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(origin + "/") else route.abort())
                    page = context.new_page()
                    page.on("pageerror", lambda error: errors.append(str(error)))
                    page.on("response", lambda response: missing_resources.add(f"{response.status} {response.url}") if response.url.startswith(origin + "/") and response.status >= 400 else None)
                    page.goto(wiki, wait_until="domcontentloaded")
                    expect(page.locator(".home-page")).to_be_visible()
                    check_accessible_names(page, "home")
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                    page.screenshot(path=str(captures / f"{name}-home.png"), full_page=True)
                    page.keyboard.press("Control+k")
                    page.locator('input[role="combobox"]').fill("Bulbasaur")
                    expect(page.get_by_role("option", name="Bulbasaur").first).to_be_visible()
                    page.keyboard.press("Enter")
                    expect(page).to_have_url(wiki + "#/pokemon/1")
                    page.goto(wiki, wait_until="domcontentloaded")
                    page.locator(".search-trigger").focus()
                    page.keyboard.press("Control+k")
                    page.keyboard.press("Escape")
                    expect(page.locator(".search-trigger")).to_be_focused()
                    page.locator(".controls select").nth(1).select_option("es")
                    expect(page.locator("html")).to_have_attribute("lang", "es")
                    page.locator(".theme-button").click()
                    page.screenshot(path=str(captures / f"{name}-theme.png"), full_page=False)
                    page.get_by_role("navigation", name="Wiki").get_by_role("link", name="Trucos", exact=True).click()
                    expect(page.get_by_role("heading", name="Catálogo de trucos")).to_be_visible()
                    page.goto(wiki + "#/trainers", wait_until="domcontentloaded")
                    first = page.locator(".trainer-option").first
                    expect(first).to_be_visible()
                    expect(first.locator(".trainer-preview img").first).to_be_visible()
                    first.click()
                    expect(page.locator(".member-card").first).to_be_visible()
                    expect(page.locator(".trainer-detail")).to_be_focused()
                    check_accessible_names(page, "trainers")
                    assert page.locator(".member-card progress").count() == page.locator(".member-card").count() * 12
                    page.screenshot(path=str(captures / f"{name}-trainer.png"), full_page=False)
                    trainer_hash = page.evaluate("location.hash")
                    species_name = page.locator(".member-card h3 a").first.inner_text()
                    page.get_by_label("Pokémon", exact=True).fill(species_name)
                    expect(page.locator(".trainer-option").first).to_be_visible()
                    page.locator(".controls select").first.select_option("plus")
                    expect(page.locator(".member-card").first).to_be_visible()
                    page.reload(wait_until="domcontentloaded")
                    expect(page.locator(".member-card").first).to_be_visible()
                    assert page.evaluate("location.hash") == trainer_hash
                    expect(page.locator(".controls select").first).to_have_value("plus")
                    expect(page.get_by_label("Pokémon", exact=True)).to_have_value(species_name)
                    page.get_by_label("Pokémon", exact=True).fill("")
                    page.get_by_label("Categoría de entrenador").select_option("Rival")
                    expected_rivals = sum(1 for trainer in wiki_data["trainers"] if trainer["class_name"]["en"] == "Rival" and (trainer.get("journey") or {}).get("kind") == "first_visit")
                    expect(page.locator(".section-title .count")).to_contain_text(str(expected_rivals))
                    page.locator(".member-card h3 a").first.click()
                    expect(page.locator(".pokemon-evolution").first).to_be_visible()
                    check_accessible_names(page, "pokemon")
                    page.go_back()
                    expect(page.get_by_label("Categoría de entrenador")).to_have_value("Rival")
                    expect(page.locator(".member-card").first).to_be_visible()
                    page.get_by_label("Categoría de entrenador").select_option("")
                    page.goto(wiki + "#/trainers/1", wait_until="domcontentloaded")
                    expect(page.locator(".member-card")).to_have_count(len(mode_trainer["members"]))
                    for mode in ("normal", "plus"):
                        page.locator(".controls select").first.select_option(mode)
                        for index, member in enumerate(mode_trainer["members"]):
                            level = member.get("levels_by_mode", {}).get(mode, member["level"])
                            expect(page.locator(".member-card").nth(index).locator(".member-heading > div > span").first).to_have_text(f"Nv. {level}")
                            move_id = member.get("move_ids_by_mode", {}).get(mode, member["move_ids"])[0]
                            move = wiki_data["moves"][str(move_id)]
                            move_link = page.locator(".member-card").nth(index).locator(".move-link").first
                            expect(move_link).to_contain_text(wiki_data["types"][str(move["type_id"])]["es"])
                            expect(move_link).to_contain_text(f'PP {move["pp"]}')
                    page.goto(wiki + "#/pokemon/1", wait_until="domcontentloaded")
                    expect(page.locator(".pokemon-evolution").first).to_be_visible()
                    page.goto(wiki + "#/pokemon", wait_until="domcontentloaded")
                    page.get_by_label("Buscar Pokémon").fill("Bulbasaur")
                    expect(page.locator(".dex-card")).to_have_count(1)
                    page.locator(".dex-card").first.click()
                    page.locator(".learnset a").first.click()
                    expect(page.locator("main h1")).to_be_visible()
                    page.go_back()
                    page.go_back()
                    expect(page.get_by_label("Buscar Pokémon")).to_have_value("Bulbasaur")
                    expect(page.locator(".dex-card")).to_have_count(1)
                    page.goto(wiki + "#/pokemon/12", wait_until="domcontentloaded")
                    page.get_by_text("Fuente y criterio", exact=True).click()
                    expect(page.get_by_text(wiki_data["species_stat_comparison"]["sources"]["baseline"]["sha256"])).to_be_visible()
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"Horizontal overflow: {name} comparison source"
                    page.goto(wiki + "#/cheats", wait_until="domcontentloaded")
                    expect(page.locator(".cheat-card").first).to_be_visible()
                    check_accessible_names(page, "cheats")
                    page.get_by_label("Buscar códigos, títulos o ID").fill(cheat["id"])
                    card = page.locator(".cheat-card").first
                    expect(card).to_contain_text(cheat["id"])
                    card.get_by_text("Código completo", exact=True).click()
                    expect(card.locator("pre code")).to_have_text(cheat["code"])
                    with page.expect_download() as exported:
                        card.get_by_role("button", name="Perfil RetroArch · desactivado").click()
                    profile = Path(exported.value.path()).read_text()
                    assert 'cheat0_enable = "false"' in profile
                    assert cheat["code"].replace("\n", "+") in profile
                    page.goto(wiki + "#/kris-progress", wait_until="domcontentloaded")
                    expect(page.locator(".kris-gallery-card").first).to_be_visible()
                    check_accessible_names(page, "kris-progress")
                    page.goto(wiki + "#/patcher", wait_until="domcontentloaded")
                    manifest = json.loads((WEB / "data/patch-manifest-alpha2.json").read_text())
                    expect(page.locator(".patcher-source")).to_contain_text(manifest["source"]["sha256"])
                    expect(page.locator(".patcher-source")).to_contain_text("128 MiB")
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"Horizontal overflow: {name} patcher source"
                    expect(page.frame_locator("iframe").locator("#rom")).to_be_attached()
                    expect(page.frame_locator("iframe").locator("#language")).to_have_value("es")
                    for route in ("moves", "items", "machines", "abilities", "evolutions", "guides", "faq", "mechanics", "guide/player", "guide/features"):
                        page.goto(wiki + "#/" + route, wait_until="domcontentloaded")
                        expect(page.locator("main h1").first).to_be_visible()
                        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"Horizontal overflow: {name} {route}"
                        check_accessible_names(page, route)
                    expect(page.get_by_label("Linaje y ruta de los parches")).to_contain_text("Sacred Gold Plus 1.2.3")
                    expect(page.get_by_label("Linaje y ruta de los parches")).to_contain_text("no una secuencia para apilar parches")
                    page.locator(".controls select").nth(1).select_option("en")
                    expect(page.get_by_label("Lineage and patch routes")).to_contain_text("not a patch-stacking recipe")
                    context.close()
                assert not errors, errors
                assert not missing_resources, sorted(missing_resources)
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
    print(json.dumps({"result": "passed", "captures": str(captures), "scope": "local browser UI smoke; no ROM or patch execution"}))


if __name__ == "__main__":
    main()
