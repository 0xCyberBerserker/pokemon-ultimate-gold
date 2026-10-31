"""Local-only browser checks; run only after browser automation is authorized."""

from functools import partial
from contextlib import ExitStack
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import mkdtemp, TemporaryDirectory
from threading import Thread
from time import monotonic, sleep
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
    # Firefox 150's patched Juggler cannot evaluate scripts under this page's CSP.
    if os.environ.get("PUG_FIREFOX"):
        return
    missing = page.evaluate("""() => [...document.querySelectorAll('button, input:not([type=hidden]), select, textarea, a[href], img')]
      .filter(el => el.getClientRects().length && !el.closest('[hidden], [aria-hidden=true]'))
      .filter(el => el.tagName === 'IMG' ? !el.hasAttribute('alt') :
        !(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') ||
          (el.labels && [...el.labels].some(label => label.textContent.trim())) || el.textContent.trim() ||
          (el.tagName === 'A' && [...el.querySelectorAll('img[alt]')].some(img => img.alt.trim())) ||
          (el.tagName === 'INPUT' && ['submit', 'button'].includes(el.type) && el.value)))
      .map(el => el.outerHTML.slice(0, 200))""")
    assert not missing, f"Unnamed controls or images on {route}: {missing}"


def check_width(page, description):
    if not os.environ.get("PUG_FIREFOX"):
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"Horizontal overflow: {description}"


def main():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(LocalSite, directory=str(WEB)))
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    origin = f"http://127.0.0.1:{server.server_port}"
    wiki = f"{origin}{PREFIX}wiki/"
    captures = Path(mkdtemp(prefix="pug-react-visual-", dir=os.environ.get("PUG_EVIDENCE_DIR")))
    wiki_data = json.loads((WEB / "data/wiki-data.json").read_text())
    cheat_data = json.loads((WEB / "data/cheat-catalog.json").read_text())
    cheat = next(entry for entry in cheat_data["entries"] if entry["id"] == "00-006")
    gallery = json.loads((WEB / "data/kris-gallery.json").read_text())
    mode_trainer = next(trainer for trainer in wiki_data["trainers"] if trainer["id"] == 1)
    errors = []
    missing_resources = set()
    try:
        with ExitStack() as stack:
            firefox_path = os.environ.get("PUG_FIREFOX")
            if firefox_path:
                from invisible_playwright import InvisiblePlaywright
                download_dir = Path(stack.enter_context(TemporaryDirectory(prefix="pug-firefox-downloads-")))
                browser = stack.enter_context(InvisiblePlaywright(seed=42, headless=True, binary_path=firefox_path, locale="en-US", timezone="Europe/Madrid", humanize=False, extra_prefs={"zoom.stealth.canvas.substitute_pixels": False, "zoom.stealth.fpp.hw_seed": 0, "browser.download.folderList": 2, "browser.download.dir": str(download_dir), "browser.download.useDownloadDir": True}))
            else:
                playwright = stack.enter_context(sync_playwright())
                browser_path = os.environ.get("PUG_CHROMIUM")
                browser = playwright.chromium.launch(headless=True, **({"executable_path": browser_path} if browser_path else {}))
            try:
                for name, width, height in [("desktop", 1440, 900), ("mobile", 390, 844)]:
                    context = browser.new_context(viewport={"width": width, "height": height}, reduced_motion="reduce")
                    context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(origin + "/") else route.abort())
                    page = context.new_page()
                    patch_requests = []
                    page.on("pageerror", lambda error: errors.append(str(error)))
                    page.on("response", lambda response: missing_resources.add(f"{response.status} {response.url}") if response.url.startswith(origin + "/") and response.status >= 400 else None)
                    page.on("request", lambda request: patch_requests.append(request.url) if request.url.endswith(".xdelta") else None)
                    page.goto(wiki, wait_until="domcontentloaded")
                    expect(page.locator(".home-page")).to_be_visible()
                    check_accessible_names(page, "home")
                    check_width(page, f"{name} home")
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
                    if name == "mobile":
                        page.get_by_role("button", name="Abrir menú").click()
                        expect(page.get_by_role("button", name="Cerrar menú")).to_have_attribute("aria-expanded", "true")
                        page.keyboard.press("Escape")
                        expect(page.get_by_role("button", name="Abrir menú")).to_be_focused()
                        page.get_by_role("button", name="Abrir menú").click()
                        page.get_by_role("navigation", name="Wiki").get_by_role("button", name="Proyecto").click()
                        page.get_by_role("navigation", name="Wiki").get_by_role("link", name="Trucos", exact=True).focus()
                        page.keyboard.press("Escape")
                        expect(page.get_by_role("button", name="Abrir menú")).to_be_focused()
                        expect(page.get_by_role("button", name="Abrir menú")).to_have_attribute("aria-expanded", "false")
                        page.get_by_role("button", name="Abrir menú").click()
                    else:
                        page.get_by_role("navigation", name="Wiki").get_by_role("button", name="Proyecto").click()
                    page.get_by_role("navigation", name="Wiki").get_by_role("link", name="Trucos", exact=True).click()
                    if name == "mobile":
                        expect(page.get_by_role("button", name="Abrir menú")).to_have_attribute("aria-expanded", "false")
                    expect(page.get_by_role("heading", name="Catálogo de trucos")).to_be_visible()
                    page.goto(wiki + "#/trainers", wait_until="domcontentloaded")
                    page.locator(".journey-stages").get_by_role("button", name="Ruta 30", exact=True).click()
                    expect(page.locator(".filters select").nth(1)).to_have_value("stage-02")
                    expect(page.locator(".journey-hero h1")).to_have_text("Ruta 30")
                    page.locator(".journey-stages").get_by_role("button", name="Todo el recorrido", exact=True).click()
                    page.locator(".filters-toggle").click()
                    if name == "mobile":
                        page.locator(".trainer-list-toggle").click()
                    first = page.locator(".trainer-option").first
                    expect(first).to_be_visible()
                    expect(first.locator(".trainer-preview img").first).to_be_visible()
                    first.click()
                    expect(page.locator(".member-card").first).to_be_visible()
                    expect(page.locator(".trainer-detail")).to_be_focused()
                    page.get_by_label("Pokémon", exact=True).fill("no-such-pokemon-xyz")
                    expect(page.locator(".selection-notice")).to_be_visible()
                    expect(page.locator(".trainer-option")).to_have_count(0)
                    page.get_by_label("Pokémon", exact=True).fill("")
                    expect(first).to_be_visible()
                    page.get_by_role("button", name="Añadir equipo a comparación").click()
                    page.locator(".trainer-option").nth(1).click()
                    page.get_by_role("button", name="Añadir equipo a comparación").click()
                    expect(page.locator(".team-comparison .comparison-team")).to_have_count(2)
                    page.get_by_role("button", name="Quitar de comparación").first.click()
                    page.get_by_role("button", name="Quitar de comparación").first.click()
                    first.click()
                    expect(page.locator(".trainer-detail")).to_be_focused()
                    check_accessible_names(page, "trainers")
                    assert page.locator(".member-card progress").count() == page.locator(".member-card").count() * 12
                    page.screenshot(path=str(captures / f"{name}-trainer.png"), full_page=False)
                    trainer_hash = page.url.split("#", 1)[-1]
                    species_name = page.locator(".member-card h3 a").first.inner_text()
                    page.get_by_label("Pokémon", exact=True).fill(species_name)
                    expect(page.locator(".trainer-option").first).to_be_visible()
                    page.locator(".controls select").first.select_option("plus")
                    expect(page.locator(".member-card").first).to_be_visible()
                    page.reload(wait_until="domcontentloaded")
                    expect(page.locator(".member-card").first).to_be_visible()
                    assert page.url.split("#", 1)[-1] == trainer_hash
                    expect(page.locator(".controls select").first).to_have_value("plus")
                    expect(page.get_by_label("Pokémon", exact=True)).to_have_value(species_name)
                    page.locator(".filters-toggle").click()
                    page.get_by_label("Pokémon", exact=True).fill("")
                    page.get_by_label("Categoría de entrenador").select_option("Rival")
                    expected_rivals = sum(1 for trainer in wiki_data["trainers"] if trainer["class_name"]["en"] == "Rival" and (trainer.get("journey") or {}).get("kind") == "first_visit")
                    expect(page.locator(".section-title .count")).to_contain_text(str(expected_rivals))
                    page.locator(".member-card h3 a").first.click()
                    expect(page.locator(".pokemon-evolution").first).to_be_visible()
                    if not firefox_path:
                        page.wait_for_function("() => window.scrollY === 0")
                    check_accessible_names(page, "pokemon")
                    page.go_back()
                    expect(page.get_by_label("Categoría de entrenador")).to_have_value("Rival")
                    expect(page.locator(".member-card").first).to_be_visible()
                    page.locator(".filters-toggle").click()
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
                    expect(page.locator(".dex-card").first).to_be_visible()
                    expect(page.locator(".dex-card .type-badge img").first).to_be_visible()
                    if not firefox_path:
                        page.wait_for_function("""() => [...document.querySelectorAll('.dex-card img')]
                          .filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0)
                          .every(img => img.complete && img.naturalWidth > 0)""")
                    page.screenshot(path=str(captures / f"{name}-pokedex.png"), full_page=False)
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
                    check_width(page, f"{name} comparison source")
                    page.goto(wiki + "#/cheats", wait_until="domcontentloaded")
                    expect(page.locator(".cheat-card").first).to_be_visible()
                    check_accessible_names(page, "cheats")
                    page.get_by_label("Buscar códigos, títulos o ID").fill(cheat["id"])
                    card = page.locator(".cheat-card").first
                    expect(card).to_contain_text(cheat["id"])
                    card.get_by_text("Código completo", exact=True).click()
                    expect(card.locator("pre code")).to_have_text(cheat["code"])
                    if firefox_path:
                        before = set(download_dir.iterdir())
                        card.get_by_role("button", name="Perfil RetroArch · desactivado").click()
                        deadline = monotonic() + 30
                        while monotonic() < deadline:
                            files = [path for path in set(download_dir.iterdir()) - before if path.suffix == ".cht"]
                            if files and not list(download_dir.glob("*.part")):
                                break
                            sleep(0.1)
                        else:
                            raise AssertionError("Firefox did not save the RetroArch profile")
                        profile = files[0].read_text()
                    else:
                        with page.expect_download() as exported:
                            card.get_by_role("button", name="Perfil RetroArch · desactivado").click()
                        profile = Path(exported.value.path()).read_text()
                    assert 'cheat0_enable = "false"' in profile
                    assert cheat["code"].replace("\n", "+") in profile
                    if firefox_path:
                        # This older patched Juggler can leave the download navigation pending.
                        page.close()
                        page = context.new_page()
                        page.on("pageerror", lambda error: errors.append(str(error)))
                        page.on("response", lambda response: missing_resources.add(f"{response.status} {response.url}") if response.url.startswith(origin + "/") and response.status >= 400 else None)
                        page.on("request", lambda request: patch_requests.append(request.url) if request.url.endswith(".xdelta") else None)
                    page.goto(wiki + "#/kris-progress", wait_until="domcontentloaded")
                    expect(page.locator(".kris-gallery-card").first).to_be_visible()
                    page.get_by_label("Mostrar archivo completo").check()
                    expect(page.locator(".kris-progress [role=status]")).to_contain_text(f'{len(gallery["images"])} / {len(gallery["images"])}')
                    check_accessible_names(page, "kris-progress")
                    page.goto(wiki + "#/patcher", wait_until="domcontentloaded")
                    manifest = json.loads((WEB / "data/patch-manifest-alpha2.json").read_text())
                    expect(page.get_by_role("heading", name="Parcheador de Ultimate Gold")).to_be_visible()
                    patcher_link = page.get_by_role("link", name="Abrir parcheador independiente")
                    expect(patcher_link).to_have_attribute("target", "_blank")
                    expect(patcher_link).to_have_attribute("href", "../index.html?standalone=1&lang=es")
                    if name == "desktop":
                        with page.expect_popup() as opened:
                            patcher_link.click()
                        standalone = opened.value
                        expect(standalone.locator("#rom")).to_be_visible()
                        expect(standalone.locator("#language")).to_have_value("es")
                        expect(standalone.locator("#version")).to_have_value("kris-sprint2")
                        standalone.goto(f"{origin}{PREFIX}index.html?standalone=1&lang=en", wait_until="domcontentloaded")
                        expect(standalone.locator("#language")).to_have_value("en")
                        standalone.locator("#language").select_option("es")
                        expect(standalone.locator('#version option[value="kris-sprint2"]')).to_have_count(1)
                        standalone.locator("#version").select_option("kris-sprint2")
                        expect(standalone.locator("#version-note")).to_contain_text("Alfa 2")
                        expect(standalone.locator("#tmNote")).to_be_hidden()
                        expect(standalone.locator("#buildNote")).to_be_hidden()
                        standalone.locator("#version").select_option("alpha2")
                        expect(standalone.locator("#tmNote")).to_be_visible()
                        expect(standalone.locator("#buildNote")).to_be_visible()
                        standalone.close()
                    expect(page.get_by_text("Entrada requerida. No ofrecemos ROMs ni recibimos tus archivos.")).to_be_visible()
                    expect(page.locator(".patcher-source-card")).to_contain_text(manifest["source"]["sha256"])
                    expect(page.locator(".patcher-source-card")).to_contain_text("128 MiB")
                    page.screenshot(path=str(captures / f"{name}-patcher.png"), full_page=True)
                    check_width(page, f"{name} patcher source")
                    expect(page.frame_locator("iframe").locator("#rom")).to_be_attached()
                    expect(page.frame_locator("iframe").locator("#language")).to_have_value("es")
                    expect(page.frame_locator("iframe").locator("#version")).to_have_value("kris-sprint2")
                    if name == "desktop":
                        frame = page.frame_locator("iframe")
                        expect(frame.locator("#apply")).to_be_enabled()
                        frame.locator("#rom").set_input_files({"name": "wrong.nds", "mimeType": "application/octet-stream", "buffer": b"not a ROM"})
                        frame.locator("#apply").click()
                        expect(frame.locator("#status")).to_contain_text("tamaño incorrecto")
                        expect(frame.locator("#download")).to_be_hidden()
                        if not firefox_path:
                            with TemporaryDirectory(prefix="pug-invalid-input-") as temp:
                                invalid = Path(temp) / "wrong-hash.nds"
                                with invalid.open("wb") as stream:
                                    stream.truncate(manifest["source"]["size"])
                                frame.locator("#rom").set_input_files(str(invalid))
                                frame.locator("#apply").click()
                                expect(frame.locator("#status")).to_contain_text("no coincide con el SHA-256", timeout=30000)
                                expect(frame.locator("#download")).to_be_hidden()
                        assert not patch_requests, "A rejected input requested a patch"
                    for route in ("moves", "items", "machines", "abilities", "evolutions", "guides", "faq", "mechanics", "guide/player", "guide/features"):
                        page.goto(wiki + "#/" + route, wait_until="domcontentloaded")
                        expect(page.locator("main h1").first).to_be_visible()
                        check_width(page, f"{name} {route}")
                        check_accessible_names(page, route)
                        if route == "guides":
                            expect(page.get_by_role("heading", name="Informes de QA y verificación")).to_be_visible()
                            page.get_by_label("Buscar", exact=True).fill("Preguntas frecuentes")
                            expect(page.locator('a[href="#/guide/faq"]')).to_be_visible()
                            expect(page.get_by_role("heading", name="Informes de QA y verificación")).to_have_count(0)
                        if route == "items":
                            page.get_by_label("Buscar", exact=True).fill("Ultra Ball")
                            item = page.locator(".item-entry").first
                            expect(item).to_contain_text("Ultra Ball")
                            expect(item.locator("summary img")).to_be_visible()
                            item.locator(":scope > summary").click()
                            expect(item.get_by_role("link", name="Abrir ficha del objeto")).to_be_visible()
                            expect(item.locator(".acquisition-record").first).to_be_visible()
                            page.screenshot(path=str(captures / f"{name}-items.png"), full_page=False)
                    expect(page.get_by_label("Linaje y ruta de los parches")).to_contain_text("Sacred Gold Plus 1.2.3")
                    expect(page.get_by_label("Linaje y ruta de los parches")).to_contain_text("no una secuencia para apilar parches")
                    page.goto(wiki + "#/items/87", wait_until="domcontentloaded")
                    held_item = page.locator('.acquisition-record').filter(has=page.locator('a[href="#/pokemon/46"]')).first
                    held_item.get_by_text("Fuentes y comprobación", exact=True).click()
                    expect(held_item.locator('a[href="#/pokemon/46"]')).to_be_visible()
                    check_width(page, f"{name} item evidence")
                    page.locator(".controls select").nth(1).select_option("en")
                    page.goto(wiki + "#/guide/features", wait_until="domcontentloaded")
                    expect(page.get_by_label("Lineage and patch routes")).to_contain_text("not a patch-stacking recipe")
                    page.locator(".controls select").nth(1).select_option("es")
                    sections = {
                        "Primeros pasos": ["#/", "#/guide/player", "#/patcher", "#/faq"],
                        "Aventura": ["#/trainers", "#/guides", "#/kris-progress"],
                        "Enciclopedia": ["#/pokemon", "#/evolutions", "#/moves", "#/abilities", "#/items", "#/machines", "#/mechanics"],
                        "Proyecto": ["#/guide/features", "#/guide/progress", "#/guide/sources-inventory", "#/cheats"],
                    }
                    headings = {
                        "#/": "Tu guía de Johto.", "#/guide/player": "Guía del jugador", "#/patcher": "Parcheador de Ultimate Gold",
                        "#/faq": "Preguntas frecuentes", "#/trainers": "Preparación de combates", "#/guides": "Guías",
                        "#/kris-progress": "Progreso de Kris", "#/pokemon": "Pokédex", "#/evolutions": "Evoluciones",
                        "#/moves": "Movimientos", "#/abilities": "Habilidades", "#/items": "Objetos", "#/machines": "MT / MO",
                        "#/mechanics": "Mecánicas y compatibilidad", "#/guide/features": "Características de Ultimate Gold",
                        "#/guide/progress": "Estado del proyecto", "#/guide/sources-inventory": "Inventario de fuentes", "#/cheats": "Catálogo de trucos",
                    }
                    for group, links in sections.items():
                        for href in links:
                            if name == "mobile":
                                page.get_by_role("button", name="Abrir menú").click()
                            nav = page.get_by_role("navigation", name="Wiki")
                            nav.get_by_role("button", name=group, exact=True).click()
                            expect(nav.get_by_role("button", name=group, exact=True)).to_have_attribute("aria-pressed", "true")
                            nav.locator(f'a[href="{href}"]').click()
                            expect(page).to_have_url(wiki + (href if href != "#/" else "#/"))
                            if href == "#/":
                                expect(page.locator(".home-page")).to_be_visible()
                            expect(page.locator("main h1").first).to_have_text(headings[href])
                            expect(page.get_by_text("Datos de la wiki de la versión indicada.")).to_have_count(0)
                            check_width(page, f"{name} navigation {href}")
                            check_accessible_names(page, f"navigation {href}")
                            page.screenshot(path=str(captures / f"{name}-section-{href[2:].replace('/', '-') or 'home'}.png"), full_page=False)
                    if name == "mobile":
                        page.get_by_role("button", name="Abrir menú").click()
                    nav = page.get_by_role("navigation", name="Wiki")
                    nav.get_by_role("button", name="Proyecto").click()
                    expect(nav.get_by_role("link", name="Créditos y licencias")).to_have_attribute("href", "../LICENSES.html")
                    assert context.request.get(origin + PREFIX + "LICENSES.html").ok
                    context.close()
                if not firefox_path:
                    for width in (320, 390, 850, 1000, 1200, 1400, 1440):
                        context = browser.new_context(viewport={"width": width, "height": 850})
                        context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(origin + "/") else route.abort())
                        page = context.new_page()
                        page.goto(wiki, wait_until="domcontentloaded")
                        expect(page.locator(".home-page")).to_be_visible()
                        page.locator(".controls select").nth(1).select_option("es")
                        if width <= 850:
                            page.get_by_role("button", name="Abrir menú").click()
                        nav = page.get_by_role("navigation", name="Wiki")
                        nav.get_by_role("button", name="Enciclopedia").click()
                        expect(nav.get_by_role("link", name="Evoluciones")).to_be_visible()
                        check_width(page, f"navigation at {width}px")
                        if width >= 1400:
                            categories = page.locator(".nav-categories").bounding_box()
                            controls = page.locator(".controls").bounding_box()
                            assert categories and controls and categories["x"] + categories["width"] <= controls["x"], f"Header overlap at {width}px"
                        if width in (320, 390, 1400):
                            page.screenshot(path=str(captures / f"navigation-{width}.png"))
                        context.close()
                assert not errors, errors
                assert not missing_resources, sorted(missing_resources)
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
    print(json.dumps({"result": "passed", "captures": str(captures), "scope": "local browser UI smoke; no ROM or patch execution", "firefox_skipped": ["DOM evaluation checks under CSP", "large wrong-hash input"] if os.environ.get("PUG_FIREFOX") else []}))


if __name__ == "__main__":
    main()
