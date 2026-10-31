import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { orderedGallery, galleryImagePath, galleryStatuses } from '../src/data/krisGallery.ts';

const gallery = JSON.parse(await readFile(new URL('../../web/data/kris-gallery.json', import.meta.url)));

test('gallery keeps every unique capture and orders frames within a collection', () => {
  const ordered = orderedGallery(gallery);
  assert.equal(ordered.length, gallery.images.length);
  assert.equal(new Set(ordered.map((entry) => entry.image.id)).size, gallery.images.length);
  const opening = ordered.filter((entry) => entry.primary.collection_id === 'k01-core16');
  assert.ok(opening.length > 1);
  const runs = new Map();
  for (const entry of opening) {
    const previous = runs.get(entry.primary.run_id);
    const frame = entry.primary.frame_index_from_filename;
    if (previous !== undefined && frame != null) assert.ok(frame >= previous);
    if (frame != null) runs.set(entry.primary.run_id, frame);
  }
  const core = orderedGallery(gallery, 'k01-core16');
  assert.ok(core.length >= opening.length);
  assert.ok(core.every((entry) => entry.primary.collection_id === 'k01-core16'));
});

test('gallery accepts only project PNG files and rejects external paths', () => {
  assert.equal(galleryImagePath('png/img-abc.png'), '../assets/kris-progress/png/img-abc.png');
  assert.equal(galleryImagePath('../../secrets.png'), null);
  assert.equal(galleryImagePath('https://example.com/a.png'), null);
  assert.equal(galleryImagePath('png/img.svg'), null);
});

test('every gallery image matches its recorded SHA-256', async () => {
  for (const image of gallery.images) {
    assert.ok(galleryImagePath(image.file), image.id);
    const bytes = await readFile(new URL(`../../web/assets/kris-progress/${image.file}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), image.sha256, image.id);
  }
});

test('shared captures retain all evidence statuses', () => {
  const image = gallery.images.find((entry) => entry.id === 'img-56ab4f92c2277c33');
  assert.deepEqual(new Set(galleryStatuses(image, gallery.collections)), new Set(['historical', 'qa_partial']));
});
