import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orderTrainers } from '../src/data/journey.ts';

test('trainers follow documented stage and encounter order without losing unknown entries', () => {
  const stages = [{ id: 'first' }, { id: 'second' }];
  const trainers = [
    { id: 1, journey: { stage_id: 'second', order: 9 } },
    { id: 2, journey: null },
    { id: 3, journey: { stage_id: 'first', order: 7 } },
    { id: 4, journey: { stage_id: 'first', order: 2 } },
  ];
  assert.deepEqual(orderTrainers(trainers, stages).map((trainer) => trainer.id), [4, 3, 1, 2]);
  assert.deepEqual(trainers.map((trainer) => trainer.id), [1, 2, 3, 4]);
});
