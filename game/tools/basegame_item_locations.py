"""Attach HGSS references and report-pinned static comparisons to item data."""
from copy import deepcopy
import hashlib


PINNED_COMPARE_REPORT = "qa-item-basegame-compare-batch1.json"
PINNED_COMPARE_SHA256 = "2bcfe0a5a73905a572530441b750d49305cd90054f8766549c10fbc22a9eecff"
STATIC_EVENT_STATUS = "verified_event_script_static_no_gameplay"
STATIC_HELD_STATUS = "verified_held_item_data_static"


def _validate_comparison(data, reference, report, report_bytes):
    metadata = reference.get("comparison_evidence")
    if not isinstance(metadata, dict):
        raise ValueError("Static target claims require pinned comparison evidence")
    if metadata.get("report_file") != PINNED_COMPARE_REPORT:
        raise ValueError("Unexpected static comparison report")
    if metadata.get("report_sha256") != PINNED_COMPARE_SHA256:
        raise ValueError("Static comparison report pin does not match")
    if not isinstance(report, dict) or not isinstance(report_bytes, bytes):
        raise ValueError("Pinned static comparison report is unavailable")
    actual_sha256 = hashlib.sha256(report_bytes).hexdigest()
    if actual_sha256 != PINNED_COMPARE_SHA256:
        raise ValueError("Static comparison report bytes do not match the pinned SHA-256")

    if report.get("schema") != "sacred-gold-item-basegame-static-compare/v1":
        raise ValueError("Unknown static comparison report schema")
    if report.get("status") != "STATIC_COMPARE_COMPLETE_NO_GAMEPLAY":
        raise ValueError("Static comparison report has an unexpected status")
    if metadata.get("schema") != report.get("schema") or metadata.get("status") != report.get("status"):
        raise ValueError("Static comparison metadata does not match the pinned report")
    inputs = report.get("inputs", {})
    retail_sha = inputs.get("retail_rom", {}).get("sha256")
    target_sha = inputs.get("alpha2_rom", {}).get("sha256")
    if retail_sha != reference.get("base_rom_sha256") or retail_sha != metadata.get("base_rom_sha256"):
        raise ValueError("Static comparison base-ROM hash does not match")
    if target_sha != data.get("target_sha256") or target_sha != reference.get("target_sha256"):
        raise ValueError("Static comparison target-ROM hash does not match")
    if target_sha != metadata.get("target_sha256"):
        raise ValueError("Static comparison target-ROM pin does not match")
    if report.get("method", {}).get("runtime_tested") is not False:
        raise ValueError("Static report must explicitly exclude gameplay testing")
    return report


def _report_tm(report, item_id):
    entries = report.get("tm_event_comparison", [])
    match = next((entry for entry in entries if entry.get("item", {}).get("id") == item_id), None)
    if match is None:
        raise ValueError(f"Static report has no TM event/script record for item {item_id}")
    event = match.get("event_object", {})
    script = match.get("script", {})
    if not event.get("raw_record_sha256_both_roms"):
        raise ValueError(f"Static report lacks the paired event-record hash for item {item_id}")
    script_hash = script.get("compiled_entry_sha256_both_roms") or script.get("entry_sha256_both_roms")
    if not script_hash:
        raise ValueError(f"Static report lacks the paired script-entry hash for item {item_id}")
    return match


def _report_held_item(report, item_id, species_ids):
    held = report.get("wild_held_item_comparison", {})
    item = next((entry for entry in held.get("items", []) if entry.get("item_id") == item_id), None)
    if item is None or set(item.get("species_ids", [])) != set(species_ids):
        raise ValueError(f"Static report has no matching held-item species set for item {item_id}")
    slot = item.get("slot")
    if slot not in ("item1", "item2"):
        raise ValueError(f"Static report has an invalid held-item slot for item {item_id}")
    records = {entry.get("species_id"): entry for entry in held.get("species_records", [])}
    for species_id in species_ids:
        record = records.get(species_id)
        if not record or record.get(f"retail_{slot}") != item_id or record.get(f"alpha2_{slot}") != item_id:
            raise ValueError(f"Static report does not verify item {item_id} in both ROMs for species {species_id}")
    return item


def _validate_static_row(item_id, row, report, reference):
    evidence = row.get("evidence", {})
    proof = evidence.get("proof", {})
    if evidence.get("scope") != row.get("status"):
        raise ValueError(f"Static row scope does not match its status: item {item_id}")
    if (evidence.get("report", {}).get("path") != f"../data/{PINNED_COMPARE_REPORT}"
            or evidence.get("report", {}).get("sha256") != PINNED_COMPARE_SHA256):
        raise ValueError(f"Static row lacks its pinned report link: item {item_id}")
    if evidence.get("rom_sha256") != reference.get("target_sha256"):
        raise ValueError(f"Static row target-ROM hash does not match: item {item_id}")
    if evidence.get("base_rom_sha256") != reference.get("base_rom_sha256"):
        raise ValueError(f"Static row base-ROM hash does not match: item {item_id}")

    kind = proof.get("kind")
    if row.get("status") == STATIC_EVENT_STATUS and kind == "tm_event_comparison":
        if proof.get("item_id") != int(item_id):
            raise ValueError(f"TM proof item does not match its catalog row: {item_id}")
        _report_tm(report, int(item_id))
    elif row.get("status") == STATIC_HELD_STATUS and kind == "held_item_data":
        if proof.get("item_id") != int(item_id):
            raise ValueError(f"Held-item proof does not match its catalog row: {item_id}")
        species_ids = proof.get("species_ids")
        if not isinstance(species_ids, list) or not species_ids:
            raise ValueError(f"Held-item proof lacks species IDs: {item_id}")
        _report_held_item(report, int(item_id), species_ids)
    else:
        raise ValueError(f"Static status has no supported evidence proof: item {item_id}")


def apply_basegame_locations(data, reference, comparison_report=None, comparison_report_bytes=None):
    if reference.get("schema") != "ultimate-gold-basegame-locations/v1":
        raise ValueError("Unknown base-game location reference schema")
    if reference.get("target_sha256") != data.get("target_sha256"):
        raise ValueError("Base-game location reference targets a different ROM")

    has_static_claims = any(
        row.get("status") in (STATIC_EVENT_STATUS, STATIC_HELD_STATUS)
        for entry in reference.get("items", {}).values()
        for row in entry.get("acquisition", [])
    )
    report = None
    if has_static_claims:
        report = _validate_comparison(data, reference, comparison_report, comparison_report_bytes)

    updates = {}
    for item_id, entry in reference.get("items", {}).items():
        if item_id not in data["items"]:
            raise ValueError(f"Unknown item in base-game reference: {item_id}")
        additions = entry.get("acquisition", [])
        for row in additions:
            status = row.get("status")
            if status == "documented_base_game":
                pass
            elif status in (STATIC_EVENT_STATUS, STATIC_HELD_STATUS):
                if report is None:
                    raise ValueError("Static target claims require pinned comparison evidence")
                _validate_static_row(item_id, row, report, reference)
            else:
                raise ValueError("Base-game references cannot claim unsupported target verification")
            for field in ("method",):
                if not all(row.get(field, {}).get(lang) for lang in ("en", "es")):
                    raise ValueError(f"Incomplete localized {field}: {item_id}")
            if not row.get("location", {}).get("id") or not all(
                row.get("location", {}).get("name", {}).get(lang) for lang in ("en", "es")
            ):
                raise ValueError(f"Incomplete localized location: {item_id}")
            if not row.get("source", {}).get("author_reference", "").startswith("https://"):
                if status == "documented_base_game":
                    raise ValueError(f"Missing reference URL: {item_id}")
        current = data["items"][item_id].get("acquisition", [])
        if entry.get("replace_unchanged_placeholder"):
            current = [row for row in current if row.get("location", {}).get("id") != "unchanged-from-heartgold"]
        merged = deepcopy(current)
        for row in additions:
            if row not in merged:
                merged.append(deepcopy(row))
        updates[item_id] = merged
    # Validate the entire reference first, so a malformed later row changes nothing.
    for item_id, rows in updates.items():
        data["items"][item_id]["acquisition"] = rows
    data["basegame_location_reference"] = {
        "schema": reference["schema"], "target_sha256": reference["target_sha256"],
        "items": len(updates), "scope": "HGSS references and report-pinned static comparisons; no native acquisition acceptance",
        "comparison_report_sha256": PINNED_COMPARE_SHA256 if has_static_claims else None,
    }
