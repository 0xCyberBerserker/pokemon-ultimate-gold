#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { narcRecords } = require('./extract_tmhm_compatibility.cjs');
const { resolveForm } = require('./extract_trainer_abilities.cjs');
const { defaultMoves } = require('./audit_trainer_team_data.cjs');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_SHA256 = '65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105';
const TARGET_SHA256 = '24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6';
const HEADER_SHA256 = 'ecbaf5a3ca95867c4479f0b5571546ab3edf4a0f3d0d01355579f466cf2a3142';
const PARTY_SHA256 = '114fb7172c4fb11c707e26c4179fbe394265f3ea9bfbce5b8ee12a1ead3375dc';
const LEARNSET_SHA256 = 'd22293308e9c4c92241a1576a0e83fd8850cc4e9d49effec3d059190a1b8e98b';
const WIKI_DATA_SHA256 = '461c3671db3babfa672623cc511593f2b46f83ae17a73326373d557af485868c';
const PARTY_SIZE = { 0: 8, 1: 16, 2: 10, 3: 18 };
const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');

function ndsFile(data, wantedPath) {
  const fnt = data.readUInt32LE(0x40);
  const fat = data.readUInt32LE(0x48);
  const ids = new Map();
  const visited = new Set();
  function walk(directory, prefix) {
    if (visited.has(directory)) throw new Error('NDS file-name table has a directory cycle');
    visited.add(directory);
    const entry = fnt + (directory & 0x0fff) * 8;
    let position = fnt + data.readUInt32LE(entry);
    let fileId = data.readUInt16LE(entry + 4);
    while (position < data.length && data[position]) {
      const flags = data[position++];
      const length = flags & 0x7f;
      if (position + length > data.length) throw new Error('NDS file-name table entry is out of bounds');
      const name = data.toString('ascii', position, position + length);
      position += length;
      if (flags & 0x80) {
        const child = data.readUInt16LE(position);
        position += 2;
        walk(child, `${prefix}${name}/`);
      } else ids.set(`${prefix}${name}`, fileId++);
    }
  }
  walk(0xf000, '');
  const id = ids.get(wantedPath);
  if (id === undefined) throw new Error(`NDS path missing: ${wantedPath}`);
  const start = data.readUInt32LE(fat + id * 8);
  const end = data.readUInt32LE(fat + id * 8 + 4);
  if (start > end || end > data.length) throw new Error(`NDS path out of bounds: ${wantedPath}`);
  return data.subarray(start, end);
}

function decodeLearnset(record) {
  const result = [];
  for (let offset = 0; offset + 2 <= record.length; offset += 2) {
    const packed = record.readUInt16LE(offset);
    if (packed === 0xffff) return result;
    result.push({ level: packed >> 9, move_id: packed & 0x01ff });
  }
  throw new Error('Unterminated learnset record');
}

function reconstruct(source, manifest) {
  const delta = fs.readFileSync(path.join(ROOT, 'patches', manifest.delta.file));
  if (sha256(delta) !== manifest.delta.sha256) throw new Error('Alpha 2 delta hash mismatch');
  const BinFile = require('../web/vendor/rompatcher/BinFile.js');
  const VCDIFF = require('../web/vendor/rompatcher/vcdiff.js');
  const oldInfo = console.info;
  console.info = () => {};
  try {
    const output = new VCDIFF(new BinFile(delta)).apply(new BinFile(source), false)._u8array;
    return Buffer.from(output.buffer, output.byteOffset, output.byteLength);
  } finally {
    console.info = oldInfo;
  }
}

function parsePinnedWikiData(bytes) {
  if (!Buffer.isBuffer(bytes) || sha256(bytes) !== WIKI_DATA_SHA256) throw new Error('Wiki data SHA-256 mismatch');
  const wiki = JSON.parse(bytes.toString('utf8'));
  if (!wiki || wiki.schema !== 'ultimate-gold-wiki-data/v2' || wiki.target_sha256 !== TARGET_SHA256
      || !Array.isArray(wiki.trainers) || !Array.isArray(wiki.species)
      || !wiki.moves || typeof wiki.moves !== 'object' || Array.isArray(wiki.moves)) {
    throw new Error('Wiki data structure or target is invalid');
  }
  return wiki;
}

function validateLevel(level, label) {
  if (!Number.isInteger(level) || level < 1 || level > 100) throw new Error(`Invalid ${label} level`);
}

function namedMoves(learnset, level, wikiMoves) {
  return defaultMoves(learnset, level).map((id) => {
    const move = wikiMoves[id];
    if (!move || move.id !== id || !move.name
        || typeof move.name.en !== 'string' || !move.name.en.trim()
        || typeof move.name.es !== 'string' || !move.name.es.trim()) {
      throw new Error(`Missing or malformed wiki move ${id}`);
    }
    return { id, name: move.name };
  });
}

function buildCandidates({ base, formLearnset, level, plusLevel, wikiMoves }) {
  validateLevel(level, 'normal');
  validateLevel(plusLevel, 'Plus');
  if (plusLevel < level) throw new Error('Plus level is below normal level');
  return {
    base_normal: namedMoves(base, level, wikiMoves),
    base_plus: namedMoves(base, plusLevel, wikiMoves),
    mapped_form_normal: namedMoves(formLearnset, level, wikiMoves),
    mapped_form_plus: namedMoves(formLearnset, plusLevel, wikiMoves),
  };
}

function collectFormCandidates(rows, learnsets, wiki) {
  if (!Array.isArray(rows) || !Array.isArray(wiki.trainers) || !Array.isArray(learnsets)
      || !wiki.moves || typeof wiki.moves !== 'object' || Array.isArray(wiki.moves)) {
    throw new Error('Trainer, learnset, or wiki move inputs are missing');
  }
  const wikiMembers = new Map(wiki.trainers.flatMap((trainer) => {
    if (!trainer || !Number.isInteger(trainer.id) || !Array.isArray(trainer.members)) throw new Error('Malformed wiki trainer');
    return trainer.members.map((member) => [`${trainer.id}:${member.slot}`, { trainer, member }]);
  }));
  return rows.map((row) => {
    const { trainer, member } = wikiMembers.get(`${row.trainer_id}:${row.slot}`) || {};
    if (!member || member.species_id !== row.species_id || member.form !== row.form
        || member.level !== row.level || member.item_id !== row.item_id) {
      throw new Error(`Wiki/raw trainer position mismatch at trainer ${row.trainer_id}, slot ${row.slot}`);
    }
    validateLevel(row.level, 'normal');
    if (!Array.isArray(member.move_ids)) throw new Error(`Missing wiki move IDs at trainer ${row.trainer_id}, slot ${row.slot}`);
    if (member.move_resolution !== 'alternate_form_pending') throw new Error(`Unexpected wiki move-resolution status at trainer ${row.trainer_id}, slot ${row.slot}`);
    const plusLevel = member.levels_by_mode?.plus;
    const personalId = resolveForm(row.species_id, row.form);
    if (!learnsets[personalId] || !learnsets[row.species_id]) throw new Error(`Missing base/form learnset at trainer ${row.trainer_id}, slot ${row.slot}`);
    const candidates = buildCandidates({
      base: learnsets[row.species_id],
      formLearnset: learnsets[personalId],
      level: row.level,
      plusLevel,
      wikiMoves: wiki.moves,
    });
    return {
      trainer_id: row.trainer_id,
      trainer_name: trainer.name,
      slot: row.slot,
      species_id: row.species_id,
      form: row.form,
      learnset_record_id: personalId,
      level: row.level,
      plus_level: plusLevel,
      wiki_displayed_move_ids: member.move_ids,
      wiki_move_resolution: member.move_resolution,
      resolver_uses_base_record: personalId === row.species_id,
      base_learnset_equals_form_record: JSON.stringify(learnsets[row.species_id]) === JSON.stringify(learnsets[personalId]),
      candidates,
    };
  });
}

function auditForms(target, wikiBytes, manifest) {
  const wiki = parsePinnedWikiData(wikiBytes);
  if (sha256(target) !== TARGET_SHA256 || TARGET_SHA256 !== manifest.target.sha256) throw new Error('Alpha 2 target hash mismatch');
  const partyBytes = ndsFile(target, 'a/0/5/6');
  const headerBytes = ndsFile(target, 'a/0/5/5');
  const learnsetBytes = ndsFile(target, 'a/0/3/3');
  if (sha256(headerBytes) !== HEADER_SHA256 || sha256(partyBytes) !== PARTY_SHA256 || sha256(learnsetBytes) !== LEARNSET_SHA256) throw new Error('Alpha 2 trainer/learnset NARC hash mismatch');
  const headers = narcRecords(headerBytes);
  const parties = narcRecords(partyBytes);
  const learnsets = narcRecords(learnsetBytes).map(decodeLearnset);
  if (headers.length !== 738 || parties.length !== 738 || learnsets.length !== 508) throw new Error('Unexpected Alpha 2 NARC record counts');
  const rows = [];
  for (let trainerId = 0; trainerId < headers.length; trainerId += 1) {
    const kind = headers[trainerId][0];
    const size = PARTY_SIZE[kind];
    const count = headers[trainerId][3];
    if (size === undefined || count > 6 || parties[trainerId].length < count * size) throw new Error(`Invalid trainer record ${trainerId}`);
    for (let slot = 0; slot < count; slot += 1) {
      const offset = slot * size;
      const packed = parties[trainerId].readUInt16LE(offset + 4);
      const species_id = packed & 0x03ff;
      const form = packed >> 10;
      if (!form || (kind & 1)) continue;
      rows.push({
        trainer_id: trainerId,
        slot,
        species_id,
        form,
        level: parties[trainerId].readUInt16LE(offset + 2),
        item_id: (kind & 2) ? parties[trainerId].readUInt16LE(offset + 6) : 0,
      });
    }
  }
  const members = collectFormCandidates(rows, learnsets, wiki);
  if (members.length !== 8) throw new Error(`Expected 8 implicit alternate-form members; found ${members.length}`);
  return {
    schema: 'ultimate-gold-trainer-form-moves-audit/v1',
    evidence: {
      target_sha256: sha256(target),
      wiki_data_sha256: WIKI_DATA_SHA256,
      trainer_headers_sha256: sha256(headerBytes),
      trainer_parties_sha256: sha256(partyBytes),
      learnsets_sha256: sha256(learnsetBytes),
      runtime_attestation: 'not_performed',
      engine_rule_reference: 'The existing local trainer ability extractor references ResolveMonForm and states the trainer form is set after CreateMon; no local exact-target source or execution establishes when the move routine consumes a form learnset.',
    },
    counts: {
      members: members.length,
      wiki_members_with_empty_move_ids: members.filter((entry) => !entry.wiki_displayed_move_ids.length).length,
      base_and_mapped_form_learnsets_equal: members.filter((entry) => entry.base_learnset_equals_form_record).length,
      form_learnset_candidates_differ_from_base_at_normal_or_plus_level: members.filter((entry) =>
        JSON.stringify(entry.candidates.base_normal) !== JSON.stringify(entry.candidates.mapped_form_normal)
        || JSON.stringify(entry.candidates.base_plus) !== JSON.stringify(entry.candidates.mapped_form_plus)).length,
    },
    members,
  };
}

function main() {
  if (process.argv.length !== 4 || process.argv[2] !== '--source') throw new Error('Usage: node tools/audit_trainer_forms_moves.cjs --source /external/HeartGold-USA.nds');
  const source = fs.readFileSync(path.resolve(process.argv[3]));
  if (sha256(source) !== SOURCE_SHA256) throw new Error('Clean HeartGold USA source hash mismatch');
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'patches/manifest-alpha2.json'), 'utf8'));
  const target = reconstruct(source, manifest);
  const wikiBytes = fs.readFileSync(path.join(ROOT, 'docs/wiki-data.json'));
  process.stdout.write(`${JSON.stringify(auditForms(target, wikiBytes, manifest), null, 2)}\n`);
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}

module.exports = { auditForms, buildCandidates, collectFormCandidates, decodeLearnset, ndsFile, parsePinnedWikiData, validateLevel };
