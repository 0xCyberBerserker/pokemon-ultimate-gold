import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { filterCheats, retroarchProfile, validateCheatCatalog } from '../src/data/cheats.ts';

const data = JSON.parse(await readFile(new URL('../../web/data/cheat-catalog.json', import.meta.url)));

test('catalog target must match and filtered entries retain original code', () => {
  assert.equal(data.entries.length, 2110);
  assert.equal(validateCheatCatalog(data, data.target_sha256), true);
  assert.equal(validateCheatCatalog(data, 'different'), false);
  assert.equal(validateCheatCatalog({ target_sha256: data.target_sha256, entries: [] }, data.target_sha256), false);
  const result = filterCheats(data.entries, { query: '00-001', category: '', folder: '', status: '' });
  assert.equal(result.length, 1);
  assert.equal(result[0].code, data.entries.find((entry) => entry.id === '00-001').code);
  assert.equal(filterCheats(data.entries, { query: '00-001', category: 'not-a-category', folder: '', status: '' }).length, 0);
});

test('exported RetroArch profiles are disabled and pinned to the catalog target', () => {
  const entry = data.entries.find((candidate) => candidate.id === '00-001');
  const profile = retroarchProfile(entry, 'es', data.target_sha256);
  assert.match(profile, /cheat0_enable = "false"/);
  assert.ok(profile.includes(data.target_sha256));
  assert.ok(profile.includes(entry.code.split('\n').join('+')));
  assert.ok(profile.includes(JSON.stringify(entry.title.es)));
});
