#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const GAME_ROOT = path.resolve(__dirname, '..');
const BUILD_NAMES = ['alpha2', 'kris-sprint2'];
const MACHINE_RECORD = { offset: 28, bytes: 13, count: 100 };

const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function writeNewFile(file, content) {
  fs.writeFileSync(path.resolve(file), content, { encoding: 'utf8', flag: 'wx' });
}

function parseArgs(argv) {
  const args = { build: 'both', source: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--source') args.source = argv[++i];
    else if (argv[i] === '--build') args.build = argv[++i];
    else if (argv[i] === '--output') args.output = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.source) throw new Error('--source must point to the external clean HeartGold USA ROM');
  if (![...BUILD_NAMES, 'both'].includes(args.build)) throw new Error('--build must be alpha2, kris-sprint2, or both');
  return args;
}

function loadManifest(build) {
  const name = build === 'alpha2' ? 'alpha2' : 'kris-sprint2';
  const manifestPath = path.join(GAME_ROOT, 'patches', `manifest-${name}.json`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.source?.sha256 !== '65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105'
      || !/^[a-f0-9]{64}$/.test(manifest.target?.sha256 || '')
      || !manifest.delta?.file || !/^[a-f0-9]{64}$/.test(manifest.delta?.sha256 || '')) {
    throw new Error(`${build} manifest is incomplete or targets an unexpected clean source`);
  }
  return manifest;
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

function narcRecords(data) {
  if (data.toString('ascii', 0, 4) !== 'NARC') throw new Error('Personal data file is not NARC');
  let position = 16;
  if (data.toString('ascii', position, position + 4) !== 'BTAF') throw new Error('NARC is missing BTAF');
  const tableLength = data.readUInt32LE(position + 4);
  const count = data.readUInt16LE(position + 8);
  const ranges = [];
  for (let i = 0; i < count; i += 1) {
    const entry = position + 12 + i * 8;
    if (entry + 8 > data.length) throw new Error('NARC file allocation table is truncated');
    ranges.push([data.readUInt32LE(entry), data.readUInt32LE(entry + 4)]);
  }
  if (tableLength < 12 || position + tableLength > data.length) throw new Error('NARC file allocation table has an invalid size');
  position += tableLength;
  if (data.toString('ascii', position, position + 4) !== 'BTNF') throw new Error('NARC is missing BTNF');
  const nameTableLength = data.readUInt32LE(position + 4);
  if (nameTableLength < 8 || position + nameTableLength > data.length) throw new Error('NARC name table has an invalid size');
  position += nameTableLength;
  if (data.toString('ascii', position, position + 4) !== 'GMIF') throw new Error('NARC is missing GMIF');
  const memberBase = position + 8;
  return ranges.map(([start, end]) => {
    if (start > end || memberBase + end > data.length) throw new Error('NARC member is out of bounds');
    return data.subarray(memberBase + start, memberBase + end);
  });
}

function extractMachineCompatibility(records, machineItems, targetSha) {
  if (records.length !== 508 || records.slice(0, 494).some((record) => record.length !== 44)) {
    throw new Error('Personal NARC must contain 508 records and 44-byte National species records 1–493');
  }
  if (machineItems.length !== MACHINE_RECORD.count) throw new Error('Wiki data does not have 100 TM/HM entries');
  const orderedItems = machineItems.map((machine, index) => {
    const kind = index < 92 ? 'tm' : 'hm';
    const number = index < 92 ? index + 1 : index - 91;
    const itemId = 328 + index;
    if (machine.item_id !== itemId || machine.kind !== kind || machine.number !== number) {
      throw new Error(`TM/HM item order differs at index ${index}`);
    }
    return itemId;
  });

  const bySpecies = {};
  for (let speciesId = 1; speciesId <= 493; speciesId += 1) {
    const record = records[speciesId];
    const compatible = [];
    for (let index = 0; index < MACHINE_RECORD.count; index += 1) {
      const byte = record[MACHINE_RECORD.offset + Math.floor(index / 8)];
      if (byte & (1 << (index % 8))) compatible.push(orderedItems[index]);
    }
    if (record[MACHINE_RECORD.offset + 12] & 0xf0) throw new Error(`Reserved TM/HM bits are set for species ${speciesId}`);
    bySpecies[String(speciesId)] = compatible;
  }
  return { target_sha256: targetSha, by_species: bySpecies };
}

function extractArm9MachineMoves(data) {
  const arm9Offset = data.readUInt32LE(0x20);
  const arm9Size = data.readUInt32LE(0x2c);
  if (arm9Offset + arm9Size > data.length || arm9Size < 0x1000cc + 200) throw new Error('NDS ARM9 section is truncated');
  const arm9 = data.subarray(arm9Offset, arm9Offset + arm9Size);
  const moves = [];
  for (let index = 0; index < 100; index += 1) moves.push(arm9.readUInt16LE(0x1000cc + index * 2));
  return moves;
}

function extractTarget({ build, manifest, source, patch, VCDIFF, BinFile }) {
  const output = new VCDIFF(new BinFile(patch)).apply(new BinFile(source), false)._u8array;
  const targetSha = digest(output);
  if (targetSha !== manifest.target.sha256) throw new Error(`${build} reconstructed target hash mismatch: ${targetSha}`);

  const target = Buffer.from(output.buffer, output.byteOffset, output.byteLength);
  const personalNarc = ndsFile(target, 'a/0/0/2');
  const records = narcRecords(personalNarc);
  const wikiData = JSON.parse(fs.readFileSync(path.join(GAME_ROOT, 'web', 'data', 'wiki-data.json'), 'utf8'));
  if (wikiData.target_sha256 !== loadManifest('alpha2').target.sha256) throw new Error('Wiki machine table is not pinned to Alpha 2');
  const compatibility = extractMachineCompatibility(records, wikiData.tmhm, targetSha);
  const machineMoves = extractArm9MachineMoves(target);
  if (machineMoves.some((moveId, index) => moveId !== wikiData.tmhm[index]?.move_id)) {
    throw new Error(`${build} ARM9 TM/HM move table differs from the pinned wiki table`);
  }

  return {
    build,
    target_sha256: targetSha,
    delta_sha256: manifest.delta.sha256,
    personal_narc_sha256: digest(personalNarc),
    personal_record_count: records.length,
    machine_move_ids_sha256: digest(Buffer.from(machineMoves.flatMap((move) => [move & 0xff, move >> 8]))),
    machine_move_ids: machineMoves,
    compatibility,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const source = fs.readFileSync(path.resolve(args.source));
  const alpha2Manifest = loadManifest('alpha2');
  if (digest(source) !== alpha2Manifest.source.sha256) throw new Error('Clean source SHA-256 mismatch; refusing to apply deltas');

  const builds = args.build === 'both' ? BUILD_NAMES : [args.build];
  const targets = [];
  const manifests = new Map();
  for (const build of builds) {
    const manifest = loadManifest(build);
    manifests.set(build, manifest);
    const patchPath = path.join(GAME_ROOT, 'patches', manifest.delta.file);
    const patch = fs.readFileSync(patchPath);
    if (digest(patch) !== manifest.delta.sha256) throw new Error(`${build} delta SHA-256 mismatch; refusing to apply it`);
    targets.push({ build, manifest, patch });
  }

  const BinFile = require(path.join(GAME_ROOT, 'web', 'vendor', 'rompatcher', 'BinFile.js'));
  const VCDIFF = require(path.join(GAME_ROOT, 'web', 'vendor', 'rompatcher', 'vcdiff.js'));
  const originalInfo = console.info;
  console.info = (...values) => console.error(...values);
  let extracted;
  try {
    extracted = targets.map((entry) => extractTarget({ ...entry, source, VCDIFF, BinFile }));
  } finally {
    console.info = originalInfo;
  }

  let comparison;
  if (extracted.length === 2) {
    const [alpha2, candidate] = extracted;
    const sameCompatibility = JSON.stringify(alpha2.compatibility.by_species) === JSON.stringify(candidate.compatibility.by_species);
    const sameMoves = JSON.stringify(alpha2.machine_move_ids) === JSON.stringify(candidate.machine_move_ids);
    if (alpha2.personal_narc_sha256 !== candidate.personal_narc_sha256 || !sameMoves || !sameCompatibility) {
      throw new Error('Alpha 2 and Kris Sprint 2 TM/HM compatibility sources differ');
    }
    comparison = {
      targets: [alpha2.target_sha256, candidate.target_sha256],
      personal_narc_sha256: alpha2.personal_narc_sha256,
      personal_narc_equal: true,
      machine_move_count: alpha2.machine_move_ids.length,
      machine_move_ids_sha256: alpha2.machine_move_ids_sha256,
      machine_move_ids_equal: true,
      compatibility_equal: true,
    };
  }

  const result = {
    schema: 'ultimate-gold-tmhm-compatibility/v1',
    source_sha256: alpha2Manifest.source.sha256,
    personal_data: { path: 'a/0/0/2', record_size: 44, records: 508, compatibility_offset: MACHINE_RECORD.offset, compatibility_bytes: MACHINE_RECORD.bytes, bit_order: 'LSB0', index_order: 'TM01–TM92, HM01–HM08' },
    targets: Object.fromEntries(extracted.map(({ build, target_sha256, delta_sha256, personal_narc_sha256, machine_move_ids_sha256, compatibility }) => [build, {
      ...compatibility,
      delta_sha256,
      personal_narc_sha256,
      machine_move_ids_sha256,
    }])),
    ...(comparison ? { comparison } : {}),
  };
  const output = `${JSON.stringify(result, null, 2)}\n`;
  if (args.output) writeNewFile(args.output, output);
  else process.stdout.write(output);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

module.exports = { extractMachineCompatibility, narcRecords, writeNewFile };
