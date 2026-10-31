import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageOf } from '../src/data/pagination.ts';

test('pagination exposes every entry exactly once and clamps stale pages', () => {
  const entries = Array.from({ length: 493 }, (_, index) => index + 1);
  const pages = Array.from({ length: Math.ceil(entries.length / 60) }, (_, index) => pageOf(entries, index, 60).items);
  assert.deepEqual(pages.flat(), entries);
  assert.ok(pages.every((page) => page.length <= 60));
  assert.equal(pageOf(entries.slice(0, 10), 9, 60).page, 0);
});
