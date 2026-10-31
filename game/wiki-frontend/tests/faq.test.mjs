import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { splitFaq } from '../src/data/faq.ts';

test('all source FAQ questions and answers remain intact in both languages', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  for (const language of ['en', 'es']) {
    const source = data.guides.faq.body[language];
    const { introduction, entries } = splitFaq(source);
    assert.ok(entries.length > 0);
    assert.equal(entries.length, (source.match(/<h3>/g) || []).length);
    assert.equal(introduction + entries.map(({ question, answer }) => `<h3>${question}</h3>${answer}`).join(''), source);
  }
  assert.deepEqual(splitFaq('<p>Plain text</p>'), { introduction: '<p>Plain text</p>', entries: [] });
});
