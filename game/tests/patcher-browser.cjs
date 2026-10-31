/* Requires an existing Playwright install, a served static patcher build, and an external clean ROM fixture. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const siteRoot = path.resolve(process.env.PATCHER_ROOT || path.join(root, 'web'));
const alpha1 = JSON.parse(fs.readFileSync(path.join(siteRoot, 'data/patch-manifest-alpha1.json'), 'utf8'));
const alpha2 = JSON.parse(fs.readFileSync(path.join(siteRoot, 'data/patch-manifest-alpha2.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(siteRoot, 'data/patch-catalog.json'), 'utf8'));
const current = JSON.parse(fs.readFileSync(path.join(siteRoot, 'data/patch-manifest.json'), 'utf8'));
const defaultVersion = current.target.sha256 === alpha2.target.sha256 ? 'alpha2' : 'alpha1';
const source = process.env.SACRED_GOLD_CLEAN_ROM;
const url = process.env.PATCHER_URL || 'http://127.0.0.1:8767/';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

(async () => {
  assert(source, 'SACRED_GOLD_CLEAN_ROM is required');
  assert.equal(catalog.default, defaultVersion);
  assert.deepEqual(current, defaultVersion === 'alpha2' ? alpha2 : alpha1);
  assert.equal(alpha2.status, 'EXPERIMENTAL_TESTED_PARTIAL');
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ultimate-gold-browser-'));
  const browser = await chromium.launch({headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 1280, height: 900}, acceptDownloads: true});
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => requests.push({method: request.method(), url: request.url()}));
    await page.goto(url);
    await page.waitForFunction(count => document.querySelector('#version').options.length === count, Object.keys(catalog.versions).length);
    assert.equal(await page.locator('#version').inputValue(), defaultVersion);
    await page.selectOption('#language', 'en');
    await page.click('#apply');
    await page.locator('#status.error').waitFor();
    assert.match(await page.locator('#status').innerText(), /Choose a clean/);

    const cleanBytes = fs.readFileSync(source);
    const wrongBytes = Buffer.from(cleanBytes); wrongBytes[0] ^= 1;
    const wrongFile = path.join(temp, 'wrong.nds'); fs.writeFileSync(wrongFile, wrongBytes);
    await page.setInputFiles('#rom', wrongFile);
    await page.selectOption('#version', 'alpha2');
    await page.waitForFunction(() => document.querySelector('#status').textContent === 'Ready.');
    assert.match(await page.locator('#version-note').innerText(), /Experimental/);
    await page.click('#apply');
    await page.locator('#status.error').waitFor();
    assert.match(await page.locator('#status').innerText(), /required clean SHA-256/);
    assert.equal(await page.locator('#download').isVisible(), false);

    await page.setInputFiles('#rom', source);
    const alpha2Delta = fs.readFileSync(path.join(siteRoot, 'assets', alpha2.delta.file));
    await page.route('**/assets/' + alpha2.delta.file, async route => {
      assert.equal(await page.locator('#version').isDisabled(), true, 'build must remain fixed while patching');
      assert.equal(await page.locator('#rom').isDisabled(), true, 'source must remain fixed while patching');
      await route.fulfill({body: alpha2Delta.subarray(0, alpha2Delta.length - 1)});
    });
    await page.click('#apply');
    await page.waitForFunction(() => document.querySelector('#status').classList.contains('error'));
    assert.match(await page.locator('#status').innerText(), /Patch asset is incomplete/);
    assert.equal(await page.locator('#download').isVisible(), false, 'truncated patch must not expose a partial output');
    assert.equal(await page.locator('#version').isEnabled(), true);
    assert.equal(await page.locator('#rom').isEnabled(), true);
    await page.unroute('**/assets/' + alpha2.delta.file);

    await page.click('#apply');
    await page.locator('#download:visible').waitFor();
    let downloadEvent = page.waitForEvent('download');
    await page.click('#download');
    let download = await downloadEvent;
    let output = path.join(temp, 'alpha2.nds');
    await download.saveAs(output);
    assert.equal(download.suggestedFilename(), alpha2.target.filename);
    assert.equal(hash(fs.readFileSync(output)), alpha2.target.sha256);

    await page.selectOption('#language', 'es');
    assert.match(await page.locator('#version-note').innerText(), /experimental/);
    assert.equal(await page.locator('#version').getAttribute('aria-label'), 'Versión del build');
    assert.match(await page.locator('#status').innerText(), /Parche completado/);
    await page.selectOption('#version', 'alpha1');
    await page.waitForFunction(() => document.querySelector('#status').textContent === 'Listo.');
    assert.equal(await page.locator('#download').isVisible(), false, 'changing version must revoke the old output');
    assert.match(await page.locator('#version-note').innerText(), /anterior/);

    await page.click('#apply');
    await page.locator('#download:visible').waitFor();
    downloadEvent = page.waitForEvent('download');
    await page.click('#download');
    download = await downloadEvent;
    output = path.join(temp, 'alpha1.nds');
    await download.saveAs(output);
    assert.equal(download.suggestedFilename(), alpha1.target.filename);
    assert.equal(hash(fs.readFileSync(output)), alpha1.target.sha256);

    await page.goto(new URL('./wiki/#/patcher', url).href);
    await page.selectOption('#language', 'es');
    const integrated = page.frameLocator('#patcher-frame');
    await integrated.locator('#version option').nth(1).waitFor({state: 'attached'});
    await integrated.locator('#version').selectOption('alpha2');
    await integrated.locator('#status').filter({hasText: 'Listo.'}).waitFor();
    assert.match(await page.locator('[data-patcher-title]').innerText(), /Aplica Ultimate Gold$/);
    assert.equal(await integrated.locator('#language').inputValue(), 'es');
    await integrated.locator('#rom').setInputFiles(source);
    await integrated.locator('#apply').click();
    await integrated.locator('#download:visible').waitFor();
    downloadEvent = page.waitForEvent('download');
    await integrated.locator('#download').click();
    download = await downloadEvent;
    output = path.join(temp, 'alpha2-integrated.nds');
    await download.saveAs(output);
    assert.equal(download.suggestedFilename(), alpha2.target.filename);
    assert.equal(hash(fs.readFileSync(output)), alpha2.target.sha256);
    assert.deepEqual(errors, []);
    assert(requests.every(request => request.method === 'GET' && new URL(request.url).origin === new URL(url).origin));
    console.log(JSON.stringify({result:'PASS',default:defaultVersion,alpha1_sha256:alpha1.target.sha256,alpha2_sha256:alpha2.target.sha256,checks:['default catalog and current manifest agree','Alpha 1 output','Alpha 2 selector and exact output','integrated wiki Alpha 2 download and language sync','global EN/ES labels','wrong source rejection','truncated delta no download','local GET-only requests']}));
  } finally {
    await browser.close();
    fs.rmSync(temp, {recursive: true, force: true});
  }
})().catch(error => { console.error(error); process.exit(1); });
