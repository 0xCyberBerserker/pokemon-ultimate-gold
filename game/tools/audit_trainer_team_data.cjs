#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { narcRecords } = require('./extract_tmhm_compatibility.cjs');
const { extract: extractAbilities } = require('./extract_trainer_abilities.cjs');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_SHA256 = '65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105';
const TARGET_SHA256 = '24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6';
const PARTY_SHA256 = '114fb7172c4fb11c707e26c4179fbe394265f3ea9bfbce5b8ee12a1ead3375dc';
const LEARNSETS_SHA256 = 'd22293308e9c4c92241a1576a0e83fd8850cc4e9d49effec3d059190a1b8e98b';
const BUILD_REPORT_SHA256 = '12f76a7c3afff0942ea7bc920fda4c0c45341c162d80f60627b8bba5787301a3';
const LEGACY_TRAINERS_SHA256 = 'ffab530d1da7789a0c00254ca1b5e1011cb12f8b4cf19421c75b8b04c121b6ce';
const PARTY_SIZE = { 0: 8, 1: 16, 2: 10, 3: 18 };
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function defaultMoves(learnset, level) {
  const moves = [];
  for (const entry of learnset) {
    if (entry.level > level) break;
    if (entry.move_id && !moves.includes(entry.move_id)) moves.push(entry.move_id);
    if (moves.length > 4) moves.shift();
  }
  return moves;
}

function parsePinnedLegacy(bytes) {
  if (sha256(bytes) !== LEGACY_TRAINERS_SHA256) throw new Error('Legacy trainer table SHA-256 mismatch');
  return JSON.parse(bytes.toString('utf8'));
}

function explicitMoveModeIssues(modeData, resolvedMoves) {
  const issues = [];
  if (JSON.stringify(modeData?.normal) !== JSON.stringify(resolvedMoves)) issues.push('explicit_normal_mode_moves_differ');
  if (!Array.isArray(modeData?.plus)) issues.push('missing_explicit_plus_moves');
  else if (JSON.stringify(modeData.plus) !== JSON.stringify(resolvedMoves)) issues.push('plus_explicit_moves_changed');
  return issues;
}

function ndsFile(target, wantedPath) {
  const fnt = target.readUInt32LE(0x40);
  const fat = target.readUInt32LE(0x48);
  const fileIds = new Map();
  const walk = (directory, prefix) => {
    const entry = fnt + (directory & 0x0fff) * 8;
    let position = fnt + target.readUInt32LE(entry);
    let id = target.readUInt16LE(entry + 4);
    while (target[position]) {
      const flags = target[position++];
      const length = flags & 0x7f;
      const name = target.toString('ascii', position, position + length);
      position += length;
      if (flags & 0x80) {
        const child = target.readUInt16LE(position);
        position += 2;
        walk(child, `${prefix}${name}/`);
      } else {
        fileIds.set(`${prefix}${name}`, id++);
      }
    }
  };
  walk(0xf000, '');
  const file = (wanted) => {
    const id = fileIds.get(wanted);
    if (id === undefined) throw new Error(`Missing NDS path: ${wanted}`);
    const start = target.readUInt32LE(fat + id * 8);
    const end = target.readUInt32LE(fat + id * 8 + 4);
    if (start > end || end > target.length) throw new Error(`Invalid NDS path: ${wanted}`);
    return target.subarray(start, end);
  };
  return file(wantedPath);
}

function readTrainerRows(target) {
  const headerNarc = ndsFile(target, 'a/0/5/5');
  const partyNarc = ndsFile(target, 'a/0/5/6');
  const headers = narcRecords(headerNarc);
  const parties = narcRecords(partyNarc);
  if (headers.length !== 738 || parties.length !== 738 || sha256(partyNarc) !== PARTY_SHA256) {
    throw new Error('Alpha 2 trainer NARC count/hash mismatch');
  }
  const rows = [];
  for (let id = 0; id < headers.length; id += 1) {
    const kind = headers[id][0];
    const count = headers[id][3];
    const size = PARTY_SIZE[kind];
    if (size === undefined || count > 6 || parties[id].length < size * count) throw new Error(`Invalid trainer record ${id}`);
    for (let slot = 0; slot < count; slot += 1) {
      const off = slot * size;
      const packed = parties[id].readUInt16LE(off + 4);
      const moveOffset = off + 6 + ((kind & 2) ? 2 : 0);
      rows.push({
        trainer_id: id,
        slot,
        kind,
        species_id: packed & 0x03ff,
        form: packed >> 10,
        level: parties[id].readUInt16LE(off + 2),
        item_id: (kind & 2) ? parties[id].readUInt16LE(off + 6) : 0,
        explicit_record: Boolean(kind & 1),
        raw_move_ids: (kind & 1) ? Array.from({ length: 4 }, (_, i) => parties[id].readUInt16LE(moveOffset + i * 2)) : null,
      });
    }
  }
  return rows;
}

function readLearnsets(target) {
  const bytes = ndsFile(target, 'a/0/3/3');
  if (sha256(bytes) !== LEARNSETS_SHA256) throw new Error('Alpha 2 learnset NARC hash mismatch');
  const records = narcRecords(bytes);
  if (records.length !== 508) throw new Error('Alpha 2 learnset record count mismatch');
  return records.map((record) => {
    const learnset = [];
    let terminated = false;
    for (let offset = 0; offset + 2 <= record.length; offset += 2) {
      const packed = record.readUInt16LE(offset);
      if (packed === 0xffff) { terminated = true; break; }
      learnset.push({ level: packed >> 9, move_id: packed & 0x01ff });
    }
    if (!terminated) throw new Error('Unterminated Alpha 2 learnset record');
    return learnset;
  });
}

function reconstruct(source, manifest) {
  const patch = fs.readFileSync(path.join(ROOT, 'patches', manifest.delta.file));
  if (sha256(patch) !== manifest.delta.sha256) throw new Error('Alpha 2 delta SHA-256 mismatch');
  const BinFile = require('../web/vendor/rompatcher/BinFile.js');
  const VCDIFF = require('../web/vendor/rompatcher/vcdiff.js');
  const quiet = console.info;
  console.info = () => {};
  try {
    const out = new VCDIFF(new BinFile(patch)).apply(new BinFile(source), false)._u8array;
    return Buffer.from(out.buffer, out.byteOffset, out.byteLength);
  } finally {
    console.info = quiet;
  }
}

function audit(target, manifest, wiki) {
  const rows = readTrainerRows(target);
  const targetLearnsets = readLearnsets(target);
  const legacyPath = path.join(ROOT, 'docs/trainers-all-final.json');
  const legacyBytes = fs.readFileSync(legacyPath);
  const legacy = parsePinnedLegacy(legacyBytes);
  const buildReportBytes = fs.readFileSync(path.join(ROOT, 'docs/qa-alpha2-build.json'));
  const buildReport = JSON.parse(buildReportBytes);
  const trainerNarcEvidence = buildReport.alpha1_vs_fix6a_fnt_audit?.byte_identical_metadata_narcs || {};
  if (sha256(buildReportBytes) !== BUILD_REPORT_SHA256
      || trainerNarcEvidence.trainer_headers?.byte_identical !== true
      || trainerNarcEvidence.trainer_parties?.byte_identical !== true
      || trainerNarcEvidence.learnsets?.byte_identical !== true
      || trainerNarcEvidence.learnsets?.sha256 !== LEARNSETS_SHA256
      || legacy.target_sha256 !== require('../docs/species-493.json').target.sha256
      || legacy.records.length !== 2086
      || new Set(legacy.records.map((member) => `${member.trainer_id}:${member.slot}`)).size !== 2086) {
    throw new Error('Legacy trainer rows lack pinned exact-target byte-identity provenance');
  }
  const legacyMembers = new Map(legacy.records.map((member) => [`${member.trainer_id}:${member.slot}`, member]));
  const wikiMembers = new Map(wiki.trainers.flatMap((trainer) => trainer.members.map((member) => [
    `${trainer.id}:${member.slot}`, { trainer, member },
  ])));
  const species = new Map(wiki.species.map((entry) => [entry.id, entry]));
  const errors = [];
  const counts = { members: rows.length, legacy_position_matches: 0, wiki_learnset_records_checked: 0, wiki_learnset_record_mismatches: 0,
    explicit: 0, implicit: 0, implicit_base_form: 0, implicit_alternate_form: 0,
    explicit_all_zero: 0, explicit_zero_padding: 0, forms: 0, duplicates_raw: 0, duplicates_resolved: 0,
    move_slots_checked: 0, learnsets_checked: 0, invalid_move_references: 0, ability_records: 0, ability_runtime_confirmed: 0,
    wiki_ability_fields: 0, wiki_unresolved_alternate_form: 0, wiki_empty_moves: 0, normal_plus_move_differences: 0 };
  const examples = { issues: [], alternate_forms: [], empty_implicit: [] };
  const addIssue = (code, row, actual, expected) => {
    errors.push({ code, trainer_id: row.trainer_id, slot: row.slot, species_id: row.species_id,
      form: row.form, actual, expected });
  };
  const speciesSource = require('../docs/species-493.json').target.sha256;
  if (wiki.target_sha256 !== TARGET_SHA256 || wiki.inherited_data_sha256 !== speciesSource) {
    throw new Error('Wiki dataset does not target Alpha 2 with the pinned inherited source');
  }
  if (wiki.trainers.length !== 737 || wikiMembers.size !== 2086 || rows.length !== 2086
      || wiki.species.length !== 493 || new Set(wiki.species.map((entry) => entry.id)).size !== 493) {
    throw new Error('Trainer/member/species coverage mismatch');
  }
  for (const profile of wiki.species) {
    const targetLearnset = targetLearnsets[profile.id];
    if (!targetLearnset) throw new Error(`Missing Alpha 2 learnset for species ${profile.id}`);
    counts.wiki_learnset_records_checked += 1;
    if (JSON.stringify(profile.learnset) !== JSON.stringify(targetLearnset)) {
      counts.wiki_learnset_record_mismatches += 1;
      errors.push({ code: 'wiki_learnset_differs_from_alpha2_narc', species_id: profile.id });
    }
  }
  for (const row of rows) {
    const key = `${row.trainer_id}:${row.slot}`;
    const sourceRow = legacyMembers.get(key);
    if (!sourceRow) addIssue('missing_legacy_position', row);
    else {
      const sourceMoves = sourceRow.move_ids.filter(Boolean);
      if (sourceRow.data_kind !== row.kind
          || sourceRow.species_id !== row.species_id || sourceRow.form !== row.form
          || sourceRow.level !== row.level || sourceRow.item_id !== row.item_id
          || sourceRow.move_source !== (row.explicit_record ? 'explicit_trainer_record' : 'implicit_learnset')
          || JSON.stringify(sourceMoves) !== JSON.stringify(row.raw_move_ids?.filter(Boolean) || [])) {
        addIssue('legacy_source_record_differs_from_target', row);
      } else counts.legacy_position_matches += 1;
    }
    const entry = wikiMembers.get(key);
    if (!entry) { addIssue('missing_wiki_member', row); continue; }
    const { member } = entry;
    for (const field of ['species_id', 'form', 'level', 'item_id']) {
      if (member[field] !== row[field]) addIssue(`field_mismatch_${field}`, row, member[field], row[field]);
    }
    if (row.form) {
      counts.forms += 1;
      if (examples.alternate_forms.length < 12) examples.alternate_forms.push({ trainer_id: row.trainer_id, slot: row.slot, species_id: row.species_id, form: row.form });
    }
    const raw = row.raw_move_ids;
    if (row.explicit_record) {
      counts.explicit += 1;
      counts.move_slots_checked += 4;
      const resolved = raw.filter(Boolean);
      if (JSON.stringify(member.move_ids) !== JSON.stringify(resolved)) addIssue('explicit_moves_differ_from_rom_slots', row, member.move_ids, resolved);
      if (JSON.stringify(member.move_ids_by_mode?.normal) !== JSON.stringify(resolved)) addIssue('explicit_normal_mode_moves_differ', row, member.move_ids_by_mode?.normal, resolved);
      if (member.move_source !== 'explicit_trainer_record') addIssue('explicit_source_mislabeled', row, member.move_source, 'explicit_trainer_record');
      if (!resolved.length) counts.explicit_all_zero += 1;
      counts.explicit_zero_padding += raw.filter((move, index) => !move && raw.slice(index + 1).some(Boolean)).length;
      if (new Set(resolved).size !== resolved.length) counts.duplicates_raw += 1;
      for (const code of explicitMoveModeIssues(member.move_ids_by_mode, resolved)) {
        addIssue(code, row, member.move_ids_by_mode, resolved);
      }
    } else {
      counts.implicit += 1;
      if (member.move_source !== 'implicit_learnset') addIssue('implicit_source_mislabeled', row, member.move_source, 'implicit_learnset');
      if (row.form) {
        counts.implicit_alternate_form += 1;
        if (member.move_resolution !== 'alternate_form_pending') addIssue('alternate_form_not_marked_pending', row, member.move_resolution, 'alternate_form_pending');
        counts.wiki_unresolved_alternate_form += 1;
      } else {
        counts.implicit_base_form += 1;
        const profile = species.get(row.species_id);
        if (!profile) { addIssue('missing_species_learnset', row); continue; }
        const normal = defaultMoves(targetLearnsets[row.species_id], row.level);
        counts.learnsets_checked += 1;
        if (JSON.stringify(member.move_ids) !== JSON.stringify(normal)) addIssue('implicit_moves_differ_from_learnset', row, member.move_ids, normal);
        const plusLevel = member.levels_by_mode?.plus;
        const plus = defaultMoves(targetLearnsets[row.species_id], plusLevel);
        if (JSON.stringify(member.move_ids_by_mode?.normal) !== JSON.stringify(normal)) addIssue('normal_mode_moves_differ', row, member.move_ids_by_mode?.normal, normal);
        if (JSON.stringify(member.move_ids_by_mode?.plus) !== JSON.stringify(plus)) addIssue('plus_mode_moves_differ_from_learnset', row, member.move_ids_by_mode?.plus, plus);
        if (!normal.length) {
          counts.wiki_empty_moves += 1;
          if (examples.empty_implicit.length < 12) examples.empty_implicit.push({ trainer_id: row.trainer_id, slot: row.slot, species_id: row.species_id, level: row.level });
        }
        if (normal.length > 4 || plus.length > 4) addIssue('moveset_exceeds_engine_slot_limit', row, { normal, plus }, 'maximum 4');
        if (new Set(normal).size !== normal.length) counts.duplicates_resolved += 1;
        if (JSON.stringify(normal) !== JSON.stringify(plus)) counts.normal_plus_move_differences += 1;
      }
    }
    if (Object.hasOwn(member, 'ability_id') || Object.hasOwn(member, 'ability')) counts.wiki_ability_fields += 1;
  }
  if (wikiMembers.size !== rows.length) errors.push({ code: 'wiki_member_total_mismatch', actual: wikiMembers.size, expected: rows.length });
  const abilityData = extractAbilities(target, manifest, narcRecords);
  counts.ability_records = abilityData.trainers.reduce((n, trainer) => n + trainer.members.length, 0);
  if (counts.ability_records !== rows.length) errors.push({ code: 'ability_coverage_mismatch', actual: counts.ability_records, expected: rows.length });
  const abilitySources = {};
  const abilitySlots = {};
  let ability2_fallbacks = 0;
  let unknownAbilities = 0;
  for (const trainer of abilityData.trainers) for (const member of trainer.members) {
    const source = member.ability_slot_source;
    abilitySources[source] = (abilitySources[source] || 0) + 1;
    abilitySlots[member.ability_slot] = (abilitySlots[member.ability_slot] || 0) + 1;
    if (member.ability_override === 2 && member.ability_slot === 1) ability2_fallbacks += 1;
    if (!wiki.abilities[member.ability_id]) unknownAbilities += 1;
  }
  for (const { member } of wikiMembers.values()) {
    const moves = [...(member.move_ids || []), ...(member.move_ids_by_mode?.normal || []), ...(member.move_ids_by_mode?.plus || [])];
    counts.invalid_move_references += moves.filter((id) => !wiki.moves[id]).length;
  }
  if (counts.invalid_move_references) errors.push({ code: 'unknown_move_references', count: counts.invalid_move_references });
  if (unknownAbilities) errors.push({ code: 'unknown_ability_references', count: unknownAbilities });
  return {
    schema: 'ultimate-gold-trainer-team-audit/v1',
    evidence: {
      source_sha256: SOURCE_SHA256,
      delta_sha256: manifest.delta.sha256,
      target_sha256: sha256(target),
      trainer_party_sha256: abilityData.evidence.trainer_parties.sha256,
      trainer_headers_sha256: abilityData.evidence.trainer_headers.sha256,
      trainer_parties_sha256: abilityData.evidence.trainer_parties.sha256,
      personal_sha256: abilityData.evidence.personal_data.sha256,
      alpha2_learnsets_sha256: sha256(ndsFile(target, 'a/0/3/3')),
      alpha1_alpha2_learnsets_byte_identical_sha256: trainerNarcEvidence.learnsets.sha256,
      legacy_trainer_rows_sha256: sha256(legacyBytes),
      alpha1_alpha2_trainer_narc_report_sha256: sha256(buildReportBytes),
      wiki_data_sha256: sha256(fs.readFileSync(path.join(ROOT, 'docs/wiki-data.json'))),
      legacy_species_target_sha256: speciesSource,
      ability_status: abilityData.evidence.resolution_status,
      runtime_attestation: abilityData.evidence.target_runtime_attestation,
    },
    counts,
    ability_slot_sources: abilitySources,
    ability_slots: abilitySlots,
    ability2_fallback_count: ability2_fallbacks,
    ability_catalog_missing: unknownAbilities,
    issues: errors.slice(0, 100),
    issue_count: errors.length,
    examples,
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--source') throw new Error('Usage: node tools/audit_trainer_team_data.cjs --source /external/HeartGold-USA.nds');
  const source = fs.readFileSync(path.resolve(args[1]));
  if (sha256(source) !== SOURCE_SHA256) throw new Error('Clean HeartGold USA source hash mismatch; refusing to apply delta');
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'patches/manifest-alpha2.json'), 'utf8'));
  const target = reconstruct(source, manifest);
  if (sha256(target) !== TARGET_SHA256 || target.length !== manifest.target.size) throw new Error('Reconstructed target hash/size mismatch');
  const wiki = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/wiki-data.json'), 'utf8'));
  const result = audit(target, manifest, wiki);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.issue_count) process.exitCode = 1;
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}

module.exports = { audit, defaultMoves, explicitMoveModeIssues, parsePinnedLegacy, readTrainerRows };
