const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const GAME_ROOT = path.resolve(__dirname, '..');
const EXTRACTOR = path.join(GAME_ROOT, 'tools/extract_typechart.cjs');

test('type names use the 18-type Gen IV ID order', () => {
  const { TYPES } = require(EXTRACTOR);
  assert.equal(TYPES.length, 18);
  assert.equal(TYPES[9], 'fairy');
  assert.equal(TYPES[17], 'dark');
});

test('comparison reports only differing pairs', () => {
  const { compare, TYPES } = require(EXTRACTOR);
  const actual = new Map([['7,17', 10], ['7,16', 5]]);
  const expected = new Map([['7,17', 5], ['7,16', 10]]);
  assert.deepEqual(compare(actual, expected), [
    { attack: TYPES[7], defend: TYPES[17], actual: 10, reference: 5 },
    { attack: TYPES[7], defend: TYPES[16], actual: 5, reference: 10 },
  ]);
});

test('retains FE triples and later pairs, including duplicates, in source order', () => {
  const { duplicatePairs, parseChartRecords } = require(EXTRACTOR);
  const records = parseChartRecords(Buffer.from([
    0, 7, 10,
    0xfe, 0xfe, 0,
    1, 7, 20,
    0, 7, 5,
    0xff, 0xff, 0xff,
  ]), 0);
  assert.deepEqual(records.map(({ index, kind, bytes }) => ({ index, kind, bytes })), [
    { index: 0, kind: 'pair', bytes: [0, 7, 10] },
    { index: 1, kind: 'unclassified', bytes: [0xfe, 0xfe, 0] },
    { index: 2, kind: 'pair', bytes: [1, 7, 20] },
    { index: 3, kind: 'pair', bytes: [0, 7, 5] },
  ]);
  assert.deepEqual(duplicatePairs(records), [{ index: 3, attack: 0, defend: 7 }]);
});

test('reconstructs and compares both exact ROM targets in memory', {
  skip: !process.env.TYPECHART_SOURCE_ROM || !process.env.TYPECHART_REFERENCE,
}, () => {
  const result = spawnSync(process.execPath, [EXTRACTOR, '--source', process.env.TYPECHART_SOURCE_ROM, '--reference', process.env.TYPECHART_REFERENCE], {
    cwd: GAME_ROOT,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  assert.equal(report.validation, 'STATIC_ROM_DATA');
  assert.equal(report.ordinary_battle_semantics, 'NOT_VERIFIED');
  assert.equal(report.comparison.alpha2_equals_kris_sprint2, true);
  for (const build of ['alpha2', 'kris-sprint2']) {
    assert.equal(report.targets[build].pairs.length, 324);
    assert.deepEqual(report.targets[build].special_records.map(({ bytes }) => bytes), [[0xfe, 0xfe, 0]]);
    assert.deepEqual(report.targets[build].duplicate_pairs, []);
    assert.deepEqual(report.targets[build].reference_differences, []);
  }
});
