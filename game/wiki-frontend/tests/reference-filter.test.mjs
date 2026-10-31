import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { filterMoves, filterItems, filterMachines, filterMachinesForSearch, filterLearnset } from '../src/data/reference.ts';

const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));

test('move filters combine localized name, type and category', () => {
  const results = filterMoves(data, 'es', 'voz cautivadora', '9', '1');
  assert.deepEqual(results.map(([id]) => id), ['27']);
  assert.equal(filterMoves(data, 'es', 'voz cautivadora', '9', '0').length, 0);
  assert.ok(filterMoves(data, 'es', 'doble bofeton', '', '').some(([id]) => id === '3'));
});

test('species learnset search preserves real levels and accepts both languages', () => {
  const bulbasaur = data.species.find((entry) => entry.id === 1);
  assert.deepEqual(filterLearnset(bulbasaur, data.moves, 'placaje'), [{ level: 1, move_id: 33 }]);
  assert.deepEqual(filterLearnset(bulbasaur, data.moves, 'tackle'), [{ level: 1, move_id: 33 }]);
});

test('item and machine filters search documented acquisition and category', () => {
  const items = filterItems(data, 'es', 'Ciudad Trigal', 'pocket-2');
  assert.ok(items.some(([id]) => id === '2'));
  assert.equal(filterItems(data, 'es', 'Ciudad Trigal', 'hm').some(([id]) => id === '2'), false);
  const tms = filterMachines(data, 'en', 'Focus Punch', 'tm', '1');
  assert.ok(tms.some((entry) => entry.number === 1));
  assert.equal(filterMachines(data, 'en', 'Focus Punch', 'hm', '1').length, 0);
  assert.ok(filterItems(data, 'es', 'antidoto', '').some(([id]) => id === '18'));
});

test('machine search retains move matches even when a Pokémon name contains the query', () => {
  const results = filterMachinesForSearch(data, 'en', 'cut', '', '');
  assert.ok(results.some((entry) => entry.kind === 'hm' && entry.number === 1));
  assert.equal(results[0].kind, 'hm');
  assert.equal(results[0].number, 1);
});
