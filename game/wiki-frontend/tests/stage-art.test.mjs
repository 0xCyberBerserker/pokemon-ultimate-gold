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
