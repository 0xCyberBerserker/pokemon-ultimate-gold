const test = require('node:test');
const assert = require('node:assert/strict');
const { defaultMoves, explicitMoveModeIssues, parsePinnedLegacy } = require('../tools/audit_trainer_team_data.cjs');

test('learnset resolves ordered moves, skips duplicates, and retains only the latest four', () => {
  const learnset = [
    { level: 1, move_id: 10 }, { level: 2, move_id: 20 },
    { level: 3, move_id: 10 }, { level: 4, move_id: 30 },
    { level: 5, move_id: 40 }, { level: 6, move_id: 50 },
    { level: 9, move_id: 60 },
  ];
  assert.deepEqual(defaultMoves(learnset, 6), [20, 30, 40, 50]);
  assert.deepEqual(defaultMoves(learnset, 4), [10, 20, 30]);
});

test('empty and zero move records do not create move slots', () => {
  assert.deepEqual(defaultMoves([{ level: 1, move_id: 0 }, { level: 2, move_id: 9 }], 2), [9]);
  assert.deepEqual(defaultMoves([], 100), []);
});

test('explicit members require a Plus move array', () => {
  const modes = { normal: [12], plus: [12] };
  delete modes.plus;
  assert.deepEqual(explicitMoveModeIssues(modes, [12]), ['missing_explicit_plus_moves']);
});

test('legacy table hash is checked before parsing mutated bytes', () => {
  assert.throws(() => parsePinnedLegacy(Buffer.from('{"records":', 'utf8')), /Legacy trainer table SHA-256 mismatch/);
});
