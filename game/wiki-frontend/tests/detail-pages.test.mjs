import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));

test('ability and move details render localized target data and keep compatibility hash-gated', async () => {
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: AbilityDetail } = await server.ssrLoadModule('/src/features/reference/AbilityDetail.tsx');
    const { default: MoveDetail } = await server.ssrLoadModule('/src/features/reference/MoveDetail.tsx');
    const pressureId = Object.keys(data.abilities).find((id) => data.abilities[id].name.en === 'Pressure');
    const gustId = Object.keys(data.moves).find((id) => data.moves[id].name.en === 'Gust');
    const machineMoveId = String(data.tmhm[0].move_id);
    assert.ok(pressureId);
    assert.ok(gustId);
    assert.equal(data.tmhm_compatibility.target_sha256, data.target_sha256);

    for (const language of ['en', 'es']) {
      const ability = renderToStaticMarkup(React.createElement(AbilityDetail, { data, language, id: pressureId }));
      assert.match(ability, language === 'en' ? /Pressure/ : /Presión/);
      assert.match(ability, language === 'en' ? /Recorded description/ : /Efecto descrito/);
      assert.match(ability, language === 'en' ? /Standard slot/ : /Ranura estándar/);
      assert.match(ability, language === 'en' ? /Individual trainer Pokémon abilities/ : /habilidades individuales de Pokémon de entrenadores/);
      assert.match(ability, /src="\.\.\/sprites\/pokemon\/144\.png" alt="" loading="lazy"/);

      const move = renderToStaticMarkup(React.createElement(MoveDetail, { data, language, id: gustId }));
      assert.match(move, language === 'en' ? /Gust/ : /Tornado/);
      assert.match(move, language === 'en' ? /Reference description/ : /Descripción de referencia/);
      assert.match(move, language === 'en' ? /Power/ : /Potencia/);
      assert.match(move, /sprites\/types\//);
      assert.match(move, /#\/pokemon\//);
      assert.match(move, /src="\.\.\/sprites\/pokemon\/16\.png" alt="" loading="lazy"/);
      assert.doesNotMatch(move, /Priority|Prioridad|Contact|Contacto/);

      const learner = data.species.find((species) => species.learnset.some((entry) => entry.move_id === Number(gustId)));
      assert.ok(learner);
      const duplicateData = structuredClone(data);
      const duplicateSpecies = duplicateData.species.find((species) => species.id === learner.id);
      const duplicateEntry = duplicateSpecies.learnset.find((entry) => entry.move_id === Number(gustId));
      duplicateSpecies.learnset.push({ ...duplicateEntry });
      const duplicateView = renderToStaticMarkup(React.createElement(MoveDetail, { data: duplicateData, language, id: gustId }));
      const learnerList = duplicateView.match(/<ul class="detail-link-list move-learners">([\s\S]*?)<\/ul>/)?.[1] || '';
      assert.equal((learnerList.match(new RegExp(`href="#/pokemon/${learner.id}"`, 'g')) || []).length, 1);

      const machineMove = renderToStaticMarkup(React.createElement(MoveDetail, { data, language, id: machineMoveId }));
      assert.match(machineMove, /#\/items\//);
      const firstCompatible = Object.keys(data.tmhm_compatibility.by_species).find((speciesId) => data.tmhm_compatibility.by_species[speciesId].includes(data.tmhm[0].item_id));
      assert.ok(firstCompatible);
      assert.match(machineMove, new RegExp(`class="detail-link-list detail-compatible-species"><li><a class="detail-pokemon-link" href="#/pokemon/${firstCompatible}"`));
      assert.match(machineMove, new RegExp(`src="\.\.\/sprites\/pokemon\/${firstCompatible}\.png" alt="" loading="lazy"`));

      const partialData = structuredClone(data);
      delete partialData.tmhm_compatibility.by_species[firstCompatible];
      const partialView = renderToStaticMarkup(React.createElement(MoveDetail, { data: partialData, language, id: machineMoveId }));
      assert.match(partialView, language === 'en' ? /Partial coverage/ : /Cobertura parcial/);
      const partialCompatibility = partialView.match(/<ul class="detail-link-list detail-compatible-species">([\s\S]*?)<\/ul>/)?.[1] || '';
      assert.doesNotMatch(partialCompatibility, new RegExp(`href="#/pokemon/${firstCompatible}"`));

      const compatibleIds = Object.entries(data.tmhm_compatibility.by_species)
        .filter(([, itemIds]) => itemIds.includes(data.tmhm[0].item_id))
        .map(([speciesId]) => speciesId);
      assert.ok(compatibleIds.length >= 3);
      const malformedData = structuredClone(data);
      malformedData.tmhm_compatibility.by_species[compatibleIds[0]] = 123;
      malformedData.tmhm_compatibility.by_species[compatibleIds[1]] = { item_ids: [data.tmhm[0].item_id] };
      const malformedView = renderToStaticMarkup(React.createElement(MoveDetail, { data: malformedData, language, id: machineMoveId }));
      assert.match(malformedView, language === 'en' ? /Partial coverage/ : /Cobertura parcial/);
      const malformedCompatibility = malformedView.match(/<ul class="detail-link-list detail-compatible-species">([\s\S]*?)<\/ul>/)?.[1] || '';
      assert.doesNotMatch(malformedCompatibility, new RegExp(`href="#/pokemon/${compatibleIds[0]}"`));
      assert.doesNotMatch(malformedCompatibility, new RegExp(`href="#/pokemon/${compatibleIds[1]}"`));
      assert.match(malformedCompatibility, new RegExp(`href="#/pokemon/${compatibleIds[2]}"`));
    }

    const mismatched = { ...data, target_sha256: '0'.repeat(64) };
    const mismatchView = renderToStaticMarkup(React.createElement(MoveDetail, { data: mismatched, language: 'en', id: machineMoveId }));
    assert.match(mismatchView, /Compatibility unknown/);
    assert.match(mismatchView, /#\/items\//);

    const missingCompatibility = { ...data, tmhm_compatibility: undefined };
    const missingView = renderToStaticMarkup(React.createElement(MoveDetail, { data: missingCompatibility, language: 'es', id: machineMoveId }));
    assert.match(missingView, /Compatibilidad desconocida/);
    assert.match(renderToStaticMarkup(React.createElement(AbilityDetail, { data, language: 'en', id: 'missing' })), /Ability unavailable/);
    assert.match(renderToStaticMarkup(React.createElement(MoveDetail, { data, language: 'es', id: 'missing' })), /Movimiento no disponible/);
  } finally {
    await server.close();
  }
});
