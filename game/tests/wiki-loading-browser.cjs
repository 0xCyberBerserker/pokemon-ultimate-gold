/* Exercise navigation while the wiki dataset is still loading. */
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.WIKI_URL || 'http://127.0.0.1:8767/web/wiki/';

(async () => {
  const browser = await chromium.launch({headless: true});
  let releaseData;
  const blockedData = new Promise(resolve => { releaseData = resolve; });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/data/wiki-data.json', async route => {
      await blockedData;
      await route.continue();
    });
    await page.goto(base + '#/trainers');
    await page.selectOption('#language', 'es');
    await page.selectOption('#game-mode', 'plus');
    await page.evaluate(() => { location.hash = '#/pokemon/35'; });
    await page.waitForFunction(() => location.hash === '#/pokemon/35');
    assert.deepEqual(errors, []);
    releaseData();
    await page.getByRole('heading', {name: '#35 Clefairy', exact: true}).waitFor();
    assert.match(await page.locator('#content').innerText(), /Hada/);
    assert.equal(await page.locator('#game-mode').inputValue(), 'plus');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({result: 'PASS', checks: ['early language and mode changes', 'early route change', 'latest selections after data loads', 'no browser errors']}));
  } finally {
    releaseData();
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
