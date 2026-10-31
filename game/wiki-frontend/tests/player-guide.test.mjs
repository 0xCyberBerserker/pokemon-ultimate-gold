import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('player guide keeps the original content and exposes the essential steps in both languages', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: PlayerGuide } = await server.ssrLoadModule('/src/features/reference/PlayerGuide.tsx');
    for (const language of ['en', 'es']) {
      const html = renderToStaticMarkup(React.createElement(PlayerGuide, { data, language }));
      assert.equal((html.match(/class="panel"/g) || []).length, 5);
      for (const route of ['#/guide/web-patcher', '#/patcher', '#/guide/faq', '#/trainers', '#/cheats']) assert.ok(html.includes(route));
      assert.ok(html.includes(data.guides.player.title[language]));
      assert.ok(html.includes('<details class="panel guide-html">'));
      assert.ok(html.includes(language === 'es' ? 'Guía completa e información adicional' : 'Complete guide and additional information'));
    }
  } finally {
    await server.close();
  }
});

test('player guide route uses the dedicated guide view', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: Reference } = await server.ssrLoadModule('/src/features/reference/Reference.tsx');
    const html = renderToStaticMarkup(React.createElement(Reference, { data, language: 'en', route: '#/guide/player' }));
    assert.ok(html.includes('class="player-guide"'));
    assert.ok(html.includes('Five steps to prepare the game'));
    assert.ok(html.includes('Complete guide and additional information'));
  } finally {
    await server.close();
  }
});
