#!/usr/bin/env python3
"""Build the static Pages payload from local docs and the verified delta."""
from pathlib import Path
import html
import csv
import json
import re
import shutil
import hashlib
try:
    from tools.basegame_item_locations import apply_basegame_locations, PINNED_COMPARE_REPORT
except ModuleNotFoundError:
    from basegame_item_locations import apply_basegame_locations, PINNED_COMPARE_REPORT

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
MANIFEST = ROOT / "patches" / "manifest.json"
MANIFEST_ALPHA1 = ROOT / "patches" / "manifest-alpha1.json"
MANIFEST_ALPHA2 = ROOT / "patches" / "manifest-alpha2.json"
CHEAT = ROOT / "config" / "cheats" / "DeSmuME" / "Sacred-Gold-Plus-Drayano-QoL-fix1.cht"

GUIDES = {
    "progress": ("project-status.md", "Project status", "Estado del proyecto"),
    "faq": ("faq.md", "FAQ", "Preguntas frecuentes"),
    "player": ("player-guide.md", "Player guide", "Guía del jugador"),
    "trainer-battles": ("trainer-battles.md", "Trainer journey and game modes", "Entrenadores y modos de juego"),
    "mechanics": ("technical-compatibility.md", "Mechanics and compatibility", "Mecánicas y compatibilidad"),
    "items": ("evolution-items-qol.md", "Evolution items and shops", "Objetos evolutivos y tiendas"),
    "evolutions": ("data-guide.md", "Evolution and encounter data", "Datos de evolución y encuentros"),
    "cheats": ("cheat-codes.md", "Cheat codes", "Códigos de trucos"),
    "cheat-runtime-qa": ("cheat-runtime-qa.md", "Cheat runtime QA", "Pruebas de trucos en runtime"),
    "battle-frontier": ("battle-frontier.md", "Battle Frontier", "Frontera de Batalla"),
    "world-tournament-feasibility": ("world-tournament-feasibility.md", "World Tournament feasibility", "Viabilidad del PWT"),
    "hm": ("hm-field-qol.md", "Field HMs", "MO en el campo"),
    "tm-refill": ("tm-refill-item.md", "TM refill item", "Objeto de recarga de MT"),
    "kit": ("cheat-kit.md", "Optional Rocket kit", "Kit Rocket opcional"),
    "stat-editor": ("ev-iv-kit-feasibility.md", "EV, IV and nature editor study", "Estudio del editor de EV, IV y naturalezas"),
    "stat-editor-qa": ("stat-editor-qa.md", "Stat editor: native QA", "Editor de estadísticas: QA nativo"),
    "kris": ("kris-feasibility.md", "Kris compatibility study", "Estudio de compatibilidad de Kris"),
    "combined-kit-shop-qa": ("combined-kit-shop-qa.md", "Kit and evolution-shop QA", "Pruebas del kit y tiendas evolutivas"),
    "repel-remaining-qa": ("repel-remaining-qa.md", "Repel duration and reuse QA", "Pruebas de duración y reutilización de repelentes"),
    "kit-regression-fix6a": ("kit-regression-fix6a.md", "Reusable Candy and Berry regression QA", "Regresión de caramelos y bayas reutilizables"),
    "qa-hm-events": ("qa-hm-events.md", "Exact HM obstacle data", "Datos exactos de obstáculos de MO"),
    "hm-remaining-qa": ("hm-remaining-qa.md", "HM navigation diagnostics", "Diagnóstico de navegación para MO"),
    "hm-strength-fix6a": ("hm-strength-fix6a.md", "Native Strength and boulder QA", "Pruebas nativas de Fuerza y empuje de rocas"),
    "rock-smash-fix6a": ("rock-smash-fix6a.md", "Native Rock Smash QA", "Pruebas nativas de Golpe Roca"),
    "hm-cut-fix6a": ("hm-cut-fix6a.md", "Native Cut QA", "Pruebas nativas de Corte"),
    "hm-whirlpool-fix6a": ("hm-whirlpool-fix6a.md", "Native Whirlpool crossing QA", "Pruebas nativas de cruce con Torbellino"),
    "hm-waterfall-fix6a": ("hm-waterfall-fix6a.md", "Native Waterfall ascent QA", "Pruebas nativas de ascenso con Cascada"),
    "hm-rock-climb-walk-fix6a": ("hm-rock-climb-walk-fix6a.md", "On-foot Rock Climb QA", "Pruebas de Treparrocas a pie"),
    "hm-fly-surf-fix6a": ("hm-fly-surf-fix6a.md", "Combined-build Fly, Surf and save QA", "Pruebas de Vuelo, Surf y guardado del combinado"),
    "qa-independent-review": ("qa-independent-review.md", "Independent QA review", "Revisión independiente de QA"),
    "tm-guide": ("tm-guide.md", "TMs and HMs", "MT y MO"),
    "qa": ("qa-493.md", "Tested features", "Funciones comprobadas"),
    "sources": ("wiki-data-sources.md", "Data and sprite sources", "Fuentes de datos y sprites"),
}

def localized_guides():
    """Keep the two authored languages separate in the browser data."""
    result = {}
    available = dict(GUIDES)
    known = {value[0] for value in available.values()}
    for source in sorted((ROOT / "docs").glob("*.md")):
        if source.name not in known and source.name != "README.md":
            heading = source.read_text(encoding="utf-8").splitlines()[0].lstrip("# ")
            labels = heading.split(" / ", 1)
            available[source.stem] = (source.name, labels[0], labels[-1])
    for slug, (filename, english, spanish) in available.items():
        source = ROOT / "docs" / filename
        if not source.is_file():
            continue
        content = source.read_text(encoding="utf-8")
        parts = re.split(r"^## (English|Español)\s*$", content, flags=re.MULTILINE)
        bodies = {}
        for index in range(1, len(parts), 2):
            language = "en" if parts[index] == "English" else "es"
            bodies[language] = render_markdown(parts[index+1])
        result[slug] = {"title": {"en": english, "es": spanish}, "body": bodies}
    player_slugs = ["player", "trainer-battles", "battle-frontier", "mechanics", "items", "tm-guide", "tm-refill", "kit", "repel-reuse", "hm", "cheats", "cheat-runtime-qa"]
    groups = [({"en":"Playing Ultimate Gold","es":"Jugar a Ultimate Gold"}, player_slugs),
              ({"en":"Project, sources and verification","es":"Proyecto, fuentes y comprobaciones"},
               [slug for slug in result if slug not in player_slugs and slug != "faq"])]
    result["guides"] = {
        "title": {"en": "Guides and resources", "es": "Guías y recursos"},
        "body": {language: ''.join('<section><h2>'+html.escape(label[language])+'</h2><div class="guide-index">' + ''.join(
            f'<a href="#/guide/{slug}"><h3>{html.escape(result[slug]["title"][language])}</h3></a>'
            for slug in slugs if slug in result) + '</div></section>' for label, slugs in groups) for language in ("en", "es")},
    }
    return result

def redirect_page(route):
    destination = "./#" + route
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<meta http-equiv="refresh" content="0;url={destination}">'
            '<title>Ultimate Gold Wiki</title></head><body>'
            f'<a href="{destination}">Ultimate Gold Wiki</a></body></html>')

def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""): h.update(chunk)
    return h.hexdigest()

def verify_manifest(path: Path | None = None) -> dict:
    path = path or MANIFEST
    manifest = json.loads(path.read_text(encoding="utf-8")); spec = manifest["delta"]
    delta = ROOT / "patches" / spec["file"]
    if Path(spec["file"]).name != spec["file"] or not delta.is_file() or spec["size"] != delta.stat().st_size or spec["sha256"] != digest(delta):
        label = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path.name
        raise SystemExit(f"delta does not match {label}")
    if path == MANIFEST and not CHEAT.is_file(): raise SystemExit(f"missing cheat profile: {CHEAT}")
    for evidence in manifest.get("evidence_reports", []):
        report = (ROOT / evidence["file"]).resolve()
        if not report.is_relative_to(ROOT) or not report.is_file() or digest(report) != evidence["sha256"]:
            raise SystemExit(f"QA report does not match manifest: {evidence['file']}")
    return manifest

def build_patch_catalog(alpha1: dict, alpha2: dict, default_version: str = "alpha1") -> dict:
    if default_version not in ("alpha1", "alpha2"):
        raise SystemExit("Unknown default build")
    if alpha2.get("status") != "EXPERIMENTAL_TESTED_PARTIAL" or alpha2.get("default") is not (default_version == "alpha2"):
        raise SystemExit("Alpha 2 must remain experimental and match the selected default")
    if alpha2["source"] != alpha1["source"]:
        raise SystemExit("Alpha 2 source must match the clean Alpha 1 input")
    return {
        "schema": "ultimate-gold-patch-catalog/v1",
        "default": default_version,
        "versions": {
            "alpha1": {
                "label": {"en": "Alpha 1 — previous build", "es": "Alfa 1 — versión anterior"},
                "note": {"en": "Previous tested-partial build." + (" Selected by default." if default_version == "alpha1" else ""), "es": "Versión anterior con pruebas parciales." + (" Seleccionada por defecto." if default_version == "alpha1" else "")},
                "manifest": "./patch-manifest-alpha1.json",
                "status": alpha1["status"],
            },
            "alpha2": {
                "label": {"en": "Alpha 2 — experimental, tested partial", "es": "Alfa 2 — experimental, pruebas parciales"},
                "note": {"en": "Experimental exact-FIX6a build with bounded QA. Full-story testing is pending; EVIV editing and Kris are not included.", "es": "Build experimental FIX6a exacto con QA acotado. Falta probar la historia completa; no incluye editor EVIV ni Kris."},
                "manifest": "./patch-manifest-alpha2.json",
                "status": alpha2["status"],
                "experimental": True,
            },
        },
    }

def export_patch_payload(web_root: Path, alpha1: dict, alpha2: dict, default_version: str = "alpha1") -> dict:
    catalog = build_patch_catalog(alpha1, alpha2, default_version)
    assets = web_root / "assets"; assets.mkdir(parents=True, exist_ok=True)
    data_dir = web_root / "data"; data_dir.mkdir(parents=True, exist_ok=True)
    for manifest, filename in ((alpha1, "patch-manifest-alpha1.json"), (alpha2, "patch-manifest-alpha2.json")):
        delta = ROOT / "patches" / manifest["delta"]["file"]
        shutil.copyfile(delta, assets / delta.name)
        source = MANIFEST_ALPHA1 if filename == "patch-manifest-alpha1.json" else MANIFEST_ALPHA2
        shutil.copyfile(source, data_dir / filename)
    shutil.copyfile(MANIFEST, data_dir / "patch-manifest.json")
    (data_dir / "patch-catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return catalog

def main() -> int:
    current = verify_manifest()
    alpha1 = verify_manifest(MANIFEST_ALPHA1)
    alpha2 = verify_manifest(MANIFEST_ALPHA2)
    matching = [version for version, manifest in (("alpha1", alpha1), ("alpha2", alpha2)) if manifest == current]
    if len(matching) != 1:
        raise SystemExit("Default manifest must match exactly one versioned manifest")
    export_patch_payload(WEB, alpha1, alpha2, matching[0])
    shutil.copyfile(CHEAT, WEB / "assets" / "Sacred-Gold-Plus-Drayano-QoL-fix1.cht")
    wiki = WEB / "wiki"; wiki.mkdir(parents=True, exist_ok=True)
    pages = sorted((ROOT / "docs").glob("*.md"))
    data_pages = sorted((ROOT / "docs").glob("*.csv"))
    json_pages = sorted((ROOT / "docs").glob("*.json"))
    all_pages = pages + data_pages
    for stale in wiki.glob("*.html"): stale.unlink()
    links = "".join(f'<li><a href="{p.stem}.html">{html.escape(p.stem)}</a></li>' for p in all_pages)
    nav = '<p><a href="./">Wiki</a> · <a href="../">Patcher</a> · <a href="../LICENSES.html">Licenses</a></p>'
    csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\'; object-src \'none\'; base-uri \'none\'">'
    (wiki / "index.html").write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8">{csp}<meta name="viewport" content="width=device-width,initial-scale=1"><title>Wiki / Wiki</title><link rel="stylesheet" href="../style.css"></head><body><main><h1>Wiki / Wiki</h1><label for="page-search">Search / Buscar</label> <input id="page-search" type="search"><ul id="pages">'+links+'</ul>'+nav+'<script src="../wiki.js"></script></main></body></html>', encoding="utf-8")
    for page in pages:
        body = render_markdown(page.read_text(encoding="utf-8"))
        (wiki / f"{page.stem}.html").write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8">{csp}<meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(page.stem)}</title><link rel="stylesheet" href="../style.css"></head><body><main>{nav}<article>{body}</article></main></body></html>', encoding="utf-8")
    for page in data_pages:
        body = render_data(page)
        raw = f'<p><a href="../data/{page.stem}.json">Download raw JSON / Descargar JSON</a></p>' if (ROOT / "docs" / f"{page.stem}.json").is_file() else ""
        (wiki / f"{page.stem}.html").write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8">{csp}<meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(page.stem)}</title><link rel="stylesheet" href="../style.css"></head><body><main>{nav}<h1>{html.escape(page.stem)}</h1>{raw}{body}</main><script src="../wiki.js"></script></body></html>', encoding="utf-8")
    data_dir = WEB / "data"; data_dir.mkdir(exist_ok=True)
    for page in json_pages: shutil.copyfile(page, data_dir / page.name)
    encyclopedia_source = ROOT / "docs" / "wiki-data.json"
    if encyclopedia_source.is_file():
        encyclopedia = json.loads(encyclopedia_source.read_text(encoding="utf-8"))
        if len(encyclopedia.get("species", [])) != 493:
            raise SystemExit("Wiki must contain exactly 493 species")
        basegame_reference = ROOT / "docs" / "basegame-item-locations.json"
        if basegame_reference.is_file():
            reference = json.loads(basegame_reference.read_text(encoding="utf-8"))
            comparison_path = ROOT / "docs" / PINNED_COMPARE_REPORT
            comparison_bytes = comparison_path.read_bytes() if comparison_path.is_file() else None
            comparison = json.loads(comparison_bytes) if comparison_bytes is not None else None
            apply_basegame_locations(encyclopedia, reference, comparison, comparison_bytes)
        encyclopedia["guides"] = localized_guides()
        (data_dir / "wiki-data.json").write_text(json.dumps(encyclopedia, ensure_ascii=False), encoding="utf-8")
        shutil.copyfile(WEB / "wiki-template.html", wiki / "index.html")
        guide_routes = {value[0]: slug for slug, value in GUIDES.items()}
        for page in pages:
            route = "/" if page.stem == "README" else ("/faq" if page.stem == "faq" else "/guide/" + guide_routes.get(page.name, page.stem))
            (wiki / f"{page.stem}.html").write_text(redirect_page(route), encoding="utf-8")
        data_routes = {"species-493": "/pokemon", "trainers-all-final": "/trainers",
                       "trainers-final": "/trainers", "moves-final": "/moves",
                       "drayano-derived-493": "/guide/drayano-crosscheck",
                       "mod-derived-crosscheck": "/guide/mods-crosscheck"}
        for page in data_pages:
            shutil.copyfile(page, data_dir / page.name)
            (wiki / f"{page.stem}.html").write_text(redirect_page(data_routes.get(page.stem, "/guides")), encoding="utf-8")
    (WEB / "wiki.js").write_text("const s=document.getElementById('page-search');if(s)s.oninput=()=>[...document.querySelectorAll('#pages li')].forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(s.value.toLowerCase()));const f=document.getElementById('table-filter');if(f)f.oninput=()=>[...document.querySelectorAll('#data-table tbody tr')].forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(f.value.toLowerCase()));", encoding="utf-8")
    provenance = {'engine': 'RomPatcher.js', 'upstream_commit': '4f17297cd1dc0835a0b0747497fa15f5f63f1623', 'license': 'MIT', 'files': {p.name: digest(p) for p in (WEB / 'vendor' / 'rompatcher').glob('*.js')}}
    (WEB / "vendor" / "provenance.json").write_text(json.dumps(provenance, indent=2) + "\n", encoding="utf-8")
    (WEB / "LICENSES.html").write_text('<!doctype html><html lang="en"><head><meta charset="utf-8">' + csp + '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Credits / Créditos</title><link rel="stylesheet" href="./style.css"></head><body><main><h1>Credits / Créditos</h1><h2>English</h2><p>Sacred Gold and the official Speed-Up: Drayano. Plus 1.2.3: Umberto-DEV and contributors, building on NefariousnessNo3436 and the Fairy work credited to mikelan / Mikelan98. Upstream tools use GPL-3.0-or-later; third-party game rights remain with their owners.</p><p>RomPatcher.js: Marc Robledo, vendored under MIT. Original VCDIFF attribution also credits Joshua MacDonald under Apache-2.0. The retained <a href="./vendor/rompatcher/LICENSE">license</a>, source notices and <a href="./vendor/provenance.json">file hashes</a> identify the shipped engine.</p><p>Our authored guides and factual exports do not relicense third-party assets. No ROM, save, original manual or emulator binary is included.</p><h2 lang="es">Español</h2><p>Sacred Gold y Speed-Up oficial: Drayano. Plus 1.2.3: Umberto-DEV y colaboradores, sobre el trabajo de NefariousnessNo3436 y Hada de mikelan / Mikelan98. Las herramientas upstream usan GPL-3.0-or-later; los recursos del juego conservan los derechos de sus titulares.</p><p>RomPatcher.js: Marc Robledo, bajo MIT. Los avisos originales de VCDIFF acreditan además a Joshua MacDonald bajo Apache-2.0. Se conservan licencia, avisos y hashes del motor. Nuestras guías y tablas factuales no relicencian recursos de terceros. No se incluyen ROM, partidas, manuales originales ni binarios de emulador.</p><p><a href="./wiki/sources-inventory.html">Sources / Fuentes</a> · <a href="./">Patcher</a> · <a href="./wiki/">Wiki</a></p><footer>Made with 🖤 in Barcelona City 🇪🇸</footer></main></body></html>', encoding="utf-8")
    return 0

def inline(value: str) -> str:
    escaped = html.escape(value)
    escaped = re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    def link(match):
        label, target = match.group(1), match.group(2)
        if target.startswith(("http://", "https://")): href = target
        elif target.startswith("../web/wiki/#/"): href = "#" + target.split("#", 1)[1]
        elif target in ("../patches/manifest.json", "../patches/manifest-alpha1.json", "../patches/manifest-alpha2.json"): href = "../data/patch-" + Path(target).name
        elif target == "../config/cheats/DeSmuME/Sacred-Gold-Plus-Drayano-QoL-fix1.cht": href = "../assets/Sacred-Gold-Plus-Drayano-QoL-fix1.cht"
        elif target.endswith(".json") and not target.startswith(("/", "../")): href = "../data/" + Path(target).name
        elif target.endswith((".md", ".csv")) and not target.startswith(("/", "../")): href = Path(target).with_suffix(".html").name
        else: return match.group(0)
        return f'<a href="{html.escape(href, quote=True)}">{label}</a>'
    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, escaped)

def guide_image_gallery(line: str) -> str | None:
    """Crop location images; preserve both screens in local QA menu images."""
    pattern = re.compile(r"!\[([^\]]*)\]\((\.\./assets/(?:locations|qa)/[A-Za-z0-9][A-Za-z0-9._-]*\.png)\)")
    matches = list(pattern.finditer(line))
    if not matches:
        return None
    figures = []
    cursor = 0
    for match in matches:
        if line[cursor:match.start()].strip():
            return None
        alt, source = match.groups()
        safe_alt = html.escape(alt, quote=True)
        safe_source = html.escape(source, quote=True)
        full_screen_class = ' guide-capture-full' if source.startswith('../assets/qa/') else ''
        figures.append(
            f'<figure class="acquisition-capture guide-capture{full_screen_class}">'
            f'<a class="acquisition-capture-frame guide-capture-frame" href="{safe_source}" target="_blank" rel="noopener">'
            f'<img src="{safe_source}" alt="{safe_alt}" loading="lazy"></a>'
            f'<figcaption>{safe_alt}</figcaption></figure>'
        )
        cursor = match.end()
    if line[cursor:].strip():
        return None
    return '<div class="acquisition-captures guide-captures">' + ''.join(figures) + '</div>'

def render_markdown(source: str) -> str:
    lines, output, listing, rows, code = source.splitlines(), [], False, [], False
    def flush_table():
        nonlocal rows
        if not rows: return
        head, *body = rows
        output.append('<div class="table-wrap"><table><thead><tr>' + ''.join(f'<th>{inline(c.strip())}</th>' for c in head) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join(f'<td>{inline(c.strip())}</td>' for c in row) + '</tr>' for row in body) + '</tbody></table></div>'); rows = []
    for line in lines:
        if line.startswith("```"):
            if code: output.append("</code></pre>"); code = False
            else: flush_table(); output.append("<pre><code>"); code = True
            continue
        if code: output.append(html.escape(line) + "\n"); continue
        if line.startswith("|") and line.endswith("|"):
            if set(line.replace("|", "").replace("-", "").replace(":", "").strip()) == set(): continue
            if listing: output.append("</ul>"); listing = False
            rows.append(line.strip("|").split("|")); continue
        flush_table()
        gallery = guide_image_gallery(line)
        if gallery:
            if listing: output.append("</ul>"); listing = False
            output.append(gallery); continue
        if listing and not line.startswith("- "): output.append("</ul>"); listing = False
        if line.startswith("# "): output.append(f"<h1>{html.escape(line[2:])}</h1>")
        elif line.startswith("## "): output.append(f"<h2>{html.escape(line[3:])}</h2>")
        elif line.startswith("### "): output.append(f"<h3>{html.escape(line[4:])}</h3>")
        elif line.startswith("- "):
            if not listing: output.append("<ul>"); listing = True
            output.append(f"<li>{inline(line[2:])}</li>")
        elif line.strip(): output.append(f"<p>{inline(line)}</p>")
    if listing: output.append("</ul>")
    flush_table(); return "\n".join(output)

def render_data(path: Path) -> str:
    if path.suffix == ".csv":
        rows = list(csv.reader(path.read_text(encoding="utf-8").splitlines()))
        if not rows: return ""
        head, *body = rows
        return '<label for="table-filter">Filter / Filtrar</label> <input id="table-filter" type="search"><div class="table-wrap"><table id="data-table"><thead><tr>' + ''.join(f'<th>{html.escape(c)}</th>' for c in head) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join(f'<td>{html.escape(c)}</td>' for c in row) + '</tr>' for row in body) + '</tbody></table></div>'
    return "<pre><code>" + html.escape(json.dumps(json.loads(path.read_text(encoding="utf-8")), ensure_ascii=False, indent=2)) + "</code></pre>"

if __name__ == "__main__": raise SystemExit(main())
