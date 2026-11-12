const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const servers = [];
let browser;
const passed = [];
const errors = [];
const ok = (name) => { passed.push(name); console.log('PASS', name); };
const wait = async (predicate, label) => {
  for (let i = 0; i < 60; i++) { if (await predicate()) return; await new Promise((r) => setTimeout(r, 100)); }
  throw new Error('Timed out: ' + label);
};
async function serve(app, port) {
  const dir = path.join(root, 'apps', app, 'dist');
  const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
  const server = http.createServer((req, res) => {
    const file = path.resolve(dir, '.' + decodeURIComponent(new URL(req.url, 'http://local').pathname));
    if (!file.startsWith(dir + path.sep) && file !== dir) { res.writeHead(403).end(); return; }
    try {
      const target = file === dir ? path.join(dir, 'index.html') : file;
      res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
      res.end(fs.readFileSync(target));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  servers.push(server);
}
async function context(options = {}) {
  const ctx = await browser.newContext({ locale: 'en-US', viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block', ...options });
  // Tests are local only. Abort optional external fonts and map tiles.
  await ctx.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname;
    return host === '127.0.0.1' || (process.env.ALLOW_MAP_TILES === '1' && host.endsWith('.tile.openstreetmap.org')) ? route.continue() : route.abort();
  });
  ctx.on('page', (page) => page.on('pageerror', (error) => errors.push(error.message)));
  return ctx;
}
(async () => {
  await serve('trick-or-treat-map', 5173);
  await serve('ghost-story-relay', 5174);
  browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });
  const ctx = await context();
  const map = await ctx.newPage(), map2 = await ctx.newPage();
  await Promise.all([map.goto('http://127.0.0.1:5173'), map2.goto('http://127.0.0.1:5173')]);
  if (process.env.ALLOW_MAP_TILES === '1') {
    await wait(async () => (await map.locator('.leaflet-tile-loaded').count()) > 0, 'live map tiles');
    ok('OpenStreetMap background tiles load for fictional demo area');
  }
  await map.locator('.tot-toolbar button').last().click();
  assert.equal(await map.getByRole('button', { name: 'Choose on map', exact: true }).evaluate(el => el === document.activeElement), true);
  await map.locator('.tot-form textarea').fill('Keep focus through React state updates');
  assert.equal(await map.locator('.tot-form textarea').evaluate(el => el === document.activeElement), true);
  await map.keyboard.press('Escape');
  assert.equal(await map.locator('.tot-toolbar button').last().evaluate(el => el === document.activeElement), true);
  await map.locator('.tot-toolbar button').last().click();
  await map.keyboard.press('Shift+Tab');
  assert.equal(await map.getByRole('button', { name: 'Cancel', exact: true }).evaluate(el => el === document.activeElement), true);
  await map.keyboard.press('Tab');
  assert.equal(await map.getByRole('button', { name: 'Choose on map', exact: true }).evaluate(el => el === document.activeElement), true);
  ok('shared modal initial focus, React rerender stability, wrap and restore work in map');
  await map.getByRole('button', { name: 'Use fictional demo point', exact: true }).click();
  await map.locator('.tot-form input.ps-input').nth(0).fill('Demo Lantern House');
  await map.locator('.tot-form textarea').fill('Fictional demo only.');
  await map.getByRole('button', { name: /Save$/ }).click();
  await wait(async () => (await map.locator('.tot-row').count()) === 1 && (await map2.locator('.tot-row').count()) === 1, 'map same-tab and cross-tab create');
  ok('map create appears immediately in same tab and second tab');
  await map.locator('.tot-row button').last().click();
  await wait(async () => /1/.test(await map2.locator('.tot-row button').last().innerText()), 'thanks cross-tab');
  ok('map thanks updates both tabs');
  await map.reload();
  await wait(async () => (await map.locator('.tot-row').count()) === 1, 'map refresh');
  ok('map data persists after refresh');
  await map.locator('.tot-toolbar button').last().click();
  await map.locator('.tot-form input.ps-input').nth(0).fill('Draft survives cancel');
  await map.getByRole('button', { name: 'Cancel', exact: true }).click();
  assert.equal(await map.getByRole('dialog').count(), 0);
  await map.locator('.tot-toolbar button').last().click();
  assert.equal(await map.locator('.tot-form input.ps-input').nth(0).inputValue(), 'Draft survives cancel');
  await map.keyboard.press('Escape');
  assert.equal(await map.getByRole('dialog').count(), 0);
  ok('map Cancel and Escape dismiss without saving and retain draft');
  await map.locator('.tot-toolbar button').last().click();
  await map.getByRole('button', { name: 'Choose on map', exact: true }).click();
  assert.equal(await map.getByRole('dialog').count(), 0);
  await map.locator('.tot-map').click({ position: { x: 250, y: 220 } });
  await map.getByRole('dialog').waitFor();
  await map.locator('.tot-form input.ps-input').nth(0).fill('Demo Moon Porch');
  await map.locator('.tot-form input[type=checkbox]').check();
  await map.getByRole('button', { name: /Save$/ }).click();
  await wait(async () => (await map.locator('.tot-row').count()) === 2, 'map pick create');
  await map.getByRole('button', { name: /Allergy-friendly only/ }).click();
  await wait(async () => (await map.locator('.leaflet-marker-icon').count()) === 1, 'allergy filter');
  await map.getByRole('button', { name: /Allergy-friendly only/ }).click();
  ok('manual map pick and allergy filter work without geolocation');
  await map.locator('.tot-toolbar button').last().click();
  await map.getByRole('button', { name: 'Use fictional demo point', exact: true }).click();
  await map.locator('.tot-form input.ps-input').nth(0).fill('Unsaved draft');
  await map.evaluate(() => { window.originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = function(key, value) { if(key === 'ps:candy_stops') throw new DOMException('full', 'QuotaExceededError'); return window.originalSetItem.call(this,key,value); }; });
  await map.getByRole('button', { name: /Save$/ }).click();
  await map.locator('.ps-toast--error').last().waitFor();
  assert.equal(await map.locator('.tot-form input.ps-input').nth(0).inputValue(), 'Unsaved draft');
  assert.equal(await map.locator('.tot-row').count(), 2);
  await map.evaluate(() => { Storage.prototype.setItem = window.originalSetItem; });
  await map.keyboard.press('Escape');
  ok('map failed write surfaces an error and retains draft');

  const story = await ctx.newPage(), story2 = await ctx.newPage();
  await story.goto('http://127.0.0.1:5174');
  await story.locator('.gsr-code').fill('BAD!');
  assert.equal(await story.getByRole('button', { name: 'Join', exact: true }).isDisabled(), true);
  await story.getByRole('button', { name: /Start a new story/ }).click();
  await wait(async () => (await story.locator('.gsr-line').count()) === 1, 'opening line same tab');
  const url = story.url();
  await story2.goto(url);
  await wait(async () => (await story2.locator('.gsr-line').count()) === 1, 'opening line second tab');
  assert.equal(await story.locator('.gsr-line').count(), 1);
  ok('story validates codes and seeds exactly one visible opening');
  await story.locator('.gsr-composer input').fill('A tiny pumpkin knocked on the locked door.');
  await story.getByRole('button', { name: 'Whisper it', exact: true }).click();
  await wait(async () => (await story2.locator('.gsr-line').count()) === 2, 'story first send');
  await story2.locator('.gsr-composer input').fill('Inside, the candle answered in a whisper.');
  await story2.getByRole('button', { name: 'Whisper it', exact: true }).click();
  await wait(async () => (await story.locator('.gsr-line').count()) === 3, 'story second send');
  ok('story writes sync in both directions with no refresh');
  await story.locator('.gsr-vibe').last().click();
  await wait(async () => /1/.test(await story2.locator('.gsr-vibe').last().innerText()), 'story vibe');
  await story.reload();
  await wait(async () => (await story.locator('.gsr-line').count()) === 3, 'story persisted');
  await story.getByRole('button', { name: 'Finish & share', exact: true }).click();
  await story.getByRole('dialog').waitFor();
  assert.match(await story.locator('.gsr-final').innerText(), /tiny pumpkin/);
  await story.keyboard.press('Escape');
  assert.equal(await story.getByRole('dialog').count(), 0);
  assert.equal(await story.getByRole('button', { name: 'Finish & share', exact: true }).evaluate(el => el === document.activeElement), true);
  ok('story votes, refresh persistence and finished preview work; Escape closes');
  await story.locator('.gsr-composer input').fill('Retain this failed whisper.');
  await story.evaluate(() => { window.originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = function(key, value) { if(key === 'ps:story_lines') throw new DOMException('full', 'QuotaExceededError'); return window.originalSetItem.call(this,key,value); }; });
  await story.getByRole('button', { name: 'Whisper it', exact: true }).click();
  await story.locator('.ps-toast--error').last().waitFor();
  assert.equal(await story.locator('.gsr-composer input').inputValue(), 'Retain this failed whisper.');
  assert.equal(await story.locator('.gsr-line').count(), 3);
  await story.evaluate(() => { Storage.prototype.setItem = window.originalSetItem; });
  ok('story failed write retains draft and does not append');
  await story.getByRole('button', { name: /All stories/ }).click();
  await story.goBack();
  await wait(async () => (await story.locator('.gsr-line').count()) === 3, 'Back navigation');
  await story.goForward();
  await story.getByRole('button', { name: /Start a new story/ }).waitFor();
  ok('story Back and Forward restore expected room/home');
  await story.goto(url);
  await new Promise((resolve) => setTimeout(resolve, 3500));
  await story.getByLabel('Festival skin').selectOption('christmas');
  await story.getByLabel('Festival skin').selectOption('halloween');
  await story.screenshot({ path: path.join(root, '.qa', 'repaired-story-desktop.png'), fullPage: true });
  await map.screenshot({ path: path.join(root, '.qa', 'repaired-map-desktop.png'), fullPage: true });
  await story.setViewportSize({ width: 390, height: 844 });
  await map.setViewportSize({ width: 390, height: 844 });
  for (const p of [story,map]) {
    assert(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'mobile horizontal overflow');
  }
  await story.screenshot({ path: path.join(root, '.qa', 'repaired-story-mobile.png'), fullPage: true });
  await map.screenshot({ path: path.join(root, '.qa', 'repaired-map-mobile.png'), fullPage: true });
  ok('both apps fit 390px mobile width; desktop/mobile screenshots saved');

  const fallback = await context();
  await fallback.addInitScript(() => { window.BroadcastChannel = undefined; });
  const f1 = await fallback.newPage(), f2 = await fallback.newPage();
  await Promise.all([f1.goto('http://127.0.0.1:5174/#/r/FALL01'), f2.goto('http://127.0.0.1:5174/#/r/FALL01')]);
  await wait(async () => (await f1.locator('.gsr-line').count()) === 1 && (await f2.locator('.gsr-line').count()) === 1, 'fallback simultaneous opening');
  await f1.locator('.gsr-composer input').fill('Storage events still whisper.');
  await f1.getByRole('button', { name: 'Whisper it', exact: true }).click();
  await wait(async () => (await f2.locator('.gsr-line').count()) === 2, 'storage fallback');
  ok('storage-event fallback and simultaneous room opening work');
  await f1.locator('.gsr-composer input').fill('Concurrent first tab.');
  await f2.locator('.gsr-composer input').fill('Concurrent second tab.');
  await Promise.all([f1.getByRole('button', { name: 'Whisper it', exact: true }).click(), f2.getByRole('button', { name: 'Whisper it', exact: true }).click()]);
  await wait(async () => (await f1.locator('.gsr-line').count()) === 4 && (await f2.locator('.gsr-line').count()) === 4, 'concurrent appends');
  ok('simultaneous tab submissions keep both lines');
  const broken = await context();
  await broken.addInitScript(() => { if (location.protocol === 'http:') localStorage.setItem('ps:story_lines', '{broken'); });
  const bad = await broken.newPage();
  await bad.goto('http://127.0.0.1:5174/#/r/BAD001');
  await bad.getByRole('alert').waitFor();
  assert.equal(await bad.evaluate(() => localStorage.getItem('ps:story_lines')), '{broken');
  ok('corrupt data yields a visible error without overwriting it');
  const blocked = await context();
  await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } }); });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto('http://127.0.0.1:5173');
  await blockedPage.getByRole('alert').waitFor();
  ok('blocked browser storage surfaces an error instead of crashing the app');
  assert.deepEqual(errors, [], 'Uncaught page errors');
  ok('no uncaught JavaScript errors in tested flows');
  fs.writeFileSync(path.join(root, '.qa', 'regression-results.json'), JSON.stringify({ testedAt: new Date().toISOString(), passed, pageErrors: errors, externalRequests: process.env.ALLOW_MAP_TILES === '1' ? 'Only OpenStreetMap tiles allowed in addition to localhost' : 'Blocked deliberately; map tile service not validated', browser: await browser.version() }, null, 2));
  console.log('ALL', passed.length, 'BROWSER CHECKS PASSED');
})().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if(browser) await browser.close();
  for(const server of servers) server.close();
});


