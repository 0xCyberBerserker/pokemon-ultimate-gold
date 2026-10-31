import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { publicGuideHtml } from '../src/data/guide-links.ts';

test('known broken public links have an evidence-backed presentation', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  for (const language of ['en', 'es']) {
    const frontier = data.guides['alpha2-frontier-qa'].body[language];
    assert.match(frontier, /qa-alpha2-frontier-outcome-qa\.html/);
    assert.match(publicGuideHtml('alpha2-frontier-qa', frontier, language), /#\/guide\/alpha2-frontier-outcome-qa/);
    const nature = data.guides['qa-nature-integrated-no-save-cold-review'].body[language];
    const result = publicGuideHtml('qa-nature-integrated-no-save-cold-review', nature, language);
    assert.doesNotMatch(result, /href="\.\.\/data\/acceptance\.json"/);
    assert.match(result, language === 'es' ? /evidencia detallada no publicada/ : /detailed evidence not published/);
    assert.match(result, /acceptance JSON/);
  }
});
