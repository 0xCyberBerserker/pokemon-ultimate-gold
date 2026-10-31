#!/usr/bin/env python3
"""Build the static Pages payload from local docs and the verified delta."""
from pathlib import Path
from html.parser import HTMLParser
import argparse
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
MANIFEST_KRIS_SPRINT2 = ROOT / "patches" / "manifest-kris-sprint2.json"
PATCHER_DEFAULT = "kris-sprint2"
WIKI_DATA_VERSION = "alpha2"
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

def build_patch_catalog(alpha1: dict, alpha2: dict, kris_sprint2: dict, default_version: str = PATCHER_DEFAULT) -> dict:
    if default_version not in ("alpha1", "alpha2", "kris-sprint2"):
        raise SystemExit("Unknown default build")
    if alpha2.get("status") != "EXPERIMENTAL_TESTED_PARTIAL" or alpha2.get("default") is not True:
        raise SystemExit("Historical Alpha 2 manifest must remain experimental and unchanged")
    if alpha2["source"] != alpha1["source"]:
        raise SystemExit("Alpha 2 source must match the clean Alpha 1 input")
    if (kris_sprint2.get("status") != "EXPERIMENTAL_SPRINT_ACCEPTED"
            or kris_sprint2.get("default") is not False
            or kris_sprint2.get("source") != alpha1["source"]):
        raise SystemExit("Historical Kris Sprint 2 manifest must remain experimental and match the clean source")
    return {
        "schema": "ultimate-gold-patch-catalog/v1",
        "default": default_version,
        "wiki_data": WIKI_DATA_VERSION,
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
            "kris-sprint2": {
                "label": {"en": "Ultimate Gold — cumulative, experimental", "es": "Ultimate Gold — acumulativa, experimental"},
                "note": {"en": "Latest cumulative candidate: Kris and updated credits, with earlier features and an experimental stat editor included by reviewed lineage. Editor cases were tested on earlier builds; no new editor QA was performed on this candidate. Known Bag crop/contrast limits remain; full adventure and hardware are not certified. Wiki data and cheat checks are based on Alpha 2 and have not been verified against this candidate. Cross-build save compatibility has not been established. Uses your clean HeartGold USA dump.", "es": "Candidata acumulativa más reciente: Kris y créditos actualizados, con funciones anteriores y un editor de estadísticas experimental incluidos por linaje revisado. Los casos del editor se probaron en versiones anteriores; no se realizaron nuevas pruebas del editor en esta candidata. Se mantienen los límites de recorte/contraste de la Bolsa; no se certifican aventura completa ni hardware. Los datos de la wiki y las comprobaciones de trucos corresponden a Alfa 2 y no se han verificado contra esta candidata. No se ha establecido la compatibilidad de partidas entre versiones. Usa tu dump limpio de HeartGold USA."},
                "manifest": "./patch-manifest-kris-sprint2.json",
                "status": kris_sprint2["status"],
                "experimental": True,
            },
        },
    }

def export_patch_payload(web_root: Path, alpha1: dict, alpha2: dict, kris_sprint2: dict, default_version: str = PATCHER_DEFAULT) -> dict:
    catalog = build_patch_catalog(alpha1, alpha2, kris_sprint2, default_version)
    assets = web_root / "assets"; assets.mkdir(parents=True, exist_ok=True)
    data_dir = web_root / "data"; data_dir.mkdir(parents=True, exist_ok=True)
    published = {}
    for version, manifest, source, filename in (
            ("alpha1", alpha1, MANIFEST_ALPHA1, "patch-manifest-alpha1.json"),
            ("alpha2", alpha2, MANIFEST_ALPHA2, "patch-manifest-alpha2.json"),
            ("kris-sprint2", kris_sprint2, MANIFEST_KRIS_SPRINT2, "patch-manifest-kris-sprint2.json")):
        delta = ROOT / "patches" / manifest["delta"]["file"]
        shutil.copyfile(delta, assets / delta.name)
        public_manifest = json.loads(json.dumps(manifest))
        public_manifest["default"] = version == default_version
        public_manifest["publication_metadata"] = {"source_manifest_sha256": digest(source)}
        public_manifest["limits"] = [limit for limit in public_manifest.get("limits", []) if "default" not in limit.lower()]
        published[version] = json.dumps(public_manifest, ensure_ascii=False, indent=2) + "\n"
        (data_dir / filename).write_text(published[version], encoding="utf-8")
    (data_dir / "patch-manifest.json").write_text(published[default_version], encoding="utf-8")
    (data_dir / "patch-catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return catalog

class ReactIndexParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.csp = None
        self.csp_count = 0
        self.assets = []
        self.in_head = False
        self.resource_seen = False
        self.invalid_csp_order = False
        self.duplicate_attributes = False

    def handle_starttag(self, tag, attrs):
        names = [name for name, _ in attrs]
        if len(names) != len(set(names)):
            self.duplicate_attributes = True
        attrs = dict(attrs)
        if tag == "head":
            self.in_head = True
        if tag == "meta" and attrs.get("http-equiv", "").lower() == "content-security-policy":
            self.csp = attrs.get("content", "")
            self.csp_count += 1
            if not self.in_head or self.resource_seen:
                self.invalid_csp_order = True
        if tag == "script":
            self.resource_seen = True
            self.assets.append(attrs.get("src", ""))
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.resource_seen = True
            self.assets.append(attrs.get("href", ""))

    def handle_endtag(self, tag):
        if tag == "head":
            self.in_head = False

def prepare_react_site(dist: Path, wiki: Path, legacy_index: bytes):
    """Preflight an opt-in React build before the generator writes anything."""
    index = dist / "index.html"
    assets = dist / "assets"
    if dist.is_symlink() or wiki.is_symlink() or index.is_symlink() or assets.is_symlink() or not index.is_file() or not assets.is_dir():
        raise ValueError("React build index or assets missing or unsafe")
    index_bytes = index.read_bytes()
    parser = ReactIndexParser()
    parser.feed(index_bytes.decode("utf-8"))
    directives = [part.strip() for part in (parser.csp or "").split(";") if part.strip()]
    directive_names = [part.split()[0].lower() for part in directives]
    required = {"default-src 'self'", "script-src 'self'", "style-src 'self'", "object-src 'none'", "base-uri 'none'"}
    if parser.csp_count != 1 or parser.invalid_csp_order or parser.duplicate_attributes or len(directive_names) != len(set(directive_names)) or not required.issubset(set(directives)) or "unsafe-inline" in (parser.csp or "") or "unsafe-eval" in (parser.csp or ""):
        raise ValueError("React build CSP is missing or relaxed")
    files = {}
    for path in assets.iterdir():
        if path.is_symlink() or not path.is_file() or not re.fullmatch(r"[A-Za-z0-9_-]+-[A-Za-z0-9_-]+\.(?:js|css)", path.name):
            raise ValueError("React build contains an unsafe asset")
        files[path.name] = path.read_bytes()
    if not parser.assets or not any(name.endswith('.js') for name in parser.assets) or not any(name.endswith('.css') for name in parser.assets):
        raise ValueError("React build entry assets missing")
    if any(not name.startswith('./assets/') or name[9:] not in files for name in parser.assets):
        raise ValueError("React build entry asset invalid or missing")
    destination_index = wiki / "index.html"
    receipt_path = wiki / ".react-build.json"
    if receipt_path.is_symlink():
        raise ValueError("Existing React build receipt is unsafe")
    receipt_hash = None
    if receipt_path.exists():
        try:
            receipt = json.loads(receipt_path.read_text(encoding="utf-8"))
            if receipt.get("schema") != "ultimate-gold-react-index/v1" or not re.fullmatch(r"[0-9a-f]{64}", receipt.get("index_sha256", "")):
                raise ValueError("Invalid receipt")
            receipt_hash = receipt["index_sha256"]
        except (OSError, ValueError, TypeError, AttributeError) as error:
            raise ValueError("Existing React build receipt is invalid") from error
    existing_index = destination_index.read_bytes() if destination_index.is_file() and not destination_index.is_symlink() else None
    known_index = existing_index in (legacy_index, index_bytes) or (existing_index is not None and receipt_hash == hashlib.sha256(existing_index).hexdigest())
    if destination_index.is_symlink() or (destination_index.exists() and not known_index):
        raise ValueError("Existing wiki index has local changes")
    destination = wiki / "assets"
    if destination.is_symlink() or (destination.exists() and not destination.is_dir()):
        raise ValueError("Existing wiki assets directory is unsafe")
    for name, content in files.items():
        target = destination / name
        if target.is_symlink() or (target.exists() and (not target.is_file() or target.read_bytes() != content)):
            raise ValueError("Existing wiki asset conflicts with React build")
    return index_bytes, files

def install_react_site(plan, wiki: Path):
    index, files = plan
    destination = wiki / "assets"
    if wiki.is_symlink() or destination.is_symlink() or (wiki / "index.html").is_symlink() or (wiki / ".react-build.json").is_symlink():
        raise ValueError("Wiki destination changed after preflight")
    destination.mkdir(parents=True, exist_ok=True)
    for name, content in files.items():
        target = destination / name
        if target.is_symlink() or (target.exists() and target.read_bytes() != content):
            raise ValueError("Existing wiki asset changed after preflight")
        if not target.exists():
            target.write_bytes(content)
    (wiki / "index.html").write_bytes(index)
    receipt = {"schema": "ultimate-gold-react-index/v1", "index_sha256": hashlib.sha256(index).hexdigest()}
    (wiki / ".react-build.json").write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")

def main(react_dist: Path | None = None) -> int:
    react_plan = prepare_react_site(react_dist, WEB / "wiki", (WEB / "wiki-template.html").read_bytes()) if react_dist is not None else None
    current = verify_manifest()
    alpha1 = verify_manifest(MANIFEST_ALPHA1)
    alpha2 = verify_manifest(MANIFEST_ALPHA2)
    kris_sprint2 = verify_manifest(MANIFEST_KRIS_SPRINT2)
    if current != alpha2:
        raise SystemExit("Wiki data reference manifest must match Alpha 2")
    export_patch_payload(WEB, alpha1, alpha2, kris_sprint2)
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
    if react_plan is not None:
        install_react_site(react_plan, wiki)
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
    pattern = re.compile(r"!\[([^\]]*)\]\((\.\./(?:assets/(?:locations|qa)|web/assets/qa)/[A-Za-z0-9][A-Za-z0-9._-]*\.png)\)")
    matches = list(pattern.finditer(line))
    if not matches:
        return None
    figures = []
    cursor = 0
    for match in matches:
        if line[cursor:match.start()].strip():
            return None
        alt, source = match.groups()
        if source.startswith("../web/assets/qa/"):
            source = "../assets/qa/" + source.removeprefix("../web/assets/qa/")
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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--react-dist", type=Path, help="opt in to a prebuilt React wiki after local verification")
    raise SystemExit(main(parser.parse_args().react_dist))
