import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));

test('mechanics page explains outcomes without assigning unverified Alpha 2 matchups', async () => {
  assert.equal(data.target_sha256, '24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6');
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: MechanicsPage } = await server.ssrLoadModule('/src/features/reference/MechanicsPage.tsx');
    const { default: Reference } = await server.ssrLoadModule('/src/features/reference/Reference.tsx');
    for (const language of ['en', 'es']) {
      const html = renderToStaticMarkup(React.createElement(MechanicsPage, { data, language }));
      const mainContent = html.split('<details class="panel mechanics-technical-report">')[0];
      assert.match(mainContent, language === 'en' ? /Alpha 2 matchup table is still pending verification/ : /tabla de cruces concreta de Alfa 2 aún está pendiente/);
      assert.match(mainContent, language === 'en' ? /Weak to the attack/ : /Débil ante el ataque/);
      assert.match(mainContent, language === 'en' ? /Resists the attack/ : /Resiste el ataque/);
      assert.match(mainContent, language === 'en' ? /Immunity/ : /Inmunidad/);
      assert.doesNotMatch(mainContent, /24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6|fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e/);
      assert.doesNotMatch(mainContent, /Ghost.*Dark|Fantasma.*Siniestro/i);
      assert.ok(html.includes(data.guides.mechanics.body[language]), 'full technical report should remain available verbatim');

      const mechanicsRoute = renderToStaticMarkup(React.createElement(Reference, { data, language, route: '#/mechanics' }));
      assert.match(mechanicsRoute, /class="mechanics-page"/);
      const technicalGuideRoute = renderToStaticMarkup(React.createElement(Reference, { data, language, route: '#/guide/mechanics' }));
      assert.doesNotMatch(technicalGuideRoute, /class="mechanics-page"/);
      assert.ok(technicalGuideRoute.includes(data.guides.mechanics.body[language]));
    }
  } finally {
    await server.close();
  }
});
