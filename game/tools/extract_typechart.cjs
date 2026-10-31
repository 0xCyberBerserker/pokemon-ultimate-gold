#!/usr/bin/env node
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const GAME_ROOT = path.resolve(__dirname, '..');
const SOURCE_SHA256 = '65f02a56842b75aa92d775d56d657a56fe3fa993550b04dc20704ab82d760105';
const TYPES = 'normal fighting flying poison ground rock bug ghost steel fairy fire water grass electric psychic ice dragon dark'.split(' ');
const BUILDS = {
  alpha2: {
    target: '24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6',
    delta: '1c7ba7258893cbcdb54748b28038c240b509e5e613a7b61a0be462eae3c9f045',
  },
  'kris-sprint2': {
    target: 'fc0bf04ec57fa30121fdb50a4da3a94c300fc0abe171c96b3e60bc2e674baff4',
    delta: '8b99a32c572469985158690ee00251d842e43f1fdb4cb69777e3c6ccd1aa3f99',
  },
};
const REFERENCE_SHA256 = '7b0eae126bdcf98edfd71cbe75af00b763f5f0d5db36024b6f3e7c5e4aea95ac';

const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function blz(data) {
  if (data.length < 8) throw new Error('BLZ payload is truncated');
  const word = data.readUInt32LE(data.length - 8);
  const extra = data.readUInt32LE(data.length - 4);
  const header = word >>> 24;
  const encoded = word & 0xffffff;
  if (header < 8 || header > encoded || encoded > data.length || extra === 0 || extra >= 0x400000) {
    throw new Error('Invalid BLZ header');
  }
  let src = data.length - header;
  const stop = data.length - encoded;
  let dst = data.length + extra;
  const output = Buffer.alloc(dst);
  data.copy(output);
  while (src > stop) {
    const flags = output[--src];
    let bits = flags;
    for (let i = 0; i < 8 && src > stop; i += 1) {
      if (bits & 0x80) {
        const first = output[--src];
        const second = output[--src];
        const distance = ((first & 0x0f) << 8 | second) + 3;
        const length = (first >>> 4) + 3;
        for (let j = 0; j < length; j += 1) output[--dst] = output[dst + distance];
      } else {
        output[--dst] = output[--src];
      }
      bits = (bits << 1) & 0xff;
    }
  }
  if (dst !== stop) throw new Error('Invalid BLZ payload length');
  return output;
}

function overlay(rom, overlayId) {
  if (rom.length < 0x54) throw new Error('NDS header is truncated');
  const tableOffset = rom.readUInt32LE(0x50);
  const row = tableOffset + overlayId * 32;
  if (row + 32 > rom.length) throw new Error(`Overlay ${overlayId} table row is out of bounds`);
  if (rom.readUInt32LE(row) !== overlayId) throw new Error(`Overlay table ID mismatch for ${overlayId}`);
  const ramAddress = rom.readUInt32LE(row + 4);
  const ramSize = rom.readUInt32LE(row + 8);
  const fileId = rom.readUInt32LE(row + 24);
  const flags = rom.readUInt32LE(row + 28);
  const fatOffset = rom.readUInt32LE(0x48);
  const fatRow = fatOffset + fileId * 8;
  if (fatRow + 8 > rom.length) throw new Error(`Overlay ${overlayId} FAT entry is out of bounds`);
  const start = rom.readUInt32LE(fatRow);
  const end = rom.readUInt32LE(fatRow + 4);
  if (start > end || end > rom.length) throw new Error(`Overlay ${overlayId} data is out of bounds`);
  const payload = rom.subarray(start, end);
  const compressedSize = flags & 0xffffff;
  const data = flags & 0x01000000 ? blz(payload.subarray(0, compressedSize)) : payload;
  if (data.length !== ramSize) throw new Error(`Overlay ${overlayId} decoded size mismatch`);
  return { ramAddress, data };
}

function parseChartRecords(data, offset, typeCount = TYPES.length) {
  if (!Buffer.isBuffer(data) || !Number.isInteger(offset) || offset < 0 || offset >= data.length) {
    throw new Error('Type-chart data offset is invalid');
  }
  const records = [];
  let terminated = false;
  for (let position = offset; position + 2 < data.length; position += 3) {
    const attack = data[position];
    const defend = data[position + 1];
    const multiplier = data[position + 2];
    if (attack === 0xff) {
      terminated = true;
      break;
    }
    records.push({
      index: records.length,
      kind: attack < typeCount && defend < typeCount ? 'pair' : 'unclassified',
      bytes: [attack, defend, multiplier],
      ...(attack < typeCount && defend < typeCount ? { attack, defend, multiplier } : {}),
    });
  }
  if (!terminated) throw new Error('Type chart has no terminator');
  return records;
}

function duplicatePairs(records) {
  const seen = new Set();
  const duplicates = [];
  for (const record of records) {
    if (record.kind !== 'pair') continue;
    const key = `${record.attack},${record.defend}`;
    if (seen.has(key)) duplicates.push({ index: record.index, attack: record.attack, defend: record.defend });
    else seen.add(key);
  }
  return duplicates;
}

function extractPairs(target) {
  const battle = overlay(target, 12);
  const pointerAddress = 0x0225204c;
  const pointerOffset = pointerAddress - battle.ramAddress;
  if (pointerOffset < 0 || pointerOffset + 4 > battle.data.length) throw new Error('Type-chart pointer is outside overlay 12');
  const chartAddress = battle.data.readUInt32LE(pointerOffset);
  const chart = overlay(target, 18);
  const chartOffset = chartAddress - chart.ramAddress;
  if (chartOffset < 0 || chartOffset >= chart.data.length) throw new Error('Type chart pointer is outside overlay 18');
  const records = parseChartRecords(chart.data, chartOffset);
  const pairs = records.filter((record) => record.kind === 'pair');
  const duplicates = duplicatePairs(records);
  const uniqueCount = new Set(pairs.map(({ attack, defend }) => `${attack},${defend}`)).size;
  if (uniqueCount !== TYPES.length ** 2) throw new Error(`Expected 324 unique type pairs; found ${uniqueCount}`);
  return {
    chartAddress: `0x${chartAddress.toString(16)}`,
    records,
    pairs: pairs.map(({ attack, defend, multiplier, index }) => ({
      attack: TYPES[attack], defend: TYPES[defend], multiplier, attack_id: attack, defend_id: defend, index,
    })),
    special_records: records.filter((record) => record.kind !== 'pair'),
    duplicate_pairs: duplicates,
    overlay18Sha256: digest(chart.data),
  };
}

function parseReference(file) {
  const payload = fs.readFileSync(file);
  if (digest(payload) !== REFERENCE_SHA256) throw new Error('Reference typechart SHA-256 mismatch');
  const source = payload.toString('utf8');
  const expected = new Map();
  for (const entry of source.matchAll(/^\t([a-z]+): \{\n\s*damageTaken: \{([^}]+)\}/gm)) {
    const defend = TYPES.indexOf(entry[1]);
    if (defend < 0) continue;
    for (const match of entry[2].matchAll(/([A-Za-z]+):\s*([0123])/g)) {
      const attack = TYPES.indexOf(match[1].toLowerCase());
      if (attack >= 0) expected.set(`${attack},${defend}`, [10, 20, 5, 0][Number(match[2])]);
    }
  }
  if (expected.size !== TYPES.length ** 2) throw new Error(`Reference must define 324 pairs; found ${expected.size}`);
  return expected;
}

function compare(pairs, expected) {
  return [...expected].flatMap(([key, reference]) => {
    const actual = pairs.get(key);
    if (actual === reference) return [];
    const [attack, defend] = key.split(',').map(Number);
    return [{ attack: TYPES[attack], defend: TYPES[defend], actual, reference }];
  });
}

function reconstruct(source, patch, build, BinFile, VCDIFF) {
  const spec = BUILDS[build];
  if (!spec) throw new Error(`Unsupported build: ${build}`);
  if (digest(source) !== SOURCE_SHA256) throw new Error('Clean source SHA-256 mismatch');
  if (digest(patch) !== spec.delta) throw new Error(`${build} delta SHA-256 mismatch`);
  const originalInfo = console.info;
  let output;
  console.info = (...values) => console.error(...values);
  try {
    output = new VCDIFF(new BinFile(patch)).apply(new BinFile(source), false)._u8array;
  } finally {
    console.info = originalInfo;
  }
  const target = Buffer.from(output.buffer, output.byteOffset, output.byteLength);
  if (digest(target) !== spec.target) throw new Error(`${build} target SHA-256 mismatch`);
  return target;
}

function parseArgs(argv) {
  const args = { source: null, reference: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--source') args.source = argv[++i];
    else if (argv[i] === '--reference') args.reference = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.source) throw new Error('--source must point to the external clean HeartGold USA ROM');
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const source = fs.readFileSync(path.resolve(args.source));
  const BinFile = require(path.join(GAME_ROOT, 'web/vendor/rompatcher/BinFile.js'));
  const VCDIFF = require(path.join(GAME_ROOT, 'web/vendor/rompatcher/vcdiff.js'));
  const expected = args.reference ? parseReference(path.resolve(args.reference)) : null;
  const targets = {};
  for (const build of Object.keys(BUILDS)) {
    const spec = BUILDS[build];
    const manifest = JSON.parse(fs.readFileSync(path.join(GAME_ROOT, 'patches', `manifest-${build}.json`), 'utf8'));
    if (manifest.source?.sha256 !== SOURCE_SHA256 || manifest.target?.sha256 !== spec.target || manifest.delta?.sha256 !== spec.delta) {
      throw new Error(`${build} manifest disagrees with pinned hashes`);
    }
    const patch = fs.readFileSync(path.join(GAME_ROOT, 'patches', manifest.delta.file));
    const target = reconstruct(source, patch, build, BinFile, VCDIFF);
    const extracted = extractPairs(target);
    targets[build] = {
      target_sha256: digest(target),
      delta_sha256: digest(patch),
      chart_address: extracted.chartAddress,
      overlay18_sha256: extracted.overlay18Sha256,
      pairs: extracted.pairs,
      ordered_records: extracted.records,
      special_records: extracted.special_records,
      duplicate_pairs: extracted.duplicate_pairs,
      ...(expected && extracted.duplicate_pairs.length === 0
        ? { reference_differences: compare(new Map(extracted.pairs.map(({ attack_id, defend_id, multiplier }) => [`${attack_id},${defend_id}`, multiplier])), expected) }
        : { reference_differences: null }),
    };
  }
  const alphaRecords = targets.alpha2.ordered_records;
  const krisRecords = targets['kris-sprint2'].ordered_records;
  process.stdout.write(`${JSON.stringify({
    schema: 'ultimate-gold-typechart-audit/v1',
    validation: 'STATIC_ROM_DATA',
    ordinary_battle_semantics: 'NOT_VERIFIED',
    source_sha256: SOURCE_SHA256,
    reference_sha256: expected ? REFERENCE_SHA256 : null,
    comparison: { alpha2_equals_kris_sprint2: JSON.stringify(alphaRecords) === JSON.stringify(krisRecords) },
    targets,
  }, null, 2)}\n`);
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { blz, compare, duplicatePairs, extractPairs, parseChartRecords, parseReference, reconstruct, overlay, TYPES };
