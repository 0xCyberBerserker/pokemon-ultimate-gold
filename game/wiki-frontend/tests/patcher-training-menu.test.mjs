import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

async function loadPatcher(defaultVersion) {
  const app = await readFile(process.env.PUG_PATCHER_APP || new URL('../../web/app.js', import.meta.url), 'utf8');
  const catalog = JSON.parse(await readFile(new URL('../../web/data/patch-catalog.json', import.meta.url), 'utf8'));
  const training = JSON.parse(await readFile(new URL('../../patches/manifest-training-menu.json', import.meta.url), 'utf8'));
  catalog.default = defaultVersion;
  catalog.versions['training-menu'] = { manifest: './patch-manifest-training-menu.json', label: { en: 'Training', es: 'Entrenamiento' }, note: { en: 'Experimental', es: 'Experimental' } };
  const files = { 'patch-catalog.json': catalog, 'patch-manifest-training-menu.json': training };
  for (const name of ['alpha1', 'alpha2', 'kris-sprint2']) files[`patch-manifest-${name}.json`] = JSON.parse(await readFile(new URL(`../../web/data/patch-manifest-${name}.json`, import.meta.url), 'utf8'));
  const nodes = new Map();
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, {
      value: '', hidden: id === 'download', options: [], events: {},
      addEventListener(name, callback) { this.events[name] = callback; },
      setAttribute() {}, removeAttribute() {}, replaceChildren(...options) { this.options = options; },
    });
    return nodes.get(id);
  }
  const win = { addEventListener() {} };
  const sandbox = {
    URL, URLSearchParams, console,
    location: { search: '?standalone=1', origin: 'https://wiki.test', hash: '' },
    document: { baseURI: 'https://wiki.test/', documentElement: { classList: { add() {} } }, getElementById: node, createElement: () => ({}) },
    localStorage: { getItem() { return null; }, setItem() {} },
    fetch: async (url) => ({ ok: true, json: async () => files[new URL(url).pathname.split('/').pop()] }),
    window: win,
  };
  win.parent = win;
  runInNewContext(app, sandbox);
  for (let attempt = 0; attempt < 10 && node('apply').disabled; attempt++) await new Promise((resolve) => setImmediate(resolve));
  return node;
}

test('training menu is selectable by default alongside the three existing builds', async () => {
  const node = await loadPatcher('training-menu');
  assert.equal(node('version').value, 'training-menu');
  assert.equal(node('apply').disabled, false);
  assert.deepEqual(Array.from(node('version').options, (option) => option.value), ['alpha1', 'alpha2', 'kris-sprint2', 'training-menu']);
});

test('an unknown default still fails closed', async () => {
  const node = await loadPatcher('not-a-build');
  assert.equal(node('apply').disabled, true);
  assert.equal(node('status').textContent, 'Build catalog could not be loaded.');
});
