import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { retroarchProfile } from '../src/data/cheats.ts';

const catalog = JSON.parse(await readFile(new URL('../../web/data/cheat-catalog.json', import.meta.url)));

test('cheat catalog puts guidance first, shows only recorded states, and leaves profile downloads available', async () => {
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: CheatCatalog } = await server.ssrLoadModule('/src/features/cheats/CheatCatalog.tsx');
    for (const language of ['en', 'es']) {
      const html = renderToStaticMarkup(React.createElement(CheatCatalog, { language, target: catalog.target_sha256, initialCatalog: catalog }));
      const guidancePosition = html.indexOf(language === 'es' ? 'Antes de usar un código' : 'Before using a code');
      const filterPosition = html.indexOf('class="filters"');
      assert.ok(guidancePosition >= 0 && guidancePosition < filterPosition);
      assert.ok(html.includes(language === 'es' ? 'Riesgos y límites' : 'Risks and limits'));
      assert.ok(html.includes(language === 'es' ? 'Estados registrados en el catálogo' : 'Recorded catalog states'));
      assert.ok(html.replace(/[,.]/g, '').includes('2104'));
      assert.match(html, /cheat-status-guard_mismatch[\s\S]*?6/);
      assert.doesNotMatch(html, /Syntax issue|Error de sintaxis|value="syntax_issue"/);
      assert.match(html, /<button>Download RetroArch profile<\/button>|<button>Descargar perfil RetroArch<\/button>/);
      assert.ok(html.includes(language === 'es' ? 'El perfil exportado incluye el código desactivado.' : 'An exported profile starts with its code disabled.'));
      assert.ok(html.includes(catalog.entries[0].code.split('\n')[0]));
      assert.ok(html.includes(catalog.target_sha256));
      assert.equal((html.match(/class="cheat-card"/g) || []).length, 24);
      assert.match(html, />1 \/ 88</);
    }
    const mismatch = renderToStaticMarkup(React.createElement(CheatCatalog, { language: 'en', target: 'wrong-target', initialCatalog: catalog }));
    assert.match(mismatch, /Catalog unavailable or target mismatch/);
    assert.doesNotMatch(mismatch, /class="cheat-card"/);
  } finally {
    await server.close();
  }
});

test('downloaded profile keeps the target pin and starts its code disabled', () => {
  const entry = catalog.entries.find((candidate) => candidate.id === '00-001');
  const profile = retroarchProfile(entry, 'en', catalog.target_sha256);
  assert.match(profile, /cheats = "1"/);
  assert.match(profile, /cheat0_enable = "false"/);
  assert.ok(profile.includes(`target_sha256: ${catalog.target_sha256}`));
  assert.ok(profile.includes(entry.code.split('\n').join('+')));
});
