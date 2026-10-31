import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { once } from 'node:events';

test('built frontend and shared site resources resolve under a Pages project subdirectory', async () => {
  const web = resolve('../web');
  const dist = resolve('dist');
  const integrated = process.env.PUG_INTEGRATED === '1';
  const prefix = '/pokemon-ultimate-gold/';
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
    if (!pathname.startsWith(prefix)) { response.writeHead(404).end(); return; }
    const relative = decodeURIComponent(pathname.slice(prefix.length));
    const isFrontend = !integrated && (relative === 'wiki/' || relative.startsWith('wiki/assets/'));
    const root = isFrontend ? dist : web;
    const name = isFrontend && relative === 'wiki/' ? 'index.html' : isFrontend ? relative.slice('wiki/'.length) : relative === 'wiki/' ? 'wiki/index.html' : relative || 'index.html';
    const path = resolve(root, name);
    if (!path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    try {
      const body = await readFile(path);
      response.writeHead(200).end(body);
    } catch { response.writeHead(404).end(); }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}${prefix}`;
  async function get(url) {
    const response = await fetch(url);
    assert.equal(response.status, 200, url);
    return response;
  }
  try {
    const wikiUrl = new URL('wiki/', base);
    const html = await (await get(wikiUrl)).text();
    assert.equal(html, await readFile(resolve(dist, 'index.html'), 'utf8'), 'Served index must match the Vite build');
    assert.match(html, /Content-Security-Policy/);
    for (const [, path] of html.matchAll(/(?:src|href)="(\.\/assets\/[^"#]+)"/g)) await get(new URL(path, wikiUrl));
    const assets = await readdir(resolve(dist, 'assets'));
    assert.ok(assets.some((name) => name.endsWith('.js')) && assets.some((name) => name.endsWith('.css')));
    for (const name of assets) {
      const response = await get(new URL(`assets/${name}`, wikiUrl));
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(resolve(dist, 'assets', name)), `Asset mismatch: ${name}`);
    }
    for (const path of ['../sprites/pokemon/1.png', '../assets/branding/ultimate-gold-header.png', '../data/kris-gallery.json', '../cheat-catalog.js', '../?embed=1', '../app.js', '../LICENSES.html', '../style.css']) await get(new URL(path, wikiUrl));
    const legacy = await (await get(new URL('species-493.html', wikiUrl))).text();
    assert.match(legacy, /#\/pokemon/);
    const data = await (await get(new URL('../data/wiki-data.json', wikiUrl))).json();
    const catalog = await (await get(new URL('../data/patch-catalog.json', wikiUrl))).json();
    const manifest = await (await get(new URL(`../data/${catalog.versions[catalog.default].manifest.slice(2)}`, wikiUrl))).json();
    assert.equal(data.target_sha256, manifest.target.sha256);
  } finally {
    server.closeAllConnections();
    await new Promise((done) => server.close(done));
  }
});
