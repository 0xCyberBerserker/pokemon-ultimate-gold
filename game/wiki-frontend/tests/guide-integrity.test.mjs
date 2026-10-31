import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseRoute } from '../src/data/routes.ts';

test('localized guide links and image evidence resolve in the source site', async () => {
  const web = resolve('../web');
  const data = JSON.parse(await readFile(resolve(web, 'data/wiki-data.json'), 'utf8'));
  let images = 0;
  let links = 0;
  for (const guide of Object.values(data.guides)) {
    for (const language of ['en', 'es']) {
      const html = guide.body[language];
      assert.ok(html, `Missing guide body: ${language}`);
      for (const [, href] of html.matchAll(/href=["'](#[^"']+)["']/g)) {
        const route = parseRoute(href);
        assert.notEqual(route.kind, 'not-found', href);
        if (route.kind === 'guide') assert.ok(data.guides[route.id], href);
        links++;
      }
      for (const [, src] of html.matchAll(/<img[^>]*src=["']([^"']+)["']/gi)) {
        assert.match(src, /^\.\.\/assets\//, src);
        const file = resolve(web, src.slice(3));
        assert.ok(file.startsWith(`${web}/assets/`), src);
        await access(file);
        images++;
      }
    }
  }
  assert.ok(links > 0 && images > 0, 'Expected guide links and image evidence');
});

test('local guide evidence links retain a reviewed list of missing source files', async () => {
  const web = resolve('../web');
  const data = JSON.parse(await readFile(resolve(web, 'data/wiki-data.json'), 'utf8'));
  const missing = new Set();
  for (const guide of Object.values(data.guides)) {
    for (const language of ['en', 'es']) {
      for (const [, href] of guide.body[language].matchAll(/href=["']([^"']+)["']/g)) {
        if (/^(#|https?:|mailto:)/.test(href)) continue;
        const target = new URL(href, 'https://wiki.invalid/wiki/');
        assert.equal(target.origin, 'https://wiki.invalid', href);
        const path = resolve(web, '.' + decodeURIComponent(target.pathname));
        assert.ok(path.startsWith(`${web}/`), href);
        try { await access(path); } catch { missing.add(href); }
      }
    }
  }
  assert.deepEqual([...missing].sort(), ['../data/acceptance.json', 'qa-alpha2-frontier-outcome-qa.html']);
});
