import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { orderedGallery, galleryImagePath, galleryStatuses, editorialGallery } from '../src/data/krisGallery.ts';

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

test('editorial selection falls back to partial QA and honors explicit image or collection selections', () => {
  const selected = editorialGallery(gallery);
  const expected = gallery.images.filter((image) => galleryStatuses(image, gallery.collections).includes('qa_partial'));
  assert.deepEqual(selected, new Set(expected.map((image) => image.id)));
  const first = gallery.images[0];
  assert.deepEqual(editorialGallery({ ...gallery, editorial_selection: { images: [first.id] } }), new Set([first.id]));
  const collectionId = first.source_references[0].collection_id;
  const matching = gallery.images.filter((image) => image.source_references.some((ref) => ref.collection_id === collectionId));
  assert.deepEqual(editorialGallery({ ...gallery, editorial_selection: [{ collection_id: collectionId }] }), new Set(matching.map((image) => image.id)));
});

test('featured captures are reviewed native Core97 evidence and the full archive remains accessible', async () => {
  const React = (await import('react')).default;
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { createServer } = await import('vite');
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: KrisGallery } = await server.ssrLoadModule('/src/features/kris/KrisGallery.tsx');
    const ids = ['img-811cb30e8e979fa5', 'img-789ce9eded3f6371', 'img-39a7862bbce21a62'];
    for (const language of ['en', 'es']) {
      const html = renderToStaticMarkup(React.createElement(KrisGallery, { language, initialManifest: gallery }));
      const archive = html.indexOf(language === 'es' ? 'Archivo técnico completo y filtros' : 'Complete technical archive and filters');
      assert.ok(archive > 0);
      assert.ok(html.indexOf(language === 'es' ? 'Una primera variante experimental' : 'An early experimental variant') > archive);
      assert.ok(html.includes(language === 'es' ? 'esta galería aún no identifica qué captura corresponde' : 'this gallery does not yet identify which capture corresponds'));
      for (const id of ids) {
        assert.ok(html.indexOf(`${id}.png`) < archive);
        const image = gallery.images.find((entry) => entry.id === id);
        assert.ok(image.source_references.some((ref) => ref.collection_id === 'k02-core97' && ref.capture_origin === 'native_run_file' && ref.build_sha256 === 'a19c9a41ef57e232e3cb64023f61623e660afcbeba0e6abe971d7f5d702fe009'));
      }
      assert.ok(html.includes(` / ${gallery.images.length} `));
      assert.match(html, /postflight/i);
    }
  } finally { await server.close(); }
});
