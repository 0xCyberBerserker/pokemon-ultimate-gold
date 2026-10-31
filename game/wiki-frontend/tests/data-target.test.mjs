import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadWiki } from '../src/data/wiki.ts';

test('wiki data must match the default patch even if another catalog version matches', async () => {
  const original = globalThis.fetch;
  let manifestHash = 'correct';
  let defaultVersion = 'alpha2';
  globalThis.fetch = async (url) => ({ ok: true, json: async () => url.includes('wiki-data') ? { species: [], trainers: [], target_sha256: 'correct' } : url.includes('patch-catalog') ? { default: defaultVersion, versions: { alpha1: { manifest: './patch-manifest-alpha1.json', label: { en: 'Alpha 1', es: 'Alfa 1' } }, alpha2: { manifest: './patch-manifest-alpha2.json', label: { en: 'Alpha 2', es: 'Alfa 2' } } } } : { target: { sha256: url.includes('alpha2') ? manifestHash : 'previous' }, source: { sha256: 'a'.repeat(64), size: 128 } } });
  try {
    const result = await loadWiki(new AbortController().signal);
    assert.equal(result.version.en, 'Alpha 2');
    assert.equal(result.data.target_sha256, 'correct');
    defaultVersion = 'alpha1';
    await assert.rejects(() => loadWiki(new AbortController().signal), /target mismatch/);
    defaultVersion = 'alpha2';
    manifestHash = 'different';
    await assert.rejects(() => loadWiki(new AbortController().signal), /target mismatch/);
  } finally { globalThis.fetch = original; }
});

test('catalog cannot direct a manifest request outside the local data directory', async () => {
  const original = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url) => {
    requests.push(url);
    return { ok: true, json: async () => url.includes('wiki-data') ? { species: [], trainers: [], target_sha256: 'correct' } : { default: 'bad', versions: { bad: { manifest: 'https://outside.invalid/manifest.json', label: { en: 'Bad', es: 'Malo' } } } } };
  };
  try {
    await assert.rejects(() => loadWiki(new AbortController().signal), /Invalid patch catalog/);
    assert.equal(requests.length, 2);
    assert.ok(requests.every((url) => !url.includes('outside.invalid')));
  } finally { globalThis.fetch = original; }
});
