import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const readJson = (path) => readFile(new URL(path, import.meta.url)).then(JSON.parse);
const data = await readJson('../../web/data/wiki-data.json');
const alpha2 = await readJson('../../web/data/patch-manifest-alpha2.json');
const catalog = await readJson('../../web/data/patch-catalog.json');
const candidate = await readJson(`../../web/data/${catalog.versions[catalog.default].manifest.slice(2)}`);

test('machine view links per-species compatibility and keeps it target-specific', async () => {
  assert.equal(data.target_sha256, alpha2.target.sha256);
  assert.equal(data.tmhm_compatibility.target_sha256, data.target_sha256);
  assert.equal(candidate.target.sha256, 'fc0bf04ec57fa30121fdb50a4da3a94c300fc0abe171c96b3e60bc2e674baff4');

  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: Reference, MachineEntry } = await server.ssrLoadModule('/src/features/reference/Reference.tsx');
    const { filterMachinesForSearch } = await server.ssrLoadModule('/src/data/reference.ts');
    const expectedForBulbasaur = data.tmhm_compatibility.by_species['1'];
    assert.deepEqual(
      filterMachinesForSearch(data, 'en', 'Bulbasaur', '', '').map((machine) => machine.item_id),
      expectedForBulbasaur,
    );

    for (const language of ['en', 'es']) {
      const html = renderToStaticMarkup(React.createElement(Reference, { data, language, route: '#/machines' }));
      assert.equal((html.match(/class="panel machine-entry"/g) || []).length, 100);
      assert.match(html, language === 'en' ? /Compatible Pokémon \(/ : /Pokémon compatibles \(/);
      assert.match(html, language === 'en' ? /Wiki data: Alpha 2/ : /Datos de la wiki: Alfa 2/);
      assert.doesNotMatch(html, /[a-f0-9]{64}/);

      const firstMachine = data.tmhm[0];
      const firstCompatibleSpecies = data.species.filter((species) => data.tmhm_compatibility.by_species[String(species.id)]?.includes(firstMachine.item_id));
      const openEntry = renderToStaticMarkup(React.createElement(MachineEntry, {
        title: 'TM 1', href: `#/items/${firstMachine.item_id}`, machine: firstMachine,
        data, language, compatibleSpecies: firstCompatibleSpecies, initiallyOpen: true,
      }));
      for (const species of firstCompatibleSpecies) assert.match(openEntry, new RegExp(`href="#/pokemon/${species.id}"`));
    }

    const mismatched = {
      ...data,
      target_sha256: candidate.target.sha256,
    };
    assert.equal(filterMachinesForSearch(mismatched, 'en', 'Bulbasaur', '', '').length, 0);
    const mismatchHtml = renderToStaticMarkup(React.createElement(Reference, { data: mismatched, language: 'en', route: '#/machines' }));
    assert.match(mismatchHtml, /compatibility table is for Alpha 2; it is not used with Kris Sprint 2 data/);
    assert.equal((mismatchHtml.match(/class="panel machine-entry"/g) || []).length, 100);
    const missing = { ...data, tmhm_compatibility: undefined };
    assert.equal(filterMachinesForSearch(missing, 'en', 'Bulbasaur', '', '').length, 0);
    const missingHtml = renderToStaticMarkup(React.createElement(Reference, { data: missing, language: 'en', route: '#/machines' }));
    assert.match(missingHtml, /Per-Pokémon compatibility is unavailable for Alpha 2 data/);
  } finally {
    await server.close();
  }
});
