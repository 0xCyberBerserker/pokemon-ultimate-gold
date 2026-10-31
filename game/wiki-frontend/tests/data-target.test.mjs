import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadWiki } from '../src/data/wiki.ts';

test('wiki data remains pinned to its verified build when the patch default changes', async () => {
  const original = globalThis.fetch;
  let manifestHash = 'alpha2';
  const catalog = { default: 'kris-sprint2', wiki_data: 'alpha2', versions: {
    alpha2: { manifest: './patch-manifest-alpha2.json', label: { en: 'Alpha 2', es: 'Alfa 2' } },
    'kris-sprint2': { manifest: './patch-manifest-kris-sprint2.json', label: { en: 'Kris', es: 'Kris' } },
  } };
  globalThis.fetch = async (url) => ({ ok: true, json: async () => url.includes('wiki-data') ? { species: [], trainers: [], target_sha256: 'alpha2' } : url.includes('patch-catalog') ? catalog : { target: { sha256: url.includes('alpha2') ? manifestHash : 'kris' }, source: { sha256: 'a'.repeat(64), size: 128 } } });
  try {
    const result = await loadWiki(new AbortController().signal);
    assert.equal(result.version.en, 'Alpha 2');
    assert.equal(result.patchVersion.en, 'Kris');
    assert.equal(result.data.target_sha256, 'alpha2');
    catalog.wiki_data = 'kris-sprint2';
    await assert.rejects(() => loadWiki(new AbortController().signal), /target mismatch/);
    catalog.wiki_data = 'alpha2';
    manifestHash = 'different';
    await assert.rejects(() => loadWiki(new AbortController().signal), /target mismatch/);
  } finally { globalThis.fetch = original; }
});

test('catalog cannot direct either manifest request outside the local data directory', async () => {
  const original = globalThis.fetch;
  const requests = [];
  const good = { manifest: './patch-manifest-alpha2.json', label: { en: 'Alpha 2', es: 'Alfa 2' } };
  const bad = { manifest: 'https://outside.invalid/manifest.json', label: { en: 'Bad', es: 'Malo' } };
  let catalog = { default: 'bad', wiki_data: 'good', versions: { bad, good } };
  globalThis.fetch = async (url) => {
    requests.push(url);
    return { ok: true, json: async () => url.includes('wiki-data') ? { species: [], trainers: [], target_sha256: 'correct' } : catalog };
  };
  try {
    await assert.rejects(() => loadWiki(new AbortController().signal), /Invalid patch catalog/);
    catalog = { default: 'good', wiki_data: 'bad', versions: { bad, good } };
    await assert.rejects(() => loadWiki(new AbortController().signal), /Invalid patch catalog/);
    assert.ok(requests.every((url) => !url.includes('outside.invalid')));
  } finally { globalThis.fetch = original; }
});
