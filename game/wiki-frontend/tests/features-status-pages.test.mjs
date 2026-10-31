import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const readJson = (path) => readFile(new URL(path, import.meta.url)).then(JSON.parse);
const data = await readJson('../../web/data/wiki-data.json');
const catalog = await readJson('../../web/data/patch-catalog.json');

test('features and status pages summarize current labels and retain the full bilingual reports', async () => {
  assert.equal(catalog.default, 'kris-sprint2');
  assert.equal(catalog.wiki_data, 'alpha2');
  const patchDefault = catalog.versions[catalog.default].label;
  const wikiVersion = catalog.versions[catalog.wiki_data].label;
  assert.equal(data.target_sha256, '24ea9b16615d35b37b3a75f6c7d6fb1397d5ac851b88db8b78b7d3857a2725f6');

  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  try {
    const { default: FeaturesPage } = await server.ssrLoadModule('/src/features/reference/FeaturesPage.tsx');
    const { default: ProjectStatusPage } = await server.ssrLoadModule('/src/features/reference/ProjectStatusPage.tsx');
    const { default: Reference } = await server.ssrLoadModule('/src/features/reference/Reference.tsx');
    for (const language of ['en', 'es']) {
      const props = { data, language, patchDefault, wikiVersion };
      const features = renderToStaticMarkup(React.createElement(FeaturesPage, props));
      const featureSummary = features.split('<details class="panel project-technical-details">')[0];
      assert.ok(features.includes(patchDefault[language]));
      assert.ok(features.includes(wikiVersion[language]));
      assert.ok(features.includes(data.guides.features.body[language]));
      assert.match(features, language === 'en' ? /bounded tests|bounded native evidence/i : /pruebas acotadas|evidencia nativa representativa/i);
      assert.match(featureSummary, language === 'en' ? /Rocket Kit \(Team Rocket gift\)/ : /Kit Rocket \(regalo del Team Rocket\)/);
      assert.match(featureSummary, /New Bark Town \(Pueblo Primavera\)/);
      assert.match(featureSummary, language === 'en' ? /south of the southwest house/i : /al sur de la casa suroeste/i);
      assert.match(featureSummary, language === 'en' ? /Accept the offer/ : /Aceptar la oferta/);
      assert.match(featureSummary, language === 'en' ? /keep Cheat Kit \(item 118\) in your Bag/ : /conserva Cheat Kit \(objeto 118\) en la Bolsa/);
      assert.match(featureSummary, language === 'en' ? /Bag → Key Items → TM Refill → Use/ : /Bolsa → Objetos clave → Recarga MT → Usar/);
      assert.match(featureSummary, language === 'en' ? /owned TM01–TM92 to 99 and does not grant missing TMs; this specific use has not been verified on Alpha 2/i : /MT01–MT92 que ya posees y no concede las ausentes; ese uso concreto aún no está verificado en Alfa 2/i);
      assert.match(featureSummary, language === 'en' ? /Rare Candy, Oran Berry and Max Repel/ : /Rare Candy \(Caramelo Raro\), Oran Berry \(Baya Aranja\) y Max Repel \(Repelente Máximo\)/);
      assert.match(featureSummary, language === 'en' ? /declining, repeating it or accepting with a full Bag remain untested/ : /rechazarla, repetirla o recibirla con la Bolsa llena sigue sin probarse/);
      assert.match(featureSummary, /href="#\/guide\/kit"/);

      const status = renderToStaticMarkup(React.createElement(ProjectStatusPage, props));
      const overview = status.split('<details class="panel project-technical-details">')[0];
      assert.ok(overview.includes(patchDefault[language]));
      assert.ok(overview.includes(wikiVersion[language]));
      assert.match(overview, language === 'en' ? /AVAILABLE · EXPERIMENTAL/ : /DISPONIBLE · EXPERIMENTAL/);
      assert.match(overview, language === 'en' ? /Kris: technical review passed/ : /Kris: revisión técnica superada/);
      assert.match(overview, language === 'en' ? /private candidate\. Its results do not establish the public default build shown above/ : /candidata privada concreta\. Sus resultados no acreditan la build pública predeterminada que aparece arriba/);
      assert.doesNotMatch(overview, language === 'en' ? /not in public downloads/ : /no está incluida en las descargas públicas/);
      assert.doesNotMatch(overview, /d577d8e8a47020deca8f9d5691af9480fd5671af79d0a92322f509de165f6267/);
      assert.ok(status.includes(data.guides.progress.body[language]), 'full technical history should remain available verbatim');
      assert.match(status, /d577d8e8a47020deca8f9d5691af9480fd5671af79d0a92322f509de165f6267/);
      const routedFeatures = renderToStaticMarkup(React.createElement(Reference, { ...props, route: '#/guide/features' }));
      const routedStatus = renderToStaticMarkup(React.createElement(Reference, { ...props, route: '#/guide/progress' }));
      assert.match(routedFeatures, language === 'en' ? /What Ultimate Gold offers/ : /Qué ofrece Ultimate Gold/);
      assert.match(routedStatus, language === 'en' ? /Status and builds/ : /Estado y versiones/);
      assert.ok(routedFeatures.includes(patchDefault[language]));
      assert.ok(routedStatus.includes(wikiVersion[language]));
    }
  } finally {
    await server.close();
  }
});
