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
    ['stage-24', 'Route 38', 'route-38.png', '4238c63b302ed805c9b35d167cff54b356cc60a0d63e30c718a7c46fbd65a7e3'],
    ['stage-25', 'Route 39', 'route-39.png', 'fb3234d3e345160e4e652f76faee48a5a8879a0f6f3ecb4abf7207ef250e509a'],
    ['stage-28', 'Route 40', 'route-40.png', 'cc7e931e3932b8d3667984a1ffdbcd8994a6b2a439652f6b8d041054a38f30ac'],
    ['stage-29', 'Route 41', 'route-41.png', '998487867c757b96ecfe81b5b71e0202b7f8a3729c45e951015f5493badc23e0'],
    ['stage-37', 'Route 42', 'route-42.png', '7290eeb5879edb734da8f07330cbc8ad62a3d53060b7c679a44f0764130bc1a1'],
    ['stage-39', 'Route 43', 'route-43.png', '19de0517ddcf21858b89ab358cb69e727548b6ba05e4e41aa80db1aa730469a6'],
    ['stage-44', 'Route 44', 'route-44.png', '6abfc1a978c82b80da16f7abb176964be8cca29479b8dd5363866876a9ede3f5'],
    ['stage-45', 'Route 45', 'route-45.png', '836b96ce132a0671fc345fc7280b984b30a26aa93ed884a86aea7065b7600192'],
    ['stage-16', 'Route 46', 'route-46.png', '33d4e0d41ffac21d22f467a5ecdc497eec00e511cda5597492c7f809de742dfd'],
    ['stage-33', 'Route 47', 'route-47.png', 'aefc11e3b949081cd099b7db69511349f797bccd503e14bdb2004dd09fd3d61a'],
    ['stage-48', 'Route 27', 'route-27.png', 'cf8a817aa52822c2d3de4b270a397a74f9a5dbc03832f40de489ea01dc9a350f'],
    ['stage-49', 'Route 26', 'route-26.png', '9dab37d3d985c3a85d4ebb78bc2b95f28e67832cbe895b3304bbf16da1f318f0'],
    ['stage-55', 'Route 6', 'route-6.png', '899aba4ce43a223a9736dd9d27d7a5839959cf34d6652e390cb6b1acfd337d98'],
    ['stage-56', 'Route 2 ~ North', 'route-2.png', '509eb8461ba80710eb4944f804139db164de95ff3073992e7c511d593592d547'],
    ['stage-57', 'Route 3', 'route-3.png', 'fecf55b5731c1c2a8099bf1d055ed9753c174c15b9854f6f0ab323322591e164'],
    ['stage-60', 'Route 4', 'route-4.png', '0b7d06b84e52422acf2408a005913eb3ded9722bf340674c1cb321fc021f9970'],
    ['stage-61', 'Route 9', 'route-9.png', '24dba49c7fcaf52310c261bfc5dbd2de20d21fec61173bcfd739fe693f8d5765'],
    ['stage-62', 'Route 24', 'route-24.png', '23486e15757cc245eadef9bb0bec161d8b98cb92577ee38750d9bc874854e13b'],
    ['stage-63', 'Route 25', 'route-25.png', 'a8e496d92b915a7e3e349483029e13666ed17a6fc9d14e8c8eee76e2bca7d327'],
    ['stage-66', 'Route 10', 'route-10.png', '23e72deb07b22526d7fff591f2fb9780db4e714eaec342adbc2ca468adf9422b'],
    ['stage-67', 'Route 8', 'route-8.png', '681909f299e99899d2b4db503509f558e2d2a8890f711e5ad37b0b1e1d2fd9da'],
    ['stage-68', 'Route 11', 'route-11.png', '1ae9cf85ef88cccd4f6f84a3262068268aa6a4816f266b9bb7c6e0f1f0f0d3d2'],
    ['stage-69', 'Route 12', 'route-12.png', '3ae699104e4e2eb3261a59c944a83e75cff231707c52a7d6a1fbfa34c5019047'],
    ['stage-70', 'Route 13', 'route-13.png', 'a68ec862168d78e7974c5384dc5433103cfeaa9d083b06ff268043a31e33cd0e'],
    ['stage-71', 'Route 14', 'route-14.png', 'f03f067aa8f9bac2658d8ce26196b0aef156751b71eb0224cc4e6d54b408cc0c'],
    ['stage-72', 'Route 15', 'route-15.png', 'd159ff796640fd875439b18b81c611d567b5c879ecb878d5cb5a9003a306c508'],
    ['stage-75', 'Route 17', 'route-17.png', '3a5b84213256a7bb40130f39a141326e56d1b36a070bbbaf4dee2efa41e10e15'],
    ['stage-74', 'Route 18', 'route-18.png', '2030f53f4d98ebcb2fbe77d43ccd8f1136a677eec30fc801eceaad2592e7a471'],
    ['stage-78', 'Route 19', 'route-19.png', 'fa8a54024306698bdf9a8b70b856f538ab4bb9a1c851d2a0467128fbd66e66a1'],
    ['stage-79', 'Route 20 ~ East', 'route-20.png', '4f6cc496927a8d34db6a56dc6e0078f3a52fb232c6d5d5840acff7460d689b6b'],
    ['stage-81', 'Route 20 ~ West', 'route-20.png', '4f6cc496927a8d34db6a56dc6e0078f3a52fb232c6d5d5840acff7460d689b6b'],
    ['stage-83', 'Route 21', 'route-21.png', '39d8746219b1b62688561dcb594ce79a20c3fa632d241a7a76ce96fb6430b296'],
    ['stage-84', 'Route 1', 'route-1.png', '64f4ddcd65c7a4c207907439a3cec5aaeeeba7812a2fdf2bfc19d2b87176483b'],
    ['stage-85', 'Route 2 ~ South', 'route-2.png', '509eb8461ba80710eb4944f804139db164de95ff3073992e7c511d593592d547'],
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
      ['stage-24', 'en', 'Decorative illustration', 'route-38.png'],
      ['stage-25', 'es', 'Ilustración decorativa', 'route-39.png'],
      ['stage-28', 'en', 'Decorative illustration', 'route-40.png'],
      ['stage-29', 'es', 'Ilustración decorativa', 'route-41.png'],
      ['stage-37', 'en', 'Decorative illustration', 'route-42.png'],
      ['stage-39', 'es', 'Ilustración decorativa', 'route-43.png'],
      ['stage-44', 'en', 'Decorative illustration', 'route-44.png'],
      ['stage-45', 'es', 'Ilustración decorativa', 'route-45.png'],
      ['stage-16', 'en', 'Decorative illustration', 'route-46.png'],
      ['stage-33', 'es', 'Ilustración decorativa', 'route-47.png'],
      ['stage-48', 'en', 'Decorative illustration', 'route-27.png'],
      ['stage-49', 'es', 'Ilustración decorativa', 'route-26.png'],
      ['stage-55', 'en', 'Decorative illustration', 'route-6.png'],
      ['stage-56', 'es', 'Ilustración decorativa', 'route-2.png'],
      ['stage-57', 'en', 'Decorative illustration', 'route-3.png'],
      ['stage-60', 'es', 'Ilustración decorativa', 'route-4.png'],
      ['stage-61', 'en', 'Decorative illustration', 'route-9.png'],
      ['stage-62', 'es', 'Ilustración decorativa', 'route-24.png'],
      ['stage-63', 'en', 'Decorative illustration', 'route-25.png'],
      ['stage-66', 'es', 'Ilustración decorativa', 'route-10.png'],
      ['stage-67', 'en', 'Decorative illustration', 'route-8.png'],
      ['stage-68', 'es', 'Ilustración decorativa', 'route-11.png'],
      ['stage-69', 'en', 'Decorative illustration', 'route-12.png'],
      ['stage-70', 'es', 'Ilustración decorativa', 'route-13.png'],
      ['stage-71', 'en', 'Decorative illustration', 'route-14.png'],
      ['stage-72', 'es', 'Ilustración decorativa', 'route-15.png'],
      ['stage-75', 'en', 'Decorative illustration', 'route-17.png'],
      ['stage-74', 'es', 'Ilustración decorativa', 'route-18.png'],
      ['stage-78', 'en', 'Decorative illustration', 'route-19.png'],
      ['stage-79', 'es', 'Ilustración decorativa', 'route-20.png'],
      ['stage-81', 'en', 'Decorative illustration', 'route-20.png'],
      ['stage-83', 'es', 'Ilustración decorativa', 'route-21.png'],
      ['stage-84', 'en', 'Decorative illustration', 'route-1.png'],
      ['stage-85', 'en', 'Decorative illustration', 'route-2.png'],
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
