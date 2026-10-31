import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the responsive picture does not add a flex item to the illustrated banner', async () => {
  const css = await readFile(new URL('../src/redesign.css', import.meta.url), 'utf8');
  assert.match(css, /\.journey-hero\.has-art\s*>\s*picture\s*\{[^}]*display:\s*contents\s*;/);
});
