import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { memberForMode } from '../src/data/team.ts';

test('mode-specific team data preserves the generated values', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  const member = data.trainers.find((trainer) => trainer.id === 1).members[2];
  const normal = memberForMode(member, 'normal');
  const plus = memberForMode(member, 'plus');
  assert.equal(normal.level, 19);
  assert.equal(plus.level, 21);
  assert.deepEqual(normal.moveIds, member.move_ids_by_mode.normal);
  assert.deepEqual(plus.moveIds, member.move_ids_by_mode.plus);
  assert.deepEqual(normal.ivs, member.ivs);
  assert.deepEqual(plus.evs, member.evs);
  assert.equal(normal.ivs.length, 6);
  assert.equal(normal.evs.length, 6);
});

test('missing spreads remain unavailable rather than becoming zeroes', () => {
  const result = memberForMode({ level: 5, move_ids: [] }, 'normal');
  assert.equal(result.ivs, undefined);
  assert.equal(result.evs, undefined);
});
