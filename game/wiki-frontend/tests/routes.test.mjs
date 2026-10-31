import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute } from '../src/data/routes.ts';

test('legacy hash routes stay available and unknown paths do not become trainer pages', () => {
  assert.deepEqual(parseRoute(''), { kind: 'home' });
  assert.deepEqual(parseRoute('#/pokemon/35'), { kind: 'pokemon', id: 35 });
  assert.deepEqual(parseRoute('#/trainers/1'), { kind: 'trainers', id: 1 });
  assert.deepEqual(parseRoute('#/abilities/65'), { kind: 'abilities', id: '65' });
  for (const route of ['moves', 'items', 'machines', 'guides', 'guide', 'evolutions', 'faq', 'mechanics', 'patcher', 'cheats', 'kris-progress']) assert.equal(parseRoute(`#/${route}`).kind, route);
  assert.equal(parseRoute('#/pokemon-invalid').kind, 'not-found');
  assert.equal(parseRoute('#/unknown').kind, 'not-found');
});
