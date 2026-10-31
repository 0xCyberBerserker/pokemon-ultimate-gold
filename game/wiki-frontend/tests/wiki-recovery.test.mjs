import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

test('wiki load retries after a failure and ignores an aborted response', async () => {
  const source = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
  assert.match(source, /setLoadAttempt\(\(attempt\) => attempt \+ 1\)/);
  assert.doesNotMatch(source, /window\.location\.reload\(\)/);

  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { startWikiLoadAttempt } = await server.ssrLoadModule('/src/App.tsx');
    const { strings } = await server.ssrLoadModule('/src/i18n.ts');
    assert.match(strings.en.error, /try again/i);
    assert.match(strings.es.error, /vuelve a intentarlo/i);
    assert.doesNotMatch(strings.en.error, /reload/i);
    assert.doesNotMatch(strings.es.error, /vuelve a cargar/i);
    const successes = [];
    let failures = 0;
    let calls = 0;
    const load = async () => {
      calls += 1;
      if (calls === 1) throw new Error('temporary network failure');
      if (calls === 2) return 'wiki data';
      return new Promise((resolve) => { resolveStale = resolve; });
    };
    let resolveStale;

    const failedAttempt = new AbortController();
    startWikiLoadAttempt(failedAttempt.signal, load, (value) => successes.push(value), () => { failures += 1; });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(failures, 1);

    const retry = new AbortController();
    startWikiLoadAttempt(retry.signal, load, (value) => successes.push(value), () => { failures += 1; });
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(successes, ['wiki data']);

    const superseded = new AbortController();
    startWikiLoadAttempt(superseded.signal, load, (value) => successes.push(value), () => { failures += 1; });
    superseded.abort();
    resolveStale('stale wiki data');
    await new Promise((resolve) => setImmediate(resolve));
    assert.deepEqual(successes, ['wiki data']);
    assert.equal(failures, 1);
  } finally {
    await server.close();
  }
});
