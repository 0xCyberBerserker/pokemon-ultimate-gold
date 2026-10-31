import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('selected team renders every available IV and EV without closed sections', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  const trainer = data.trainers.find((entry) => entry.id === 1);
  globalThis.location = { hash: '#/trainers/1' };
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: TrainerExplorer } = await server.ssrLoadModule('/src/features/trainers/TrainerExplorer.tsx');
    const html = renderToStaticMarkup(React.createElement(TrainerExplorer, { data, language: 'en', mode: 'plus' }));
    assert.equal((html.match(/<progress\b/g) || []).length, trainer.members.length * 12);
    assert.equal((html.match(/class="member-card"/g) || []).length, trainer.members.length);
    assert.doesNotMatch(html, /<button[^>]*style=/);
    for (const card of html.match(/<article class="member-card">[\s\S]*?<\/article>/g) || []) {
      assert.equal((card.slice(0, card.indexOf('<details')).match(/<progress\b/g) || []).length, 12);
    }
    assert.match(html, /IVs calculated from the trainer record/);
    assert.match(html, /standard native creation defaults/);
    assert.match(html, /Possible abilities/);
    assert.match(html, /href="#\/abilities\/\d+"/);
    assert.match(html, /aria-label="Team details"/);
    assert.match(html, /tabindex="-1"/);
    assert.match(html, /Lv\. 21/);
    const synthetic = structuredClone(data);
    synthetic.trainers.find((entry) => entry.id === 1).members[0].ivs = [1, 2, 3, 4, 5, 6];
    const ordered = renderToStaticMarkup(React.createElement(TrainerExplorer, { data: synthetic, language: 'es', mode: 'normal' }));
    assert.match(ordered, /IV At\. Esp\." max="31" value="5"/);
    assert.match(ordered, /IV Def\. Esp\." max="31" value="6"/);
    assert.match(ordered, /IV Velocidad" max="31" value="4"/);
    globalThis.location.hash = '#/trainers/229';
    const alternate = renderToStaticMarkup(React.createElement(TrainerExplorer, { data, language: 'es', mode: 'normal' }));
    assert.match(alternate, /Forma alternativa pendiente/);
    assert.match(alternate, /Código de forma registrado: 1/);
    assert.match(alternate, /corresponden a la especie base/);
    assert.doesNotMatch(alternate, /alternate_form_pending/);
  } finally {
    await server.close();
    delete globalThis.location;
  }
});
