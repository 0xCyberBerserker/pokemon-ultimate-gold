const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { auditForms, buildCandidates, collectFormCandidates, decodeLearnset, parsePinnedWikiData } = require('../tools/audit_trainer_forms_moves.cjs');
const { resolveForm } = require('../tools/extract_trainer_abilities.cjs');

test('form resolver maps Wormadam and Rotom records and keeps Pinsir on base record', () => {
  assert.equal(resolveForm(127, 1), 127);
  assert.equal(resolveForm(413, 1), 499);
  assert.equal(resolveForm(413, 2), 500);
  assert.deepEqual([1, 2, 3, 4, 5].map((form) => resolveForm(479, form)), [503, 504, 505, 506, 507]);
});

test('learnset parser decodes level and move IDs until terminator', () => {
  const words = [(20 << 9) | 279, (47 << 9) | 442, 0xffff];
  const record = Buffer.alloc(words.length * 2);
  words.forEach((word, index) => record.writeUInt16LE(word, index * 2));
  assert.deepEqual(decodeLearnset(record), [
    { level: 20, move_id: 279 },
    { level: 47, move_id: 442 },
  ]);
});

test('learnset parser rejects a record without its terminator', () => {
  assert.throws(() => decodeLearnset(Buffer.from([1, 0])), /Unterminated learnset record/);
});

test('wiki data is hash-checked before parsing and rejects mutated bytes', () => {
  const bytes = fs.readFileSync(path.join(__dirname, '../docs/wiki-data.json'));
  assert.equal(parsePinnedWikiData(bytes).target_sha256, '24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6');
  const mutated = Buffer.from(bytes);
  mutated[mutated.length - 2] ^= 1;
  assert.throws(() => auditForms(Buffer.alloc(0), mutated, {}), /Wiki data SHA-256 mismatch/);
});

test('candidate builder requires a valid Plus level', () => {
  const input = {
    base: [{ level: 1, move_id: 10 }],
    formLearnset: [{ level: 1, move_id: 11 }],
    level: 5,
    plusLevel: 6,
    wikiMoves: {
      10: { id: 10, name: { en: 'Base', es: 'Base' } },
      11: { id: 11, name: { en: 'Form', es: 'Forma' } },
    },
  };
  for (const plusLevel of [undefined, 0, 101, 5.5, '6', 4]) {
    assert.throws(() => buildCandidates({ ...input, plusLevel }), /Invalid Plus level|Plus level is below normal level/);
  }
});

test('candidate builder rejects absent or malformed localized move records', () => {
  const base = [{ level: 1, move_id: 10 }];
  assert.throws(() => buildCandidates({
    base,
    formLearnset: base,
    level: 5,
    plusLevel: 6,
    wikiMoves: {},
  }), /Missing or malformed wiki move 10/);
  assert.throws(() => buildCandidates({
    base,
    formLearnset: base,
    level: 5,
    plusLevel: 6,
    wikiMoves: { 10: { id: 10, name: { en: 'Base', es: '' } } },
  }), /Missing or malformed wiki move 10/);
});

test('candidate audit supports synthetic base and mapped-form fixtures', () => {
  const wiki = {
    trainers: [{ id: 7, name: { en: 'Trainer', es: 'Entrenador' }, members: [{
      slot: 0,
      species_id: 413,
      form: 1,
      level: 5,
      item_id: 0,
      move_ids: [],
      move_resolution: 'alternate_form_pending',
      levels_by_mode: { plus: 6 },
    }] }],
    moves: {
      10: { id: 10, name: { en: 'Base Move', es: 'Movimiento base' } },
      11: { id: 11, name: { en: 'Form Move', es: 'Movimiento de forma' } },
    },
  };
  const learnsets = [];
  learnsets[413] = [{ level: 1, move_id: 10 }];
  learnsets[499] = [{ level: 1, move_id: 11 }];
  const result = collectFormCandidates([{ trainer_id: 7, slot: 0, species_id: 413, form: 1, level: 5, item_id: 0 }], learnsets, wiki);
  assert.deepEqual(result[0].candidates.base_normal.map((move) => move.id), [10]);
  assert.deepEqual(result[0].candidates.mapped_form_normal.map((move) => move.id), [11]);
});

test('synthetic candidate audit fails when a trainer lacks its Plus level', () => {
  const wiki = {
    trainers: [{ id: 1, name: { en: 'Trainer' }, members: [{ slot: 0, species_id: 413, form: 1,
      level: 5, item_id: 0, move_ids: [], move_resolution: 'alternate_form_pending', levels_by_mode: {} }] }],
    moves: { 10: { id: 10, name: { en: 'Move', es: 'Movimiento' } } },
  };
  const learnsets = [];
  learnsets[413] = [{ level: 1, move_id: 10 }];
  learnsets[499] = [{ level: 1, move_id: 10 }];
  assert.throws(() => collectFormCandidates([
    { trainer_id: 1, slot: 0, species_id: 413, form: 1, level: 5, item_id: 0 },
  ], learnsets, wiki), /Invalid Plus level/);
});
