import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildSearchIndex, searchGroups } from '../src/data/search.ts';

const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));

test('search indexes real bilingual names and navigation targets', () => {
  const index = buildSearchIndex(data, 'es');
  assert.ok(searchGroups(index, 'clefairy').flatMap((group) => group.entries).some((entry) => entry.href === '#/pokemon/35'));
  assert.ok(searchGroups(index, 'disarm voice').flatMap((group) => group.entries).some((entry) => entry.href === '#/moves/27'));
  assert.ok(searchGroups(index, 'ruta 31').flatMap((group) => group.entries).some((entry) => entry.category === 'Ubicaciones'));
  assert.ok(searchGroups(index, 'espesura').flatMap((group) => group.entries).some((entry) => entry.href === '#/abilities/65'));
  assert.equal(index.filter((entry) => entry.category === 'Habilidades').length, Object.keys(data.abilities).length);
});

test('search keeps results grouped and does not let one group monopolize matches', () => {
  const index = [{ label: 'abc', category: 'one', href: '#/1', terms: 'abc' }, ...Array.from({ length: 10 }, (_, i) => ({ label: `abc ${i}`, category: 'one', href: `#/1/${i}`, terms: 'abc' })), { label: 'abc', category: 'two', href: '#/2', terms: 'abc' }];
  const groups = searchGroups(index, 'abc');
  assert.equal(groups[0].entries.length, 5);
  assert.equal(groups[1].entries.length, 1);
  const expanded = searchGroups(index, 'abc', 25);
  assert.equal(expanded[0].entries.length, 11);
  assert.equal(expanded[0].total, 11);
});
