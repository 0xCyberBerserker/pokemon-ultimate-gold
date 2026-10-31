import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

test('main text colors retain 4.5:1 contrast on primary surfaces', async () => {
  const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  for (const selector of [':root', ':root[data-theme="dark"]']) {
    const start = css.indexOf(`${selector} {`);
    assert.notEqual(start, -1);
    const block = css.slice(start, css.indexOf('}', start));
    const colors = Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((match) => [match[1], match[2]]));
    for (const foreground of ['text', 'muted']) for (const background of ['bg', 'surface', 'nav', 'gold-soft']) {
      assert.ok(colors[foreground] && colors[background], `${selector}: missing palette token`);
      const values = [luminance(colors[foreground]), luminance(colors[background])].sort((a, b) => a - b);
      const ratio = (values[1] + 0.05) / (values[0] + 0.05);
      assert.ok(ratio >= 4.5, `${selector} ${foreground} on ${background}: ${ratio.toFixed(2)}:1`);
    }
  }
});

test('each documented Pokémon type has a readable badge palette', async () => {
  const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const wiki = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url), 'utf8'));
  const palettes = new Map();
  for (const [, selectors, body] of css.matchAll(/((?:\.type-\d+\s*,?\s*)+)\{([^}]*)\}/g)) {
    const background = body.match(/background:\s*(#[0-9a-f]{6})/i)?.[1];
    const foreground = body.match(/(?:^|[;\s])color:\s*(#[0-9a-f]{6})/i)?.[1];
    for (const [, id] of selectors.matchAll(/\.type-(\d+)/g)) palettes.set(id, { background, foreground });
  }
  for (const id of Object.keys(wiki.types)) {
    const palette = palettes.get(id);
    assert.ok(palette?.background && palette.foreground, `Missing type palette: ${id}`);
    const values = [luminance(palette.background), luminance(palette.foreground)].sort((a, b) => a - b);
    assert.ok((values[1] + 0.05) / (values[0] + 0.05) >= 4.5, `Insufficient type contrast: ${id}`);
  }
});
