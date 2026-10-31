#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const GAME_ROOT = path.resolve(__dirname, '..');
const SOURCE_SHA256 = '65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105';
const TARGET_SHA256 = '24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6';
const TRAINER_HEADERS_SHA256 = 'ecbaf5a3ca95867c4479f0b5571546ab3edf4a0f3d0d01355579f466cf2a3142';
const TRAINER_PARTIES_SHA256 = '114fb7172c4fb11c707e26c4179fbe394265f3ea9bfbce5b8ee12a1ead3375dc';
const PERSONAL_SHA256 = '5f193d2eacddf0ffef9daf7acebd35dcdb21c30f59ab497759c3b7cc335f2d40';
const PARTY_SIZE = { 0: 8, 1: 16, 2: 10, 3: 18 };

const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function trainerAbilityContext(error, trainerId, kind, slot, offset) {
  const message = error instanceof Error ? error.message : String(error);
  return new Error(`Trainer ${trainerId} kind ${kind} slot ${slot} offset ${offset}: ${message}`);
}

function parseArgs(argv) {
  const args = { source: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--source') args.source = argv[++i];
    else if (argv[i] === '--output') args.output = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.source) throw new Error('--source must point to the external clean HeartGold USA ROM');
  return args;
}

function ndsFile(data, wantedPath) {
  if (data.length < 0x50) throw new Error('Reconstructed target is shorter than an NDS header');
  const fnt = data.readUInt32LE(0x40);
  const fat = data.readUInt32LE(0x48);
  const fileIds = new Map();
  const visited = new Set();

  function walk(directory, prefix) {
    if (visited.has(directory)) throw new Error('NDS file-name table contains a directory cycle');
    visited.add(directory);
    const entry = fnt + (directory & 0x0fff) * 8;
    if (entry + 8 > data.length) throw new Error('NDS file-name table directory is out of bounds');
    let position = fnt + data.readUInt32LE(entry);
    let fileId = data.readUInt16LE(entry + 4);
    while (position < data.length && data[position] !== 0) {
      const flags = data[position++];
      const length = flags & 0x7f;
      if (position + length > data.length) throw new Error('NDS file-name entry is out of bounds');
      const name = data.toString('ascii', position, position + length);
      position += length;
      if (flags & 0x80) {
        if (position + 2 > data.length) throw new Error('NDS directory reference is out of bounds');
        const child = data.readUInt16LE(position);
        position += 2;
        walk(child, `${prefix}${name}/`);
      } else {
        fileIds.set(`${prefix}${name}`, fileId);
        fileId += 1;
      }
    }
  }

  walk(0xf000, '');
  const fileId = fileIds.get(wantedPath);
  if (fileId === undefined || fat + fileId * 8 + 8 > data.length) throw new Error(`NDS path is missing: ${wantedPath}`);
  const start = data.readUInt32LE(fat + fileId * 8);
  const end = data.readUInt32LE(fat + fileId * 8 + 4);
  if (start > end || end > data.length) throw new Error(`NDS file is out of bounds: ${wantedPath}`);
  return data.subarray(start, end);
}

function resolveForm(species, form) {
  if (form === 0) return species;
  if (species === 386 && form <= 3) return 495 + form;
  if (species === 413 && form <= 2) return 498 + form;
  if (species === 487 && form === 1) return 501;
  if (species === 492 && form === 1) return 502;
  if (species === 479 && form <= 5) return 502 + form;
  // The HGSS ResolveMonForm switch falls back to the base species for forms
  // that the engine does not remap (for example Pinsir form 1 in this target).
  return species;
}

function trainerAbility(difficulty, override, species, form, personal) {
  const genderOverride = override & 0x0f;
  const abilityOverride = (override & 0xf0) >> 4;
  if (genderOverride > 2 || abilityOverride > 2) throw new Error(`Unsupported trainer override byte: ${override}`);
  const genderPersonalId = resolveForm(species, form);
  const genderRecord = personal[genderPersonalId];
  const abilityRecord = personal[species];
  if (!genderRecord || genderRecord.length !== 44) throw new Error(`Missing personal record ${genderPersonalId}`);
  if (!abilityRecord || abilityRecord.length !== 44) throw new Error(`Missing personal record ${species}`);

  // Both trainer-class defaults (0x78 female, 0x88 male) have an even low bit.
  let pidLowByte = 0x88;
  let slotSource = 'class_default_pid_low_bit';
  if (genderOverride !== 0) {
    pidLowByte = genderOverride === 1 ? genderRecord[0x10] + 2 : genderRecord[0x10] - 2;
    slotSource = 'species_gender_override_pid_low_bit';
  }
  if (abilityOverride === 1) {
    pidLowByte &= ~1;
    slotSource = 'party_forces_ability_1';
  } else if (abilityOverride === 2) {
    pidLowByte |= 1;
    slotSource = 'party_forces_ability_2';
  }

  const requestedSlot = (pidLowByte & 1) ? 2 : 1;
  const ability1 = abilityRecord[0x16];
  const ability2 = abilityRecord[0x17];
  const abilitySlot = requestedSlot === 2 && ability2 !== 0 ? 2 : 1;
  if (ability1 === 0) throw new Error(`Personal record ${species} has no standard ability 1`);
  return {
    difficulty,
    gender_ability_override: override,
    gender_override: genderOverride,
    ability_override: abilityOverride,
    ability_slot_source: slotSource,
    ability_slot: abilitySlot,
    ability_id: abilitySlot === 1 ? ability1 : ability2,
    ivs: Array(6).fill(Math.floor(difficulty * 31 / 255)),
    evs: [0, 0, 0, 0, 0, 0],
  };
}

function extract(target, manifest, narcRecords) {
  const targetSha = digest(target);
  if (targetSha !== TARGET_SHA256 || targetSha !== manifest.target.sha256) throw new Error('Alpha 2 target SHA-256 mismatch');
  const headerNarc = ndsFile(target, 'a/0/5/5');
  const partyNarc = ndsFile(target, 'a/0/5/6');
  const personalNarc = ndsFile(target, 'a/0/0/2');
  if (digest(headerNarc) !== TRAINER_HEADERS_SHA256) throw new Error('Alpha 2 trainer-header NARC hash mismatch');
  if (digest(partyNarc) !== TRAINER_PARTIES_SHA256) throw new Error('Alpha 2 trainer-party NARC hash mismatch');
  if (digest(personalNarc) !== PERSONAL_SHA256) throw new Error('Alpha 2 personal NARC hash mismatch');

  const headers = narcRecords(headerNarc);
  const parties = narcRecords(partyNarc);
  const personal = narcRecords(personalNarc);
  if (headers.length !== 738 || parties.length !== 738 || personal.length !== 508) throw new Error('Unexpected Alpha 2 NARC record counts');

  const trainers = [];
  for (let trainerId = 0; trainerId < headers.length; trainerId += 1) {
    const header = headers[trainerId];
    const party = parties[trainerId];
    if (header.length !== 20) throw new Error(`Trainer ${trainerId} header has an unexpected size`);
    const kind = header[0];
    const trainerClass = header[1];
    const count = header[3];
    const recordSize = PARTY_SIZE[kind];
    if (recordSize === undefined || count > 6 || party.length < count * recordSize) throw new Error(`Trainer ${trainerId} party layout is invalid`);

    const members = [];
    for (let slot = 0; slot < count; slot += 1) {
      const offset = slot * recordSize;
      const difficulty = party[offset];
      const override = party[offset + 1];
      const level = party.readUInt16LE(offset + 2);
      const packedSpecies = party.readUInt16LE(offset + 4);
      const species = packedSpecies & 0x03ff;
      const form = packedSpecies >> 10;
      let ability;
      try {
        ability = trainerAbility(difficulty, override, species, form, personal);
      } catch (error) {
        throw trainerAbilityContext(error, trainerId, kind, slot, offset);
      }
      members.push({ slot, species_id: species, form, level, ...ability });
    }
    if (members.length) trainers.push({ trainer_id: trainerId, trainer_class_id: trainerClass, members });
  }

  return {
    schema: 'ultimate-gold-trainer-abilities/v1',
    target_sha256: targetSha,
    evidence: {
      resolution_status: 'derived_from_exact_target_records_with_upstream_engine_reference',
      target_runtime_attestation: 'not_performed',
      engine_reference: {
        repository_commit: '6988158691eb6178cff697cda0428045ddcba5fb',
        trainer_data_c_sha256: 'bf9e8cb41dac9b05f3c925dba5d2ec10954955524cc08505c3667cbeabac6be0',
        trainer_data_h_sha256: '39dcf72c6531a2f9f340ed8ef0e868bdd2c64a59b096d69313ff6da22fcce45d',
        pokemon_c_sha256: 'd485ada6131981327c19c651fac9734d685a582f273bc990657901614f3e39e5',
      },
      trainer_headers: { path: 'a/0/5/5', sha256: digest(headerNarc) },
      trainer_parties: { path: 'a/0/5/6', sha256: digest(partyNarc) },
      personal_data: { path: 'a/0/0/2', sha256: digest(personalNarc), record_size: 44, ability_offsets: [22, 23], gender_ratio_offset: 16 },
      ability_rule: 'The trainer record stores a gender/ability override byte. HGSS CreateNPCTrainerParty builds PID low byte from that field; CreateBoxMon selects ability by PID bit 0 and falls back to ability 1 when ability 2 is absent. It sets the trainer Pokemon form after CreateMon, so initial ability selection uses the base species record, while gender override uses the resolved form record.',
      iv_rule: 'Trainer difficulty maps to six equal IVs using floor(difficulty * 31 / 255). Trainer records contain no EV spread; standard creation starts with zero EVs.',
      pid_note: 'The high PID bits are generated from difficulty, level, base species, trainer ID and trainer class, but PID bit 0 comes from the deterministic gender/ability byte. For the same trainer record, the ability slot is stable across encounters.',
    },
    trainers,
  };
}

function reconstruct(source, manifest) {
  const patchPath = path.join(GAME_ROOT, 'patches', manifest.delta.file);
  const patch = fs.readFileSync(patchPath);
  if (digest(patch) !== manifest.delta.sha256) throw new Error('Alpha 2 delta SHA-256 mismatch');
  const BinFile = require(path.join(GAME_ROOT, 'web/vendor/rompatcher/BinFile.js'));
  const VCDIFF = require(path.join(GAME_ROOT, 'web/vendor/rompatcher/vcdiff.js'));
  const originalInfo = console.info;
  console.info = () => {};
  try {
    const result = new VCDIFF(new BinFile(patch)).apply(new BinFile(source), false)._u8array;
    return Buffer.from(result.buffer, result.byteOffset, result.byteLength);
  } finally {
    console.info = originalInfo;
  }
}

function writeOutputExclusive(outputPath, contents) {
  fs.writeFileSync(path.resolve(outputPath), contents, { encoding: 'utf8', flag: 'wx' });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const source = fs.readFileSync(path.resolve(args.source));
  if (digest(source) !== SOURCE_SHA256) throw new Error('Clean HeartGold USA source hash mismatch; refusing to apply the delta');
  const manifest = JSON.parse(fs.readFileSync(path.join(GAME_ROOT, 'patches/manifest-alpha2.json'), 'utf8'));
  const target = reconstruct(source, manifest);
  const { narcRecords } = require(path.join(GAME_ROOT, 'tools/extract_tmhm_compatibility.cjs'));
  const result = `${JSON.stringify(extract(target, manifest, narcRecords), null, 2)}\n`;
  if (args.output) writeOutputExclusive(args.output, result);
  else process.stdout.write(result);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

module.exports = { extract, resolveForm, trainerAbility, trainerAbilityContext, writeOutputExclusive };
