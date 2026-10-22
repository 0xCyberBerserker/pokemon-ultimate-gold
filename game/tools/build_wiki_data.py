#!/usr/bin/env python3
"""Build a localized encyclopedia from the exact ROM and pinned public references."""
from __future__ import annotations
import argparse
from collections import defaultdict
import csv
import hashlib
import json
from pathlib import Path
import re
import struct
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "docs"))
sys.path.insert(0, str(ROOT / "tools"))
from generate_mod_tables import Rom, narc
from build_shop_locations import ITEM_MAP, MAP_TABLE, SHOP_POINTER_TABLE, inventory, mapped_reader

TARGET_SHA = "fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e"
NATIVE_TARGET_SHA = "6e73ab1b8eb19f536793ce549c5fff2ba3c5b684b1c72ba819b5dffe3763e132"
ALPHA1_SHOP_REPORT_SHA = "44d5e7c52922bcc0e7556d15dd6bfe5226d178fab270e90729ebe1560741eaca"
ITEM_LOCATION_DOC_SHA = "5073d5b4356e992a1dbfb0fd3cd212323999ee927c1d2484c1f8475c42a67033"
ALPHA2_TARGET_SHA = "24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6"
ALPHA2_BUILD_REPORT_SHA = "12f76a7c3afff0942ea7bc920fda4c0c45341c162d80f60627b8bba5787301a3"
ALPHA2_SHOP_REPORT_SHA = "f2dfd66a494c262d80af5b2781439b2f7df093dfe4cccdec36573ecca433225d"
ALPHA1_TRAINER_JOURNEY_SHA = "c339162a24793c97fc09eadb4fd5603626f2e0bff9dd7c83b33d5817a0b0719c"
ALPHA2_SHOP_ADDITIONS = frozenset({80, 81, 110, 221, 226, 227, 233, 235, 252, 321, 322,
                                   323, 324, 325, 326, 327, 433, 436, 438, 439, 454, 467})
ALPHA2_GIFT_ITEM_IDS = (113, 114, 118)
ALPHA2_ITEM_TRANSLATIONS = {
    113: ("TM Refill", "Recarga MT"),
    114: ("Party Healer", "Curador del equipo"),
    118: ("Cheat Kit", "Kit de trucos"),
}
LANGUAGES = {9: "en", 7: "es"}
TYPE_REFS = {0:1,1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:18,10:10,11:11,12:12,13:13,14:14,15:15,16:16,17:17}
CUSTOM_MOVES = {6:"Baby-Doll Eyes",27:"Disarming Voice",134:"Draining Kiss",140:"Dazzling Gleam",160:"Moonblast",169:"Fairy Wind",176:"Play Rough"}
CUSTOM_ITEMS = {"Covenant Orb":"Orbe Pacto","Voltaic Ore":"Mineral Voltaico", "Woodland Ore":"Mineral Bosque", "Serenade Orb":"Orbe Serenata", "Aubade Orb":"Orbe Alba", "Chilled Ore":"Mineral Gélido"}
POCKET_NAMES = {
    0:{"en":"General items","es":"Objetos generales"},
    1:{"en":"Medicine","es":"Medicinas"},
    2:{"en":"Poké Balls","es":"Poké Balls"},
    3:{"en":"Technical Machines","es":"Máquinas técnicas"},
    4:{"en":"Berries","es":"Bayas"},
    5:{"en":"Mail","es":"Correo"},
    6:{"en":"Battle items","es":"Objetos de combate"},
    7:{"en":"Key items","es":"Objetos clave"},
}
CHANGED_MOVES = {4,6,27,134,140,146,160,169,174,176,186,204,236,343,345}

def rows(path):
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))

def digest(path):
    with path.open("rb") as handle:
        return hashlib.file_digest(handle, "sha256").hexdigest()

def digest_bytes(data):
    return hashlib.sha256(data).hexdigest()

def load_alpha2_build_audit():
    """Require the exact reviewed Alpha1-to-FIX6a NARC comparison."""
    path = ROOT / "docs/qa-alpha2-build.json"
    if not path.is_file() or digest(path) != ALPHA2_BUILD_REPORT_SHA:
        raise ValueError("Alpha2 build comparison report hash mismatch")
    report = json.loads(path.read_text(encoding="utf-8"))
    audit = report.get("alpha1_vs_fix6a_fnt_audit", {})
    changed = {entry.get("path"): entry for entry in audit.get("changed_paths", [])}
    expected_paths = {"a/0/1/2", "a/0/1/7", "a/0/2/7", "a/0/3/2"}
    if (report.get("build", {}).get("target", {}).get("sha256") != ALPHA2_TARGET_SHA
            or audit.get("alpha1_sha256") != NATIVE_TARGET_SHA
            or audit.get("fix6a_sha256") != ALPHA2_TARGET_SHA
            or audit.get("path_count_alpha1") != 384
            or audit.get("path_count_fix6a") != 384
            or audit.get("shared_paths") != 384
            or audit.get("added_paths") != []
            or audit.get("removed_paths") != []
            or audit.get("changed_path_count") != 4
            or set(changed) != expected_paths):
        raise ValueError("Alpha2 build comparison does not prove the expected shared source")
    expected_members = {
        "a/0/1/2": [842],
        "a/0/1/7": [515, 516],
        "a/0/2/7": [222, 223, 224, 542],
        "a/0/3/2": [57],
    }
    for path_name, members in expected_members.items():
        entry = changed[path_name]
        observed = entry.get("new_member_indices", []) if path_name == "a/0/1/7" else entry.get("changed_member_indices", [])
        if observed != members:
            raise ValueError("Alpha2 changed NARC member set differs from the reviewed report")
    identical = audit.get("byte_identical_metadata_narcs", {})
    for name, path_name in (("trainer_headers", "a/0/5/5"), ("trainer_parties", "a/0/5/6")):
        if identical.get(name, {}).get("path") != path_name or identical[name].get("byte_identical") is not True:
            raise ValueError("Alpha2 trainer NARCs are not proven byte-identical")
    if set(changed["a/0/2/7"].get("changed_member_indices", [])) & {729, 730}:
        raise ValueError("Alpha2 trainer name/class message banks differ")
    return report, audit

def public_web_asset(path, prefix):
    """Resolve a wiki-relative evidence URL to a local file below web/."""
    if not isinstance(path, str) or not path.startswith(prefix) or ".." in Path(path[3:]).parts:
        raise ValueError("Evidence URL must stay within the expected local web directory")
    local = (ROOT / "web" / path[3:]).resolve()
    if ROOT.joinpath("web").resolve() not in local.parents or not local.is_file():
        raise ValueError("Evidence asset is missing or escapes web/")
    return local

def verify_item_icon_table(arm9, item_id, entry):
    """Require the target's item table to map an ID to the declared graphics."""
    if arm9 is None:
        raise ValueError("Exact-target item icon mapping requires ARM9 bytes")
    data_member, ncgr_member, nclr_member, _ = struct.unpack_from("<4H", arm9, 0x100194 + item_id * 8)
    if (ncgr_member, nclr_member) != (entry.get("ncgr"), entry.get("nclr")):
        raise ValueError(f"ARM9 item-icon mapping mismatch for item {item_id}")
    if entry.get("data_member") is not None and data_member != entry["data_member"]:
        raise ValueError(f"ARM9 item-data mapping mismatch for item {item_id}")

def load_custom_item_icons(target_hash, icon_archive, arm9=None):
    """Load graphics only when target ROM bytes and the item table agree."""
    if target_hash not in {NATIVE_TARGET_SHA, ALPHA2_TARGET_SHA}:
        return {}
    manifest_path = ROOT / "docs/item-icon-evidence.json"
    if not manifest_path.is_file():
        raise ValueError("Exact-target custom-item icon manifest is missing")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if (manifest.get("schema") != "ultimate-gold-item-icon-evidence/v1"
            or manifest.get("target_sha256") != NATIVE_TARGET_SHA):
        raise ValueError("Custom-item icon manifest targets a different ROM")
    if manifest.get("archive", {}).get("path") != "a/0/1/8" or manifest["archive"].get("sha256") != digest_bytes(icon_archive):
        raise ValueError("Custom-item icon archive differs from the verified target")
    members = narc(icon_archive)
    expected_ids = {113, 433, 436, 438, 439, 454, 467}
    item_entries = manifest.get("items", {})
    if target_hash == ALPHA2_TARGET_SHA:
        overlay = manifest.get("additional_targets", {}).get(ALPHA2_TARGET_SHA, {})
        if overlay.get("target_sha256") != target_hash:
            raise ValueError("Alpha2 item-icon inheritance does not target FIX6a")
        source_report = overlay.get("source_report", {})
        report_path = ROOT / source_report.get("path", "")
        if (source_report.get("path") != "docs/qa-alpha2-build.json" or not report_path.is_file()
                or digest(report_path) != source_report.get("sha256")):
            raise ValueError("Alpha2 icon inheritance report hash mismatch")
        report = json.loads(report_path.read_text(encoding="utf-8"))
        audit = report.get("alpha1_vs_fix6a_fnt_audit", {})
        changed_paths = {entry.get("path") for entry in audit.get("changed_paths", [])}
        if (report.get("build", {}).get("target", {}).get("sha256") != target_hash
                or audit.get("alpha1_sha256") != NATIVE_TARGET_SHA
                or len(audit.get("changed_paths", [])) != 4
                or "a/0/1/8" in changed_paths):
            raise ValueError("Alpha2 item-icon inheritance lacks exact unchanged-archive evidence")
        alpha2_entries = overlay.get("items", {})
        expected_alpha2_ids = expected_ids | {114, 118}
        if set(alpha2_entries) != {str(i) for i in (114, 118)}:
            raise ValueError("Alpha2 placeholder icon mappings are incomplete")
        item_entries = {**item_entries, **alpha2_entries}
        expected_ids = expected_alpha2_ids
    if len(members) != manifest["archive"].get("members") or set(item_entries) != {str(i) for i in expected_ids}:
        raise ValueError("Custom-item icon manifest has an unexpected NARC shape or item set")
    cell = manifest.get("cell", {})
    if cell.get("member") != 1 or cell.get("sha256") != digest_bytes(members[1]):
        raise ValueError("Shared item-icon cell differs from the verified target")
    icons = {}
    for item_id in sorted(expected_ids):
        entry = item_entries[str(item_id)]
        alias_id = entry.get("alias_item_id")
        asset_id = alias_id if alias_id is not None else item_id
        if (entry.get("asset") != f"web/sprites/items/{asset_id}.png"
                or entry.get("sprite") != f"../sprites/items/{asset_id}.png"):
            raise ValueError(f"Unexpected custom-item icon path for item {item_id}")
        for member_key, member_name, signature in (("ncgr", "ncgr_sha256", b"RGCN"), ("nclr", "nclr_sha256", b"RLCN")):
            member_id = entry.get(member_key)
            if not isinstance(member_id, int) or not 0 <= member_id < len(members):
                raise ValueError(f"Invalid {member_key.upper()} member for item {item_id}")
            resource = members[member_id]
            if resource[:4] != signature or digest_bytes(resource) != entry.get(member_name):
                raise ValueError(f"{member_key.upper()} resource hash mismatch for item {item_id}")
        asset = ROOT / entry["asset"]
        if not asset.is_file() or digest(asset) != entry.get("png_sha256") or entry.get("dimensions") != [32, 32]:
            raise ValueError(f"Custom-item icon asset mismatch for item {item_id}")
        expected_status = "rom_placeholder" if item_id in {113, 114, 118} else "rom_extracted"
        if entry.get("asset_status") != expected_status:
            raise ValueError(f"Custom-item icon display status mismatch for item {item_id}")
        verify_item_icon_table(arm9, item_id, entry)
        icons[item_id] = entry
    return icons

def load_item_acquisition_evidence(target_hash):
    """Verify the screenshot/report bytes before attaching evidence to wiki rows."""
    if target_hash not in {NATIVE_TARGET_SHA, ALPHA2_TARGET_SHA}:
        return {}
    manifest_path = ROOT / "docs/item-acquisition-evidence.json"
    if not manifest_path.is_file():
        raise ValueError("Exact-target item-acquisition evidence manifest is missing")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("schema") != "ultimate-gold-item-acquisition-evidence/v1":
        raise ValueError("Unknown item-acquisition evidence manifest schema")
    if target_hash == NATIVE_TARGET_SHA:
        if manifest.get("target_sha256") != target_hash:
            raise ValueError("Item-acquisition evidence manifest targets a different ROM")
        entries = manifest.get("entries", [])
        result = {}
        for entry in entries:
            kind = entry.get("kind")
            scope = entry.get("scope")
            if kind == "npc_gift":
                key = ("item", entry.get("item_id"), entry.get("location_id"))
                if key != ("item", 113, 60) or scope != "native_exact_target_gift" or entry.get("rom_sha256") != target_hash:
                    raise ValueError("Native gift evidence does not match TM Refill in New Bark Town")
            elif kind == "prototype_location":
                key = ("shop", entry.get("shop_id"), entry.get("location_id"))
                if key != ("shop", 4, 192) or scope != "prototype_location":
                    raise ValueError("Prototype location evidence does not match the Goldenrod 2F shop")
            else:
                raise ValueError("Unknown item-acquisition evidence kind")
            if key in result or not entry.get("rom_sha256"):
                raise ValueError("Duplicate or incomplete item-acquisition evidence")
            result[key] = {
                "scope": scope,
                "rom_sha256": entry["rom_sha256"],
                "screenshots": _validated_acquisition_screenshots(entry),
                "report": _validated_acquisition_report(entry),
            }
        if set(result) != {("item", 113, 60), ("shop", 4, 192)}:
            raise ValueError("Item-acquisition evidence set is incomplete")
        return result

    profile = manifest.get("additional_targets", {}).get(target_hash, {})
    if profile.get("target_sha256") != target_hash:
        raise ValueError("Alpha2 item-acquisition evidence does not target FIX6a")
    entries = profile.get("entries", [])
    # Alpha2 entries are supported only by the exact-target bounded gift and purchase reports.
    gift_entries = [entry for entry in entries if entry.get("kind") == "npc_gift"]
    shop_entries = [entry for entry in entries if entry.get("kind") == "native_shop_purchase"]
    expected_gift_ids = set(ALPHA2_GIFT_ITEM_IDS)
    if (len(entries) != 5
            or {entry.get("kind") for entry in entries} != {"npc_gift", "native_shop_purchase"}
            or {entry.get("item_id") for entry in gift_entries} != expected_gift_ids
            or len(gift_entries) != len(expected_gift_ids)
            or {entry.get("item_id") for entry in shop_entries} != {81, 467}
            or len(shop_entries) != 2):
        raise ValueError("Alpha2 acquisition evidence must cover only its three gifts and two tested purchases")
    result = {}

    def checked_report(entries_for_report):
        if not entries_for_report:
            raise ValueError("Alpha2 acquisition report is missing")
        first_report = entries_for_report[0].get("report", {})
        first_review = entries_for_report[0].get("review")
        for candidate in entries_for_report[1:]:
            if candidate.get("report") != first_report or candidate.get("review") != first_review:
                raise ValueError("Entries from one action must share the same report reference")
        _validated_acquisition_report(entries_for_report[0])
        source = _local_docs_source(first_report.get("source", ""))
        return json.loads(source.read_text(encoding="utf-8"))

    gift_report = checked_report(gift_entries)
    gift_action = gift_report.get("native_action", {})
    if (gift_report.get("schema") != "ultimate-gold-alpha2-native-rocket-gift/v1"
            or gift_report.get("verdict") != "NATIVE_GIFT_ACTION_CONFIRMED_WITH_LIMITS"
            or gift_report.get("target", {}).get("rom_sha256") != target_hash
            or gift_action.get("post_gift_battery_save_and_cold_reload") != "NOT_TESTED"):
        raise ValueError("Alpha2 gift report identity or limits mismatch")
    observed_gifts = {entry.get("item_id"): entry for entry in gift_action.get("gift_items", [])}
    for entry in gift_entries:
        item_id = entry.get("item_id")
        observed = observed_gifts.get(item_id, {})
        if (entry.get("location_id") != 60 or entry.get("rom_sha256") != target_hash
                or entry.get("scope") != "native_gift_runtime_only"
                or observed.get("quantity_before") != 0 or observed.get("quantity_after") != 1
                or observed.get("pocket") != "key"):
            raise ValueError("Alpha2 NPC gift entry exceeds the exact RAM-only report")
        key = ("item", item_id, entry["location_id"])
        result[key] = {
            "scope": entry["scope"], "rom_sha256": target_hash,
            "screenshots": _validated_acquisition_screenshots(entry),
            "report": _validated_acquisition_report(entry),
        }

    shop_report = checked_report(shop_entries)
    if (shop_report.get("schema") != "ultimate-gold-alpha2-shop-qa/v1"
            or shop_report.get("status") != "PASS_BOUNDED_NATIVE_PURCHASE_SAVE_COLD"
            or shop_report.get("target", {}).get("rom_sha256") != target_hash
            or shop_report.get("purchase_baseline", {}).get("map_id") != 192
            or shop_report.get("save_cold", {}).get("cold_boot_state_in") is not None):
        raise ValueError("Alpha2 shop report identity or bounded save/cold scope mismatch")
    observed_purchases = {purchase.get("item_id"): purchase for purchase in shop_report.get("purchases", [])}
    expected_purchases = {81: ("Moon Stone", 2100), 467: ("Covenant Orb", 3500)}
    cold_bag = shop_report.get("save_cold", {}).get("cold_loaded_bag_items", {})
    if (not shop_report.get("save_cold", {}).get("both_slot_crcs_valid")
            or not shop_report.get("save_cold", {}).get("dsv_sha256_after_save_and_cold")
            or shop_report.get("save_cold", {}).get("cold_loaded_money") is None
            or shop_report.get("save_cold", {}).get("current_position", [None])[0] != 192):
        raise ValueError("Alpha2 shop report lacks native save/cold integrity evidence")
    for entry in shop_entries:
        item_id = entry.get("item_id")
        purchase = observed_purchases.get(item_id, {})
        quantity = purchase.get("quantity", [])
        expected_name, expected_price = expected_purchases[item_id]
        if (entry.get("shop_id") != 4 or entry.get("location_id") != 192
                or entry.get("rom_sha256") != target_hash
                or entry.get("scope") != "native_purchase_save_cold_bounded"
                or entry.get("price") != expected_price
                or purchase.get("item") != expected_name
                or purchase.get("unit_price") != expected_price
                or len(quantity) != 2 or quantity[1] != quantity[0] + 1
                or quantity[0] != shop_report.get("purchase_baseline", {}).get("items_pocket", {}).get(str(item_id))
                or cold_bag.get(str(item_id)) != quantity[1]):
            raise ValueError("Alpha2 shop item differs from its bounded exact-target purchase")
        key = ("shop_item", item_id, entry["shop_id"], entry["location_id"])
        result[key] = {
            "scope": entry["scope"], "rom_sha256": target_hash,
            "price": entry["price"],
            "screenshots": _validated_acquisition_screenshots(entry),
            "report": _validated_acquisition_report(entry),
        }
    if set(result) != ({("item", item_id, 60) for item_id in expected_gift_ids}
                       | {("shop_item", item_id, 4, 192) for item_id in (81, 467)}):
        raise ValueError("Alpha2 acquisition evidence set is incomplete")
    return result

def _validated_acquisition_screenshots(entry):
    shots = []
    for shot in entry.get("screenshots", []):
        local = public_web_asset(shot.get("path"), "../assets/")
        if digest(local) != shot.get("sha256"):
            raise ValueError("Acquisition screenshot hash mismatch")
        shots.append({"path": shot["path"], "sha256": shot["sha256"], "alt": shot["alt"]})
    return shots

def _validated_acquisition_report(entry):
    report = entry.get("report", {})
    source_hash = report.get("source_sha256", report.get("sha256"))
    if (not isinstance(report.get("source"), str) or not report["source"].startswith("docs/")
            or not isinstance(report.get("path"), str) or not report["path"].startswith("../data/")):
        raise ValueError("Acquisition report must have a local source and web/data copy")
    source_report = _local_docs_source(report["source"])
    public_report = public_web_asset(report["path"], "../data/")
    public_hash = report.get("sha256")
    if (not source_report.is_file() or digest(source_report) != source_hash
            or digest(public_report) != public_hash):
        raise ValueError("Acquisition QA report hash mismatch")
    published_report = json.loads(public_report.read_text(encoding="utf-8"))
    if source_hash != public_hash:
        if (published_report.get("report_sha256") != source_hash
                or published_report.get("target_sha256") != entry.get("rom_sha256")):
            raise ValueError("Published review does not bind the primary exact-target report")
    result = {"path": report["path"], "sha256": public_hash,
              "source": report["source"], "source_sha256": source_hash}
    review = entry.get("review")
    if review is not None:
        if (not isinstance(review.get("source"), str) or not review["source"].startswith("docs/")
                or not isinstance(review.get("path"), str) or not review["path"].startswith("../data/")):
            raise ValueError("Independent review must have a local source and web/data copy")
        review_source = _local_docs_source(review["source"])
        review_public = public_web_asset(review["path"], "../data/")
        if (not review_source.is_file() or digest(review_source) != review.get("source_sha256")
                or digest(review_public) != review.get("sha256")):
            raise ValueError("Independent acquisition review hash mismatch")
        review_data = json.loads(review_public.read_text(encoding="utf-8"))
        if review_data.get("schema") == "ultimate-gold-alpha2-gift-independent-review/v1":
            primary = review_data.get("evidence", {}).get("primary_report", {})
            if (review_data.get("verdict") != "PASS_BOUNDED_NATIVE_GIFT_WITH_LIMITS"
                    or primary.get("path") != report["source"]
                    or primary.get("sha256") != source_hash
                    or review_data.get("evidence", {}).get("rom_sha256") != entry.get("rom_sha256")):
                raise ValueError("Gift review does not bind the exact primary report and ROM")
        elif review_data.get("schema") == "ultimate-gold-alpha2-shop-review/v1":
            if (review_data.get("status") != "PASS_ROOT_OFFLINE_REVIEW"
                    or review_data.get("report") != Path(report["source"]).name
                    or review_data.get("report_sha256") != source_hash
                    or review_data.get("target_sha256") != entry.get("rom_sha256")):
                raise ValueError("Shop review does not bind the exact primary report and ROM")
        else:
            raise ValueError("Unknown independent acquisition review schema")
        result["review"] = {"path": review["path"], "sha256": review["sha256"],
                             "source": review["source"], "source_sha256": review["source_sha256"]}
    return result

def _local_docs_source(relative_path):
    docs_root = (ROOT / "docs").resolve()
    if not isinstance(relative_path, str) or not relative_path.startswith("docs/"):
        raise ValueError("Evidence source must remain inside docs/")
    source = (ROOT / relative_path).resolve()
    if docs_root not in source.parents:
        raise ValueError("Evidence source must remain inside docs/")
    return source

def normalize(value):
    return re.sub(r"[^a-z0-9]", "", value.casefold())

def tmhm_description(item_description, move_description):
    """Use the real TM/HM move translation without changing the item English text."""
    result = dict(item_description or {})
    value = (move_description or {}).get("es")
    result["es"] = value.strip() if isinstance(value, str) and value.strip() else "No hay traducción española disponible para este movimiento."
    return result

ITEM_REFERENCE_ALIASES = {
    "X Defend": "X Defense",
    "X Special": "X Sp. Atk",
    "Parlyz Heal": "Paralyze Heal",
    "Stick": "Leek",
    "Dowsing MCHN": "Dowsing Machine",
    "Ylw Apricorn": "Yellow Apricorn",
    "Blu Apricorn": "Blue Apricorn",
    "Grn Apricorn": "Green Apricorn",
    "Pnk Apricorn": "Pink Apricorn",
    "Wht Apricorn": "White Apricorn",
    "Blk Apricorn": "Black Apricorn",
}

ITEM_ES_DESCRIPTION_OVERRIDES = {
    137: "Carta con un campo verde y fresco. Puede llevarla un Pokémon para entregarla.",
    138: "Carta con llamas de un rojo intenso. Puede llevarla un Pokémon para entregarla.",
    139: "Carta con un paisaje azul bajo el agua. Puede llevarla un Pokémon para entregarla.",
    140: "Carta con bonitos motivos florales. Puede llevarla un Pokémon para entregarla.",
    141: "Carta con una mina de carbón apenas iluminada. Puede llevarla un Pokémon para entregarla.",
    142: "Carta con diseños mecánicos y fríos. Puede llevarla un Pokémon para entregarla.",
    143: "Carta con grandes corazones. Puede llevarla un Pokémon para entregarla.",
    144: "Carta con un mundo frío cubierto de nieve. Puede llevarla un Pokémon para entregarla.",
    145: "Carta que representa la inmensidad del espacio. Puede llevarla un Pokémon para entregarla.",
    146: "Carta con conjuntos de colores vivos. Puede llevarla un Pokémon para entregarla.",
    147: "Carta con un colorido mosaico de arcoíris. Puede llevarla un Pokémon para entregarla.",
    148: "Carta con un patrón de ladrillos de aspecto resistente. Puede llevarla un Pokémon para entregarla.",
    450: "Bicicleta plegable que permite moverse mucho más rápido que con las Zapatillas Deportivas.",
    68: "Flauta negra de cristal. Hace que aparezcan menos Pokémon salvajes.",
    69: "Flauta blanca de cristal. Hace que aparezcan más Pokémon salvajes.",
    216: "Objeto para llevar. El Pokémon que lo lleva recibe parte de la experiencia del combate aunque no participe.",
    225: "Objeto que potencia el Ataque Especial y la Defensa Especial de Latios y Latias.",
    504: "Dulce famoso de Pueblo Caoba. Muchos turistas lo compran como recuerdo.",
}

def clean(value):
    return re.sub(r"\s+", " ", value.replace("\\n", " ").replace("\\r", " ").replace("\\f", " ")).strip()

def reference_names(path, key):
    result = {}
    for row in rows(path):
        language = LANGUAGES.get(int(row["local_language_id"]))
        if language:
            result.setdefault(int(row[key]), {})[language] = row["name"]
    return result

def reference_flavors(path, key, preferred_groups=None):
    """Select one flavor per ID/language using an explicit version-group order."""
    result, rank = {}, {}
    if not path.exists():
        return result
    for row in rows(path):
        language = LANGUAGES.get(int(row["language_id"]))
        if not language:
            continue
        ident, group = int(row[key]), int(row["version_group_id"])
        if preferred_groups is None:
            priority = (0 if group == 10 else 1, group)
        elif group not in preferred_groups:
            continue
        else:
            priority = (preferred_groups.index(group), group)
        if priority < rank.get((ident, language), (99, 999)):
            result.setdefault(ident, {})[language] = clean(row["flavor_text"])
            rank[(ident, language)] = priority
    return result

def message_names(data, charmap):
    """Decode HGSS allocation/cipher and packed names, without exporting prose."""
    chars = {}
    for line in charmap.read_text(encoding="utf-8").splitlines():
        line = line.split("//", 1)[0].lstrip()
        if "=" in line:
            key, value = line.split("=", 1)
            if not value.startswith("{"):
                chars[int(key, 16)] = value
    count, key = struct.unpack_from("<HH", data)
    result = []
    for index in range(count):
        cipher = (765 * (index + 1) * key) & 65535
        offset, length = struct.unpack_from("<II", data, 4 + index * 8)
        offset ^= cipher | cipher << 16
        length ^= cipher | cipher << 16
        if offset < 4 + count * 8 or offset + length * 2 > len(data):
            raise ValueError("Message allocation exceeds bank")
        seed = ((index + 1) * 596947) & 65535
        words = []
        for value in struct.unpack_from(f"<{length}H", data, offset):
            words.append(value ^ seed)
            seed = (seed + 18749) & 65535
        if words and words[0] == 0xF100:
            unpacked, buffer, bits = [], 0, 0
            for value in words[1:]:
                buffer |= (value & 32767) << bits
                bits += 15
                while bits >= 9:
                    unit, buffer, bits = buffer & 511, buffer >> 9, bits - 9
                    if unit == 511:
                        unpacked.append(65535)
                        break
                    unpacked.append(unit)
                if unpacked and unpacked[-1] == 65535:
                    break
            words = unpacked
        text, pos = [], 0
        while pos < len(words):
            value = words[pos]
            pos += 1
            if value == 65535:
                break
            if value == 65534:
                if pos + 2 > len(words):
                    raise ValueError("Truncated message control")
                arguments = words[pos + 1]
                pos += 2 + arguments
                continue
            text.append(chars.get(value, ""))
        result.append(clean("".join(text)).replace("₧₦", "PKMN"))
    return result

def move_record(raw):
    if len(raw) != 16:
        raise ValueError("Move record must be 16 bytes")
    return {"effect_id":struct.unpack_from("<H",raw)[0], "category":raw[2],
            "power":raw[3], "type_id":raw[4], "accuracy":raw[5], "pp":raw[6]}

def evolution_condition(entry, items, moves, species):
    method, value = entry["method"], entry["param"]
    result = {}
    for language in ("en", "es"):
        spanish = language == "es"
        item = items.get(value, {}).get("name", {}).get(language, str(value))
        move = moves.get(value, {}).get("name", {}).get(language, str(value))
        mon = species.get(value, {}).get("name", {}).get(language, str(value))
        level = f"Nivel {value}" if spanish else f"Level {value}"
        text = {
            1: "Amistad alta" if spanish else "High friendship",
            2: "Amistad alta, de día" if spanish else "High friendship during daytime",
            3: "Amistad alta, de noche" if spanish else "High friendship at night",
            4: level,
            5: "Intercambio" if spanish else "Trade",
            6: (f"Intercambio con {item}" if spanish else f"Trade holding {item}"),
            7: (f"Usa {item}" if spanish else f"Use {item}"),
            8: level + (", Ataque > Defensa" if spanish else ", Attack > Defense"),
            9: level + (", Ataque = Defensa" if spanish else ", Attack = Defense"),
            10: level + (", Ataque < Defensa" if spanish else ", Attack < Defense"),
            11: level + (", rama de personalidad A" if spanish else ", personality branch A"),
            12: level + (", rama de personalidad B" if spanish else ", personality branch B"),
            13: level,
            14: level + (", hueco libre y Poké Ball" if spanish else ", free party slot and Poké Ball"),
            15: (f"Belleza {value}" if spanish else f"Beauty {value}"),
            16: (f"Usa {item}, macho" if spanish else f"Use {item}, male"),
            17: (f"Usa {item}, hembra" if spanish else f"Use {item}, female"),
            18: (f"Sube de nivel con {item}, de día" if spanish else f"Level up holding {item}, daytime"),
            19: (f"Sube de nivel con {item}, de noche" if spanish else f"Level up holding {item}, nighttime"),
            20: (f"Sube de nivel con {move}" if spanish else f"Level up knowing {move}"),
            21: (f"Sube de nivel con {mon} en el equipo" if spanish else f"Level up with {mon} in the party"),
            22: level + (", macho" if spanish else ", male"),
            23: level + (", hembra" if spanish else ", female"),
        }.get(method, f"{method}: {value}")
        result[language] = text
    return result

def default_moves(learnset, level):
    """Mirror InitBoxMonMoveset ordering, duplicate handling and four-slot shift."""
    result = []
    for entry in learnset:
        if entry["level"] > level:
            break
        move = entry["move_id"]
        if move and move not in result:
            result.append(move)
            result = result[-4:]
    return result

def add_shop_acquisitions(items, document, target_hash, evidence=None):
    """Join exact-target stock and script/map evidence without implying a live purchase."""
    if document["target_sha256"] != target_hash:
        raise ValueError("Shop reference targets a different ROM")
    for shop in document["shops"]:
        maps = {place["id"]: place for call in shop["locations"] for place in call["maps"]}
        for stock in shop["items"]:
            item = items.get(stock["id"])
            if item is None:
                raise ValueError("Shop item is absent from the target item catalog")
            for place in maps.values():
                row = {
                    "location": {"id": place["id"], "name": place["name"]},
                    "method": {
                        "en": f"Buy for ₽{stock['price']:,}. Live purchase not yet tested.",
                        "es": f"Compra por ₽{stock['price']:,}. Compra en juego aún sin probar.",
                    },
                    "price": stock["price"], "shop_id": shop["id"],
                    "status": "verified_target_shop_stock",
                    "source": {"title": "Exact-target stock, price and shop script", "reference": "shop-locations.json"},
                }
                if evidence and ("shop", shop["id"], place["id"]) in evidence:
                    row["evidence"] = evidence[("shop", shop["id"], place["id"])]
                item.setdefault("acquisition", []).insert(0, row)

def add_alpha2_shop_purchases(items, evidence):
    """Expose only the two Alpha2 unit purchases proven by the native report."""
    expected = {81: ("Moon Stone", 2100), 467: ("Covenant Orb", 3500)}
    for item_id, (name, price) in expected.items():
        item = items.get(item_id)
        proof = evidence.get(("shop_item", item_id, 4, 192))
        if item is None or proof is None or item["name"]["en"] != name or proof.get("price") != price:
            raise ValueError("Alpha2 native shop purchase does not match the target item catalog")
        price_en = f"₽{price:,}"
        price_es = f"₽{price:,}"
        row = {
            "location": {"id": 192, "name": {
                "en": "Goldenrod Department Store, 2F",
                "es": "Centro Comercial de Ciudad Trigal, 2.ª planta",
            }},
            "method": {
                "en": f"One unit was purchased for {price_en} in a native FIX6a run; a native save and cold reload retained the purchase.",
                "es": f"Se compró una unidad por {price_es} en una ejecución nativa FIX6a; el guardado nativo y la carga fría conservaron la compra.",
            },
            "price": price, "shop_id": 4,
            "status": "bounded_native_purchase_save_cold_verified",
            "source": {"title": "Alpha2 exact-target purchase QA", "reference": "qa-alpha2-shop.json"},
            "evidence": proof,
        }
        item.setdefault("acquisition", []).insert(0, row)

def add_documented_upstream_acquisitions(items):
    """Preserve upstream location notes as documentation, never as runtime proof."""
    path = ROOT / "docs/item-locations.json"
    if not path.is_file():
        raise ValueError("Documented upstream item-location source is missing")
    document = json.loads(path.read_text(encoding="utf-8"))
    if (digest(path) != ITEM_LOCATION_DOC_SHA
            or document.get("schema") != "ultimate-gold-item-locations/v1"
            or document.get("target_sha256") != TARGET_SHA):
        raise ValueError("Documented item-location source differs from its pinned base")
    allowed_claims = {
        "Upstream documentation; not verified in this target ROM.",
        "The guide explicitly says no location change; exact base-game spot not transcribed.",
    }
    count = 0
    for raw_id, record in document.get("items", {}).items():
        item = items.get(int(raw_id))
        if item is None:
            raise ValueError("Documented item-location record has no Alpha2 catalog item")
        for acquisition in record.get("acquisition", []):
            if (acquisition.get("status") != "documented_upstream"
                    or acquisition.get("source", {}).get("claim") not in allowed_claims
                    or set(acquisition.get("method", {})) != {"en", "es"}):
                raise ValueError("Only explicitly unverified upstream item notes may be inherited")
            item.setdefault("acquisition", []).append(acquisition)
            count += 1
    if count != 150:
        raise ValueError("Expected all 150 documented upstream item-location notes")

def load_alpha2_shop_locations(arm9, item_records, items):
    """Validate the pinned static FIX6a shop extraction against target bytes."""
    path = ROOT / "docs/shop-locations-alpha2.json"
    if not path.is_file() or digest(path) != ALPHA2_SHOP_REPORT_SHA:
        raise ValueError("Alpha2 exact-target shop report hash mismatch")
    report = json.loads(path.read_text(encoding="utf-8"))
    manifest = json.loads((ROOT / "docs/item-acquisition-evidence.json").read_text(encoding="utf-8"))
    profile = manifest.get("additional_targets", {}).get(ALPHA2_TARGET_SHA, {})
    report_ref = profile.get("fixed_shop_stock_report", {})
    provenance = report.get("provenance", {})
    build_report, _ = load_alpha2_build_audit()
    if (report_ref.get("path") != "docs/shop-locations-alpha2.json"
            or report_ref.get("sha256") != ALPHA2_SHOP_REPORT_SHA
            or report.get("schema") != "ultimate-gold-fixed-shops/v1"
            or report.get("target_sha256") != ALPHA2_TARGET_SHA
            or provenance.get("target_sha256") != ALPHA2_TARGET_SHA
            or provenance.get("generator", {}).get("path") != "tools/build_shop_locations.py"
            or provenance.get("generator", {}).get("sha256") != digest(ROOT / "tools/build_shop_locations.py")
            or provenance.get("decoder", {}).get("sha256") != "f5b1ba507a3bf21a0a3e5780ed81c38c9f7d79469f020fa9b600a6ea6214317b"
            or provenance.get("commands", {}).get("sha256") != "1248d46548280a8f3c9c2d220788a915c03b4dc1951b4f7bb1c6317d07f45061"
            or provenance.get("maps", {}).get("sha256") != "9ebf1f2f6110af509b830cc33f271d4b5d257f309212345a6bb4557321634adb"
            or provenance.get("build_comparison", {}).get("sha256") != ALPHA2_BUILD_REPORT_SHA
            or provenance.get("item_names", {}).get("target_sha256") != ALPHA2_TARGET_SHA
            or len(report.get("shops", [])) != 30
            or report.get("unresolved_special_mart_calls") != []):
        raise ValueError("Alpha2 fixed-shop report provenance or coverage mismatch")
    if build_report.get("build", {}).get("target", {}).get("sha256") != ALPHA2_TARGET_SHA:
        raise ValueError("Alpha2 shop report is not bound to the build comparison")

    baseline_path = ROOT / "docs/shop-locations.json"
    if not baseline_path.is_file() or digest(baseline_path) != ALPHA1_SHOP_REPORT_SHA:
        raise ValueError("Pinned Alpha1 shop baseline hash mismatch")
    baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
    if baseline.get("target_sha256") != NATIVE_TARGET_SHA:
        raise ValueError("Alpha1 shop baseline targets an unexpected ROM")
    def stock_by_shop(document):
        return {shop["id"]: {row["id"]: row["price"] for row in shop["items"]}
                for shop in document["shops"]}
    old_stock, target_stock = stock_by_shop(baseline), stock_by_shop(report)
    if set(old_stock) != set(range(30)) or set(target_stock) != set(range(30)):
        raise ValueError("Alpha1/Alpha2 shop catalog does not contain all fixed-money shops")
    additions = {}
    for shop_id in range(30):
        old_items, new_items = old_stock[shop_id], target_stock[shop_id]
        if not set(old_items) <= set(new_items):
            raise ValueError("Alpha2 fixed-money shop stock dropped an Alpha1 item")
        if any(old_items[item_id] != new_items[item_id] for item_id in old_items):
            raise ValueError("Alpha2 fixed-money shop stock changed an Alpha1 price")
        extra = set(new_items) - set(old_items)
        if extra:
            additions[shop_id] = extra
    if additions != {4: ALPHA2_SHOP_ADDITIONS}:
        raise ValueError("Alpha2 fixed-money stock delta differs from the reviewed shop-4 additions")
    def shop_map_calls(document):
        return sorted((shop["id"], link["script_member"], place["id"])
                      for shop in document["shops"] for link in shop["locations"]
                      for place in link["maps"])
    if shop_map_calls(baseline) != shop_map_calls(report):
        raise ValueError("Alpha2 fixed-money shop map/script links differ from Alpha1")

    read_arm9 = mapped_reader(arm9)
    seen_shops = set()
    stock_count = location_count = 0
    for shop in report["shops"]:
        shop_id = shop.get("id")
        if not isinstance(shop_id, int) or not 0 <= shop_id < 30 or shop_id in seen_shops:
            raise ValueError("Alpha2 shop report has an invalid shop ID")
        seen_shops.add(shop_id)
        pointer = struct.unpack_from("<I", arm9, SHOP_POINTER_TABLE + shop_id * 4)[0]
        if shop.get("inventory_pointer") != f"0x{pointer:08X}":
            raise ValueError("Alpha2 shop inventory pointer differs from target ARM9")
        native_ids = inventory(arm9, pointer, read_arm9)
        rows = shop.get("items", [])
        if [row.get("id") for row in rows] != native_ids:
            raise ValueError("Alpha2 static stock list differs from target ARM9 inventory")
        stock_count += len(rows)
        seen_maps = set()
        for link in shop.get("locations", []):
            if link.get("status") != "verified_target_script" or not isinstance(link.get("script_member"), int):
                raise ValueError("Alpha2 shop-to-script link is not target-verified")
            for place in link.get("maps", []):
                map_id = place.get("id")
                if not isinstance(map_id, int) or not 0 <= map_id < 1000 or map_id in seen_maps:
                    raise ValueError("Alpha2 shop map link is invalid or duplicated")
                script_member = struct.unpack_from("<H", arm9, MAP_TABLE + map_id * 24 + 6)[0]
                if script_member != link["script_member"]:
                    raise ValueError("Alpha2 map header does not point to its reported shop script")
                seen_maps.add(map_id)
                location_count += 1
        for row in rows:
            item_id = row.get("id")
            item = items.get(item_id)
            alias_name = item is not None and item.get("name", {}).get("en") in ITEM_REFERENCE_ALIASES and row.get("name", {}).get("en") == item.get("name", {}).get("en")
            if item is None or (row.get("name") != item.get("name") and not alias_name):
                raise ValueError("Alpha2 shop item name does not match target catalog")
            data_member = struct.unpack_from("<H", arm9, ITEM_MAP + item_id * 8)[0]
            if row.get("item_data_member") != data_member or struct.unpack_from("<H", item_records[data_member])[0] != row.get("price"):
                raise ValueError("Alpha2 shop price or item-data member differs from target bytes")
    if seen_shops != set(range(30)) or stock_count != 194 or location_count != 34:
        raise ValueError("Alpha2 shop report inventory or map coverage differs from reviewed extraction")
    return report

def add_alpha2_shop_stock(items, report):
    """Add exact static FIX6a stock rows, keeping native purchase evidence separate."""
    purchase_tested = {81, 467}
    report_ref = {"path": "../data/shop-locations-alpha2.json", "sha256": ALPHA2_SHOP_REPORT_SHA,
                  "source": "docs/shop-locations-alpha2.json", "source_sha256": ALPHA2_SHOP_REPORT_SHA}
    for shop in report["shops"]:
        maps = {place["id"]: place for link in shop["locations"] for place in link["maps"]}
        for stock in shop["items"]:
            item = items[stock["id"]]
            for place in maps.values():
                if stock["id"] in purchase_tested:
                    method_en = "Listed in the exact-target shop stock; the separate bounded native purchase is recorded above."
                    method_es = "Figura en el stock del target exacto; la compra nativa acotada se registra arriba."
                else:
                    method_en = "Listed in the exact-target fixed-money shop stock. A live purchase has not been tested."
                    method_es = "Figura en el stock exacto de una tienda de dinero. La compra en juego no se ha probado."
                row = {
                    "location": {"id": place["id"], "name": place["name"]},
                    "method": {"en": f"Buy for ₽{stock['price']:,}. {method_en}",
                               "es": f"Compra por ₽{stock['price']:,}. {method_es}"},
                    "price": stock["price"], "shop_id": shop["id"],
                    "status": "verified_target_shop_stock",
                    "source": {"title": "Alpha2 exact-target fixed-shop stock, prices and script/map links",
                               "reference": "shop-locations-alpha2.json"},
                    "evidence": {"scope": "verified_target_shop_stock", "rom_sha256": ALPHA2_TARGET_SHA,
                                 "report": report_ref},
                }
                item.setdefault("acquisition", []).append(row)

def add_alpha2_gift_acquisitions(items, evidence):
    """Attach only the three runtime-observed New Bark Town gift entries."""
    for item_id in ALPHA2_GIFT_ITEM_IDS:
        item = items.get(item_id)
        proof = evidence.get(("item", item_id, 60))
        if item is None or proof is None:
            raise ValueError("Alpha2 Rocket gift item or exact evidence is missing")
        row = {
            "location": {"id": 60, "name": {"en": "New Bark Town", "es": "Pueblo Primavera"}},
            "method": {
                "en": "One focused native Team Rocket NPC offer was accepted. The post-gift battery save and cold reload were not tested.",
                "es": "Se aceptó una oferta nativa focal del NPC del Team Rocket. No se probaron un guardado de batería ni una carga fría posteriores al regalo.",
            },
            "status": "native_gift_runtime_only",
            "source": {"title": "Alpha2 Rocket gift QA", "reference": "qa-alpha2-gift.json"},
            "evidence": proof,
        }
        item["acquisition"] = [row]


def trainer_member_stats(party, kind, member):
    """Read the native IV scale; ordinary trainer records do not encode EV spreads."""
    sizes = {0: 8, 1: 16, 2: 10, 3: 18}
    if kind not in sizes:
        raise ValueError("Unknown trainer party layout")
    offset = member["slot"] * sizes[kind]
    if offset + sizes[kind] > len(party):
        raise ValueError("Trainer member extends beyond its party record")
    level, packed = struct.unpack_from("<HH", party, offset + 2)
    if (level, packed & 0x3FF, packed >> 10) != (member["level"], member["species_id"], member["form"]):
        raise ValueError("Trainer reference differs from exact target party")
    scale = party[offset]
    return {"iv_scale": scale, "ivs": [scale * 31 // 255] * 6, "evs": [0] * 6,
            "iv_source": "native_uniform_difficulty_scale", "ev_source": "native_creation_default_no_custom_spread"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", type=Path, required=True)
    parser.add_argument("--reference-dir", type=Path, required=True)
    parser.add_argument("--charmap", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=ROOT / "docs/wiki-data.json")
    args = parser.parse_args()
    target_hash = digest(args.target)
    if target_hash not in {TARGET_SHA, NATIVE_TARGET_SHA, ALPHA2_TARGET_SHA}:
        raise SystemExit("Unexpected target SHA-256")
    rom = Rom(args.target)
    arm9_offset, _, _, arm9_size = struct.unpack_from("<4I", rom.data, 0x20)
    arm9 = rom.data[arm9_offset:arm9_offset + arm9_size]
    custom_item_icons = load_custom_item_icons(target_hash, rom.file("a/0/1/8"), arm9)
    acquisition_evidence = load_item_acquisition_evidence(target_hash)
    read_arm9 = mapped_reader(arm9)
    level_table = read_arm9(0x023D8500, 256)
    if hashlib.sha256(level_table).hexdigest() != "dcbcaf243fbe29c5b8eced0b0102bddf034fde66977912d32da28484fc42144e" or hashlib.sha256(read_arm9(0x023D8100, 256)).hexdigest() != "6392b5b8a1e67727ec4ea2af7ea8ee4f29219fb3161f8f9b8b0fae2d96216b56":
        raise ValueError("Game-mode code or trainer level table differs from verified source")
    item_records = narc(rom.file("a/0/1/7"))
    tm_moves = struct.unpack_from("<100H", arm9, 0x1000CC)
    if tm_moves[:4] != (264,337,352,347) or tm_moves[-4:] != (250,249,127,431):
        raise ValueError("TM/HM table does not match the verified target mapping")
    banks = narc(rom.file("a/0/2/7"))
    move_labels = message_names(banks[750], args.charmap)
    item_labels = message_names(banks[222], args.charmap)
    # Alpha2 patched these project strings into bank 223. The native Bag
    # description getter uses bank 221, whose three custom entries are empty.
    custom_item_reference_texts = message_names(banks[223], args.charmap)
    trainer_labels = message_names(banks[729], args.charmap)
    class_labels = message_names(banks[730], args.charmap)
    move_records = narc(rom.file("a/0/1/1"))
    trainer_headers = narc(rom.file("a/0/5/5"))
    trainer_parties = narc(rom.file("a/0/5/6"))
    assert move_labels[33] == "Tackle" and item_labels[467] == "Covenant Orb"
    ref = args.reference_dir
    names = {
        "species":reference_names(ref/"pokemon_species_names.csv","pokemon_species_id"),
        "moves":reference_names(ref/"move_names.csv","move_id"),
        "abilities":reference_names(ref/"ability_names.csv","ability_id"),
        "types":reference_names(ref/"type_names.csv","type_id"),
        "items":reference_names(ref/"item_names.csv","item_id"),
    }
    flavors = {
        "moves":reference_flavors(ref/"move_flavor_text.csv","move_id"),
        "abilities":reference_flavors(ref/"ability_flavor_text.csv","ability_id"),
        # The cache has no Spanish HGSS rows.  XY rows are known to be shifted
        # across reused item IDs; later canonical rows preserve the item text.
        "items":reference_flavors(ref/"item_flavor_text.csv","item_id", (10, 17, 18, 19, 20)),
    }
    # Some later Spanish rows changed HGSS mechanics (healing amounts and
    # single-stage battle boosts). Keep the matching XY-era wording for those
    # IDs; its other shifted rows are intentionally excluded above.
    item_es_hgss_mechanics = reference_flavors(ref/"item_flavor_text.csv", "item_id", (10, 15))
    for ident in (25, 26, 30, 31, 32, 34, 35, 57, 58, 59, 60, 61, 62):
        if ident in item_es_hgss_mechanics and "es" in item_es_hgss_mechanics[ident]:
            flavors["items"].setdefault(ident, {})["es"] = item_es_hgss_mechanics[ident]["es"]
    by_name = {kind:{normalize(n["en"]):ident for ident,n in entries.items() if n.get("en")} for kind,entries in names.items()}
    species_doc = json.loads((ROOT/"docs/species-493.json").read_text())
    species = []
    for entry in species_doc["species"]:
        ident = entry["national_id"]
        species.append({"id":ident,"name":names["species"].get(ident,{"en":entry["name"],"es":entry["name"]}),
                        "stats":entry["base_stats"],"types":list(dict.fromkeys(entry["types"])),
                        "abilities":[x for x in dict.fromkeys(entry["abilities"]) if x],"learnset":entry["levelup_moves"],
                        "ability_slots":[{"slot":slot + 1,"kind":"standard","ability_id":ability or None} for slot,ability in enumerate(entry["abilities"])],
                        "hidden_ability":{"ability_id":None,"status":"not_implemented_in_target_format"},
                        "evolutions":[{"method":e["method_id"],"param":e["param"],"target":e["target_species_id"]} for e in entry["evolutions"]],
                        "generation":1 if ident<=151 else 2 if ident<=251 else 3 if ident<=386 else 4})
    moves = {}
    for ident, raw in enumerate(move_records):
        if not ident or ident >= len(move_labels):
            continue
        label = move_labels[ident]
        reference_id = by_name["moves"].get(normalize(CUSTOM_MOVES.get(ident,label)))
        spanish = names["moves"].get(reference_id,{}).get("es",label)
        description = flavors["moves"].get(reference_id,{}).copy()
        if ident in CHANGED_MOVES:
            description = {"en":"Modified Plus record. Statistics below are read from this ROM.",
                           "es":"Registro modificado por Plus. Los valores siguientes se leen de esta ROM."}
        moves[ident] = {"id":ident,"name":{"en":label,"es":spanish},**move_record(raw),
                        "description":description,"status":"target-name-and-record","reference_id":reference_id}
    item_indices = {int(r["game_index"]):int(r["item_id"]) for r in rows(ref/"item_game_indices.csv") if r["generation_id"]=="4"}
    items = {}
    for ident, label in enumerate(item_labels):
        if not ident or not label or "???" in label:
            continue
        reference_id = item_indices.get(ident)
        reference_label = ITEM_REFERENCE_ALIASES.get(label, label)
        if normalize(names["items"].get(reference_id,{}).get("en","")) != normalize(reference_label):
            reference_id = by_name["items"].get(normalize(reference_label))
        spanish = CUSTOM_ITEMS.get(label,names["items"].get(reference_id,{}).get("es",label))
        if target_hash == ALPHA2_TARGET_SHA and ident in ALPHA2_ITEM_TRANSLATIONS:
            expected_en, spanish = ALPHA2_ITEM_TRANSLATIONS[ident]
            if label != expected_en:
                raise ValueError(f"Alpha2 item {ident} name differs from its exact message-bank record")
        desc = flavors["items"].get(reference_id,{}).copy()
        if "es" not in desc:
            desc["es"] = "No hay traducción española disponible para este objeto."
        if ident in ITEM_ES_DESCRIPTION_OVERRIDES:
            desc["es"] = ITEM_ES_DESCRIPTION_OVERRIDES[ident]
        if label in CUSTOM_ITEMS:
            desc = {"en":"Custom evolution item. See the evolution records for compatible Pokémon.",
                    "es":"Objeto evolutivo propio. Consulta las evoluciones para ver las especies compatibles."}
        if target_hash == ALPHA2_TARGET_SHA and ident in ALPHA2_ITEM_TRANSLATIONS:
            alpha2_descriptions = {
                113: "Una recarga de MT.",
                114: "Restaura por completo los PS y PP del equipo.",
                118: "Permite reutilizar Caramelo Raro, repelentes, Cuerda Huida y bayas.",
            }
            exact_description = (custom_item_reference_texts[ident] if ident < len(custom_item_reference_texts) else "").strip()
            if not exact_description:
                raise ValueError(f"Alpha2 item {ident} project reference text is missing from bank 223")
            desc = {"en": exact_description, "es": alpha2_descriptions[ident]}
        sprite = f"../sprites/items/{ident}.png"
        if not (ROOT/"web/sprites/items"/f"{ident}.png").exists() or label in CUSTOM_ITEMS:
            sprite = None
        if ident in custom_item_icons:
            sprite = custom_item_icons[ident]["sprite"]
        items[ident] = {"id":ident,"nds_id":ident,"name":{"en":label,"es":spanish},
                        "description":desc,"sprite":sprite,"reference_id":reference_id,
                        "custom":label in CUSTOM_ITEMS or (target_hash == ALPHA2_TARGET_SHA and ident in ALPHA2_ITEM_TRANSLATIONS)}
        if ident in custom_item_icons:
            items[ident]["icon_status"] = custom_item_icons[ident]["asset_status"]
        member = struct.unpack_from("<H", arm9, 0x100194 + ident * 8)[0]
        raw_item = item_records[member]
        pocket = (struct.unpack_from("<H", raw_item, 8)[0] >> 7) & 15
        items[ident].update(category_id=f"pocket-{pocket}", category=POCKET_NAMES.get(pocket,{"en":"Other","es":"Otros"}))
        if 328 <= ident <= 427:
            kind, number = ("tm", ident - 327) if ident < 420 else ("hm", ident - 419)
            items[ident].update(category_id=kind, category={"en":"Technical Machines" if kind=="tm" else "Hidden Machines", "es":"Máquinas técnicas" if kind=="tm" else "Máquinas ocultas"})
            items[ident]["move_id"] = tm_moves[ident - 328]
            items[ident]["description"] = tmhm_description(items[ident]["description"], moves[items[ident]["move_id"]]["description"])
    acquisition_path = ROOT / "docs/item-locations.json"
    if acquisition_path.exists() and target_hash != ALPHA2_TARGET_SHA:
        acquisition_doc = json.loads(acquisition_path.read_text(encoding="utf-8"))
        if acquisition_doc["target_sha256"] != TARGET_SHA:
            raise ValueError("Acquisition reference must use the verified inherited-data build")
        for ident, reference in acquisition_doc["items"].items():
            if int(ident) in items:
                items[int(ident)]["acquisition"] = reference.get("acquisition", [])
    shop_path = ROOT / "docs/shop-locations.json"
    if shop_path.exists() and target_hash == NATIVE_TARGET_SHA:
        add_shop_acquisitions(items, json.loads(shop_path.read_text(encoding="utf-8")), target_hash, acquisition_evidence)
    elif target_hash == ALPHA2_TARGET_SHA:
        add_documented_upstream_acquisitions(items)
        alpha2_shop_report = load_alpha2_shop_locations(arm9, item_records, items)
        add_alpha2_shop_stock(items, alpha2_shop_report)
        add_alpha2_shop_purchases(items, acquisition_evidence)
    if target_hash == NATIVE_TARGET_SHA:
        gift_evidence = acquisition_evidence[("item", 113, 60)]
        items[113].update(name={"en":"TM Refill","es":"Recarga MT"}, custom=True,
            description={"en":"Reusable key item. Restores owned TM01–TM92 quantities below 99 to 99; missing TMs and HMs are unchanged.",
                         "es":"Objeto clave reutilizable. Repone a 99 las MT01–MT92 que ya tienes. No concede MT ausentes ni modifica MO."},
            acquisition=[{"location":{"id":60,"name":{"en":"New Bark Town","es":"Pueblo Primavera"}},
                          "method":{"en":"One-time gift from the adult NPC south of the southwest house. Accept the offer; if declined, speak to him again before accepting.",
                                    "es":"Regalo único del NPC adulto al sur de la casa suroeste. Acepta la oferta; si la rechazas, vuelve a hablar antes de aceptarla."},
                          "status":"verified_target","source":{"title":"Native NPC and item QA","reference":"qa-native-tm.json"},
                          "evidence":gift_evidence}])
    elif target_hash == ALPHA2_TARGET_SHA:
        add_alpha2_gift_acquisitions(items, acquisition_evidence)
    grouped = defaultdict(list)
    species_by_id = {entry["id"]:entry for entry in species}
    for entry in species:
        for evolution in entry["evolutions"]:
            evolution["condition"] = evolution_condition(evolution, items, moves, species_by_id)
    for member in json.loads((ROOT/"docs/trainers-all-final.json").read_text())["records"]:
        record = {k:member[k] for k in ("slot","species_id","form","level","item_id","move_ids","move_source")}
        record.update(trainer_member_stats(trainer_parties[member["trainer_id"]], trainer_headers[member["trainer_id"]][0], member))
        record["move_ids"] = [move for move in record["move_ids"] if move]
        if record["move_source"] == "implicit_learnset" and not record["form"]:
            record["move_ids"] = default_moves(species_by_id[record["species_id"]]["learnset"], record["level"])
            record["move_resolution"] = "derived_from_target_learnset"
        elif record["move_source"] == "implicit_learnset":
            record["move_resolution"] = "alternate_form_pending"
        else:
            record["move_resolution"] = "explicit_target_record"
        grouped[member["trainer_id"]].append(record)
    trainers = []
    for ident,members in sorted(grouped.items()):
        maximum = max(member["level"] for member in members)
        for member in members:
            plus_level = max(member["level"], min(100, level_table[maximum] - (maximum - member["level"])))
            member["levels_by_mode"] = {"normal": member["level"], "plus": plus_level}
            plus_moves = member["move_ids"]
            if member["move_source"] == "implicit_learnset" and not member["form"]:
                plus_moves = default_moves(species_by_id[member["species_id"]]["learnset"], plus_level)
            member["move_ids_by_mode"] = {"normal": member["move_ids"], "plus": plus_moves}
        label = trainer_labels[ident]
        class_id = trainer_headers[ident][1]
        class_name = class_labels[class_id] if class_id<len(class_labels) else ""
        trainers.append({"id":ident,"name":{"en":label,"es":label},"class_id":class_id,
                         "class_name":{"en":class_name,"es":class_name},"members":members})
    journey_path = ROOT / "docs/trainer-journey.json"
    journey = None
    journey_provenance = None
    if target_hash == ALPHA2_TARGET_SHA and not journey_path.is_file():
        raise ValueError("Alpha2 requires the preserved Alpha1 trainer journey source")
    if journey_path.exists():
        journey = json.loads(journey_path.read_text(encoding="utf-8"))
        if journey["target_sha256"] != target_hash:
            if target_hash == ALPHA2_TARGET_SHA and journey["target_sha256"] == NATIVE_TARGET_SHA:
                if digest(journey_path) != ALPHA1_TRAINER_JOURNEY_SHA:
                    raise ValueError("Alpha2 trainer journey source hash differs from the reviewed Alpha1 data")
                _, audit = load_alpha2_build_audit()
                if len(journey.get("stages", [])) != 90 or len(journey.get("trainers", {})) != 639:
                    raise ValueError("Alpha2 inherited trainer journey differs from its 90-stage, 639-trainer source")
                journey_provenance = {
                    "source_rom_sha256": NATIVE_TARGET_SHA,
                    "target_rom_sha256": ALPHA2_TARGET_SHA,
                    "source_sha256": digest(journey_path),
                    "comparison_report_sha256": ALPHA2_BUILD_REPORT_SHA,
                    "byte_identical_trainer_narcs": [
                        audit["byte_identical_metadata_narcs"]["trainer_headers"]["path"],
                        audit["byte_identical_metadata_narcs"]["trainer_parties"]["path"],
                    ],
                    "trainer_name_and_class_banks_unchanged": True,
                }
            else:
                raise ValueError("Trainer journey targets a different ROM")
        if journey:
            for trainer in trainers:
                trainer["journey"] = journey["trainers"].get(str(trainer["id"]))
    location_path = ROOT / "docs/trainer-locations.json"
    if location_path.exists():
        location_doc = json.loads(location_path.read_text(encoding="utf-8"))
        if location_doc["target_sha256"] != TARGET_SHA:
            raise ValueError("Trainer location source targets a different ROM")
        for trainer in trainers:
            entry = location_doc["trainers"].get(str(trainer["id"]), {})
            trainer["locations"] = entry.get("locations", [])
            trainer["location_status"] = "verified" if trainer["locations"] else "pending"
            portrait = entry.get("portrait")
            if portrait:
                path = Path(portrait["src"])
                if path.is_absolute() or ".." in path.parts or path.parts[:3] != ("web", "sprites", "trainers"):
                    raise ValueError("Trainer portrait must be a relative local asset")
                if not (ROOT / path).is_file():
                    raise ValueError("Trainer portrait asset is missing")
                trainer["portrait"] = {**portrait, "src": "../" + path.relative_to("web").as_posix()}
    ability_ids = {ident for entry in species for ident in entry["abilities"]}
    abilities = {ident:{"name":names["abilities"][ident],"description":flavors["abilities"].get(ident,{})} for ident in ability_ids}
    types = {ident:names["types"][reference_id] for ident,reference_id in TYPE_REFS.items()}
    for ident in types:
        icon = ROOT / "web/sprites/types" / f"{ident}.png"
        if not icon.is_file():
            raise ValueError(f"Missing local type icon: {ident}")
        types[ident] = {**types[ident], "icon": f"../sprites/types/{ident}.png"}
    types[18] = {"en":"Typeless","es":"Sin tipo"}
    result = {"schema":"ultimate-gold-wiki-data/v2","target_sha256":target_hash,"inherited_data_sha256":TARGET_SHA,"species":species,
              "types":types,"abilities":abilities,"moves":moves,"items":items,"trainers":trainers,"guides":{},
              "trainer_journey": {"stages": journey["stages"], "source": journey["source"]} if journey else None,
              "trainer_journey_provenance": journey_provenance,
              "game_modes": {
                  "normal":{"name":{"en":"Normal","es":"Normal"},"description":{"en":"Original trainer levels. Baseline IVs and EVs.","es":"Niveles originales de entrenadores. IV y EV de base."}},
                  "plus":{"name":{"en":"Plus","es":"Plus"},"description":{"en":"Native Plus trainer-level scaling, capped at 100. IVs and EVs stay unchanged; default moves follow the effective level.","es":"Escalado nativo Plus de entrenadores, hasta nivel 100. Los IV y EV se conservan; los movimientos predeterminados siguen el nivel efectivo."}},
              },
              "tmhm":[{"item_id":328+i,"move_id":move,"kind":"tm" if i<92 else "hm","number":i+1 if i<92 else i-91} for i,move in enumerate(tm_moves)],
              "source_notes":{"names":"Target message banks 750/222/729/730. Spanish uses matched PokeAPI names, not reused numeric IDs.",
                              "records":"Target NARCs and project exports; no gameplay acceptance inferred.",
                              "trainer_stats":"Trainer party byte 0 scales uniform IVs as floor(byte*31/255). Ordinary party records contain no EV spread; standard native creation initializes EVs to zero. Values describe the baseline, not arbitrary challenge or cheat changes.",
                              "game_modes":"Plus party source and exact target code/table fingerprints verified. The hook only changes CreateMon level; IV/PID are computed before it. Wild-level scaling is an independent game option.",
                              "ability_slots":"Exact target standard ability slots 1/2; the native personal format and selector do not expose a third hidden-ability slot. A canonically hidden ability placed in slot 2 by the hack remains a standard slot in this build.",
                              "descriptions":"English item descriptions use HGSS-matched references except three project custom strings stored in bank 223. Spanish descriptions use matched references and project translations with HGSS-mechanics corrections. These are wiki references, not proof of native target-ROM effects or Bag text.",
                              "sprites":"Pinned PokeAPI sprites; separate provenance manifests.","runtime":"NOT_RUN"}}
    if target_hash == ALPHA2_TARGET_SHA:
        result["source_notes"].update({
            "item_descriptions":"Item names come from bank 222. Wiki English text for three custom items uses project strings patched into bank 223. The exact Alpha2 native Bag getter at 0x02077D64 reads bank 221, where entries 113, 114 and 118 are empty: this is a confirmed text-bank bug awaiting the integration build. Other item English descriptions use matched HGSS references; text does not prove native effects.",
            "acquisition":"Alpha2 preserves 150 explicitly documented upstream notes and 208 exact-target shop-by-map stock rows (194 shop inventories across 34 map links). Only the three Rocket gifts and two purchases have native action evidence; gift battery persistence is not tested.",
            "trainer_journey":"The 90-stage, 639-trainer route order is carried from Alpha1 because the exact build comparison proves trainer headers/parties and trainer name/class messages unchanged; it remains an order reference, not a gameplay route acceptance.",
        })
    assert len(species)==493 and len({p["id"] for p in species})==493
    assert len(trainers)==len(grouped) and sum(len(t["members"])for t in trainers)==2086
    assert moves[27]["name"]["es"]=="Voz Cautivadora"
    assert items[467]["name"]["es"]=="Orbe Pacto"
    assert moves[33]["power"]>0 and moves[347]["pp"]>0
    args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"species":len(species),"moves":len(moves),"items":len(items),"trainers":len(trainers),"members":2086}))

if __name__=="__main__":
    main()
