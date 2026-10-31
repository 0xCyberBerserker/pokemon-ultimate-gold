import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('move stat sentinels are explained conservatively in reference and learnset views', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  const statusMove = Object.entries(data.moves).find(([, move]) => move.category === 2 && move.power === 0);
  const codedOffenseMove = Object.entries(data.moves).find(([, move]) => [0, 1].includes(move.category) && move.power === 1);
  const zeroAccuracyMove = Object.entries(data.moves).find(([, move]) => move.accuracy === 0);
  assert.ok(statusMove, 'expected an audited status move with power 0');
  assert.ok(codedOffenseMove, 'expected an audited offensive move with power 1');
  assert.ok(zeroAccuracyMove, 'expected an audited move with accuracy 0');

  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { displayMoveAccuracy, displayMovePower } = await server.ssrLoadModule('/src/data/move-values.ts');
    const { default: Reference } = await server.ssrLoadModule('/src/features/reference/Reference.tsx');
    const { default: Pokedex } = await server.ssrLoadModule('/src/features/pokedex/Pokedex.tsx');
    const { default: TrainerExplorer } = await server.ssrLoadModule('/src/features/trainers/TrainerExplorer.tsx');

    assert.deepEqual(displayMovePower(0, 'es'), { value: '—' });
    assert.equal(displayMovePower(1, 'es').value, 'Regla propia');
    assert.match(displayMovePower(1, 'es').note, /regla propia/);
    assert.equal(displayMovePower(1, 'en').value, 'Move-specific');
    assert.match(displayMovePower(1, 'en').note, /move-specific rule/);
    assert.equal(displayMoveAccuracy(0, 'es').value, '—');
    assert.match(displayMoveAccuracy(0, 'es').note, /no contiene una precisión numérica/);
    assert.match(displayMoveAccuracy(0, 'en').note, /not verified/);
    assert.equal(displayMovePower(40, 'en').value, '40');
    assert.equal(displayMoveAccuracy(95, 'en').value, '95');

    const statusView = renderToStaticMarkup(React.createElement(Reference, { data, language: 'es', route: `#/moves/${statusMove[0]}` }));
    assert.match(statusView, /Potencia: —/);
    const accuracyView = renderToStaticMarkup(React.createElement(Reference, { data, language: 'en', route: `#/moves/${zeroAccuracyMove[0]}` }));
    assert.match(accuracyView, /Accuracy: —/);
    assert.match(accuracyView, /not verified here/);

    const [learnsetMoveId] = codedOffenseMove;
    const species = data.species.find((entry) => entry.learnset.some((learned) => learned.move_id === Number(learnsetMoveId)));
    assert.ok(species, 'expected an audited power-1 move in at least one learnset');
    const learnsetView = renderToStaticMarkup(React.createElement(Pokedex, { data, language: 'en', id: species.id }));
    assert.match(learnsetView, new RegExp(`href="#/moves/${learnsetMoveId}"`));
    assert.match(learnsetView, /Power Move-specific/);
    assert.match(learnsetView, /move-specific rule/);

    const synthetic = structuredClone(data);
    const trainerMember = synthetic.trainers[0].members[0];
    trainerMember.move_ids = [...new Set([...trainerMember.move_ids, Number(learnsetMoveId)])];
    if (trainerMember.move_ids_by_mode?.normal) trainerMember.move_ids_by_mode.normal = [...new Set([...trainerMember.move_ids_by_mode.normal, Number(learnsetMoveId)])];
    globalThis.location = { hash: `#/trainers/${synthetic.trainers[0].id}` };
    globalThis.sessionStorage = { getItem: () => null };
    const trainerView = renderToStaticMarkup(React.createElement(TrainerExplorer, { data: synthetic, language: 'en', mode: 'normal' }));
    assert.match(trainerView, new RegExp(`href="#/moves/${learnsetMoveId}"`));
    assert.match(trainerView, /Power Move-specific/);
    assert.match(trainerView, /move-specific rule/);
  } finally {
    await server.close();
    delete globalThis.location;
    delete globalThis.sessionStorage;
  }
});
