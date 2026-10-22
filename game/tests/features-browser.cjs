/* Requires an existing Playwright install and the locally built static wiki. */
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.WIKI_URL || 'http://127.0.0.1:8767/web/wiki/';

(async () => {
  const browser = await chromium.launch({headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 1280, height: 900}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

    await page.goto(base);
    assert(await page.locator('.home-features-link').isVisible());
    await page.locator('.home-features-link').click();
    await page.getByRole('heading', {name: 'Ultimate Gold features', exact: true}).waitFor();
    assert.equal(await page.locator('.feature-group').count(), 4);
    assert.equal(await page.locator('.feature-group ul li').count(), 11);
    assert.equal(await page.locator('.feature-map svg[role="img"]').count(), 1);
    assert.equal(await page.locator('#category-nav a[aria-current="page"]').getAttribute('href'), '#/guide/features');
    await page.locator('.feature-credits > summary').click();
    assert.match(await page.locator('.feature-credits').innerText(), /NefariousnessNo3436/);

    await page.selectOption('#language', 'es');
    await page.getByRole('heading', {name: 'Características de Ultimate Gold', exact: true}).waitFor();
    assert.equal(await page.locator('.feature-group').count(), 4);
    assert.match(await page.locator('.feature-group').nth(0).innerText(), /Base HeartGold/);
    assert.match(await page.locator('.feature-group').nth(3).innerText(), /Alfa 2.*experimental/is);
    await page.locator('.feature-credits > summary').click();
    assert.match(await page.locator('.feature-credits').innerText(), /Créditos y procedencia/);
    await page.goto(base + '#/');
    assert.equal((await page.locator('.home-features-link').innerText()).replace(/\s+/g, ' ').trim(), 'Versiones y características →');
    await page.locator('.home-features-link').click();
    await page.getByRole('heading', {name: 'Características de Ultimate Gold', exact: true}).waitFor();

    await page.setViewportSize({width: 390, height: 844});
    const mobileWidths = await page.locator('.feature-map__viewport').evaluate(node => ({page: document.documentElement.scrollWidth, viewport: innerWidth, client: node.clientWidth, content: node.scrollWidth}));
    assert(mobileWidths.page <= mobileWidths.viewport);
    assert(mobileWidths.content > mobileWidths.client);
    assert(await page.locator('.feature-map__scroll-hint').isVisible());
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({result: 'PASS', checks: ['home CTA and route', 'four comparison layers', 'accessible composition diagram', 'credits disclosure', 'English and Spanish', 'mobile page width', 'no browser errors']}));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
