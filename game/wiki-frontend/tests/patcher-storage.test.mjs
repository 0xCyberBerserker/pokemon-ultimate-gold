import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

test('patcher loads its catalog even when browser storage is blocked', async () => {
  const app = await readFile(new URL('../../web/app.js', import.meta.url), 'utf8');
  const files = {};
  for (const name of ['patch-catalog.json', 'patch-manifest-kris-sprint2.json']) {
    files[name] = JSON.parse(await readFile(new URL(`../../web/data/${name}`, import.meta.url), 'utf8'));
  }
  const nodes = new Map();
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, {
      value: '', hidden: id === 'download', options: [], events: {},
      addEventListener(name, callback) { this.events[name] = callback; },
      setAttribute() {}, removeAttribute() {},
      replaceChildren(...options) { this.options = options; },
    });
    return nodes.get(id);
  }
  const win = { addEventListener() {} };
  const sandbox = {
    URL, URLSearchParams, console,
    location: { search: '?standalone=1', origin: 'https://wiki.test', hash: '' },
    document: { baseURI: 'https://wiki.test/', documentElement: { classList: { add() {} } }, getElementById: node, createElement: () => ({}) },
    localStorage: { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('SecurityError'); } },
    fetch: async (url) => ({ ok: true, json: async () => files[new URL(url).pathname.split('/').pop()] }),
    window: win,
  };
  win.parent = win;
  runInNewContext(app, sandbox);
  for (let attempt = 0; attempt < 10 && node('apply').disabled; attempt++) await new Promise((resolve) => setImmediate(resolve));
  assert.equal(node('version').value, 'kris-sprint2');
  assert.equal(node('apply').disabled, false);
  node('language').value = 'es';
  assert.doesNotThrow(() => node('language').events.change());
  assert.equal(node('apply').textContent, 'Aplicar parche');
});
