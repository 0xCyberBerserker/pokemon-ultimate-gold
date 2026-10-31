import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { stageIllustration } from '../src/features/trainers/stage-art.ts';

test('decorative illustrations are bound to their own documented stages', async () => {
  const journey = JSON.parse(await readFile(new URL('../../web/data/trainer-journey.json', import.meta.url)));
  const cases = [
    ['stage-01', 'Cherrygrove City', 'cherrygrove-city.png', '38dc8fcf71e931df9953dab85963d9bc0d732bccf174fa4edd8fba6d9576059f'],
    ['stage-02', 'Route 30', 'route-30.png', '0c0d9bca9a3346014dd0a19c3b3efe5daf5f5491cabd428576acaec2395c98fd'],
    ['stage-03', 'Route 31', 'route-31.png', 'a02ccb20c73d48845b90179c016d137544dd2b616a60e7e69767286ae14eb549'],
    ['stage-07', 'Route 32', 'route-32.png', '9a6080a93c2a7fc8421e001ac9a5c5173391bba7fc4dab5dc6f0ca64ecd11463'],
    ['stage-09', 'Route 33', 'route-33.png', '179c58c17659fb4374415c1291e11b639ec7860ac271d518a9d745fcf21ffaba'],
    ['stage-13', 'Route 34', 'route-34.png', 'f06afe6f354670055cd5f25e1173d2e159c072961da10e5cb4404cfac5c38033'],
    ['stage-17', 'Route 35', 'route-35.png', '7da0e49fb39bd47928d12c2aeae46777b7242b2ce877260cd1775f7d23d3a6a6'],
    ['stage-19', 'Route 36', 'route-36.png', 'b03a3d3023b1a50a2f278a2d51f04fb5706eb50b10c74436a5b2486f64f9bcf9'],
    ['stage-20', 'Route 37', 'route-37.png', '043f6641452e706550b0bece324510a9add443792d149887c1c3aabbcdb61b99'],
  ];
  for (const [id, name, file, hash] of cases) {
    assert.equal(journey.stages.find((stage) => stage.id === id)?.name.en, name);
    assert.equal(stageIllustration(id), `../assets/locations/${file}`);
    const image = await readFile(new URL(`../../web/assets/locations/${file}`, import.meta.url));
    assert.equal(createHash('sha256').update(image).digest('hex'), hash);
  }
  assert.equal(stageIllustration('stage-04'), undefined);
  assert.equal(stageIllustration('other'), undefined);
});

test('stage banners label art in both languages and leave other stages neutral', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  globalThis.location = { hash: '#/trainers' };
  try {
    const { default: TrainerExplorer } = await server.ssrLoadModule('/src/features/trainers/TrainerExplorer.tsx');
    for (const [stage, language, label, file] of [
      ['stage-01', 'es', 'Ilustración decorativa', 'cherrygrove-city.png'],
      ['stage-02', 'es', 'Ilustración decorativa', 'route-30.png'],
      ['stage-03', 'en', 'Decorative illustration', 'route-31.png'],
      ['stage-07', 'en', 'Decorative illustration', 'route-32.png'],
      ['stage-09', 'es', 'Ilustración decorativa', 'route-33.png'],
      ['stage-13', 'en', 'Decorative illustration', 'route-34.png'],
      ['stage-17', 'es', 'Ilustración decorativa', 'route-35.png'],
      ['stage-19', 'en', 'Decorative illustration', 'route-36.png'],
      ['stage-20', 'es', 'Ilustración decorativa', 'route-37.png'],
    ]) {
      globalThis.sessionStorage = { getItem: () => JSON.stringify({ stage }) };
      const html = renderToStaticMarkup(React.createElement(TrainerExplorer, { data, language, mode: 'normal' }));
      assert.ok(html.includes(label));
      assert.ok(html.includes(file));
      assert.match(html, /journey-hero has-art/);
    }
    globalThis.sessionStorage = { getItem: () => JSON.stringify({ stage: 'stage-04' }) };
    const html = renderToStaticMarkup(React.createElement(TrainerExplorer, { data, language: 'en', mode: 'normal' }));
    assert.doesNotMatch(html, /journey-hero has-art|Decorative illustration/);
  } finally {
    await server.close();
    delete globalThis.location;
    delete globalThis.sessionStorage;
  }
});
