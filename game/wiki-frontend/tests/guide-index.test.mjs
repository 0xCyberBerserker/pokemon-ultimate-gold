import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('guide index preserves all documents, separates audiences, and accepts the existing filter', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  const entries = Object.entries(data.guides).map(([id, guide]) => ({ id, title: guide.title.en, description: '', href: `#/guide/${id}` }));
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: GuideIndex } = await server.ssrLoadModule('/src/features/reference/GuideIndex.tsx');
    const { default: Reference } = await server.ssrLoadModule('/src/features/reference/Reference.tsx');
    for (const language of ['en', 'es']) {
      const html = renderToStaticMarkup(React.createElement(GuideIndex, { entries, language }));
      assert.equal((html.match(/href="#\/guide\//g) || []).length, 87);
      assert.ok(html.includes(language === 'es' ? 'Empieza aquí' : 'Start here'));
      assert.ok(html.includes(language === 'es' ? 'Documentación técnica' : 'Technical documentation'));
      assert.ok(html.includes(language === 'es' ? 'Para empezar' : 'Start here'));
      for (const id of Object.keys(data.guides)) assert.equal((html.match(new RegExp(`href="#/guide/${id}"`, 'g')) || []).length, 1, id);
    }
    const filtered = renderToStaticMarkup(React.createElement(GuideIndex, { entries, language: 'en', filter: (entry) => entry.id === 'player' }));
    assert.equal((filtered.match(/href="#\/guide\//g) || []).length, 1);
    assert.match(filtered, /href="#\/guide\/player"/);
    assert.doesNotMatch(filtered, /Technical documentation/);
    const { classifyGuide } = await server.ssrLoadModule('/src/data/guide-groups.ts');
    assert.equal(classifyGuide('future-unclassified-document').audience, 'technical');

    const integratedIndex = renderToStaticMarkup(React.createElement(Reference, { data, language: 'en', route: '#/guides' }));
    assert.equal((integratedIndex.match(/href="#\/guide\//g) || []).length, Object.keys(data.guides).length);
    assert.match(integratedIndex, /Start here/);
    assert.match(integratedIndex, /Technical documentation/);
    assert.match(integratedIndex, /Search/);
    assert.match(integratedIndex, new RegExp(`<span class="count">${Object.keys(data.guides).length}<\/span>`));
  } finally {
    await server.close();
  }
});
