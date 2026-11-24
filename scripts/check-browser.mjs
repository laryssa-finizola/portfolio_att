/* Optional browser QA. Reuses an installed Playwright; adds no runtime dependency.
   Never sends real e-mail (the contact API is mocked). */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, 'index.mjs')).href : 'playwright');

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3100';
const output = path.resolve('.qa');
fs.mkdirSync(output, { recursive: true });
const results = [];
async function check(name, callback) {
  if (process.env.PORTFOLIO_TEST_GROUP && !new RegExp(process.env.PORTFOLIO_TEST_GROUP).test(name)) return;
  await callback();
  results.push(name);
  console.log(`PASS ${name}`);
}
const until = (page, fn, arg) => page.waitForFunction(fn, arg, { timeout: 12000 });
async function noOverflow(page) {
  const size = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
  assert.ok(size.document <= size.width + 1, `horizontal overflow ${JSON.stringify(size)}`);
}

(async () => {
  const browser = await chromium.launch({ channel: process.env.PORTFOLIO_BROWSER || 'chrome', headless: true });
  const errors = [];
  const observe = (page) => {
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('503')) errors.push(m.text()); });
  };
  try {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await desktop.newPage();
    observe(page);
    await page.goto(base, { waitUntil: 'networkidle' });

    await check('document structure, SEO and structured data', async () => {
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('main').count(), 1);
      assert.match(await page.title(), /Laryssa Finizola/);
      assert.ok(await page.locator('meta[name="description"]').getAttribute('content'));
      assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
      const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      assert.equal(ld['@type'], 'ProfilePage');
      assert.equal(ld.mainEntity.name, 'Laryssa Finizola');
      for (const id of ['inicio', 'projetos', 'habilidades', 'trajetoria', 'contato']) assert.equal(await page.locator(`#${id}`).count(), 1, id);
      for (const link of await page.locator('a[target="_blank"]').all()) assert.match(await link.getAttribute('rel'), /noopener noreferrer/);
      assert.equal(await page.locator('video[src]').count(), 0, 'videos must not load before a request');
      assert.equal((await page.request.get(new URL('/robots.txt', base).href)).status(), 200);
      assert.equal((await page.request.get(new URL('/sitemap.xml', base).href)).status(), 200);
    });

    await check('projects: seven tiles, confirmed links only, every tile has an image', async () => {
      assert.equal(await page.locator('.tiles > li').count(), 7);
      assert.equal(await page.locator('.tiles img[alt=""]').count(), 0);
      assert.equal(await page.locator('.tiles .preview img').count(), 7);
      assert.equal(await page.getByRole('link', { name: /^LOOP 3D Studio/ }).getAttribute('href'), 'https://loop-3d-studio.vercel.app/');
      assert.equal(await page.getByRole('link', { name: /^Heloire/ }).getAttribute('href'), 'https://heloire.vercel.app/');
      assert.equal(await page.getByRole('link', { name: /^Challengefy/ }).getAttribute('href'), 'https://github.com/jrs-soft/challengefy-front');
      assert.equal(await page.getByRole('link', { name: /^Rodrigues Turismo/ }).getAttribute('href'), 'https://rodrigues-tour.vercel.app/');
      // Sem link público confirmado, o bloco não é clicável.
      assert.equal(await page.locator('[data-video-project="margem"]').evaluate((el) => el.closest('a')), null);
    });

    await check('reduced motion: hover keeps the poster, no video loads', async () => {
      const tile = page.locator('.tile', { has: page.locator('[data-video-project="loop"]') });
      await tile.scrollIntoViewIfNeeded();
      await tile.hover();
      await page.waitForTimeout(600);
      assert.equal(await page.locator('video[src]').count(), 0);
    });

    await check('hover and keyboard focus play the preview; leaving pauses it', async () => {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const p = await ctx.newPage();
      observe(p);
      await p.goto(base, { waitUntil: 'networkidle' });
      const tile = p.locator('.tile', { has: p.locator('[data-video-project="loop"]') });
      await tile.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await tile.hover();
      await until(p, () => document.querySelector('[data-video-project="loop"]').classList.contains('is-playing'));
      assert.ok(await tile.locator('video').evaluate((v) => v.muted && v.playsInline));
      await p.mouse.move(5, 5);
      await until(p, () => document.querySelector('[data-video-project="loop"] video').paused);
      await tile.locator('a').focus();
      await until(p, () => document.querySelector('[data-video-project="loop"]').classList.contains('is-playing'));
      await ctx.close();
    });

    await check('skill folders switch the detail panel', async () => {
      await page.getByRole('button', { name: 'Back-end' }).click();
      assert.equal(await page.getByRole('button', { name: 'Back-end' }).getAttribute('aria-pressed'), 'true');
      assert.ok((await page.locator('#labInsight').innerText()).includes('Back-end'));
      await page.getByRole('button', { name: 'NestJS' }).click();
      assert.ok((await page.locator('#labInsight').innerText()).includes('NestJS'));
    });

    await check('contact form success and error (mocked), copy e-mail, API validation', async () => {
      await page.locator('#contato').scrollIntoViewIfNeeded();
      const fill = async () => {
        await page.getByRole('textbox', { name: 'Nome' }).fill('Pessoa Teste');
        await page.getByRole('textbox', { name: 'E-mail' }).fill('person@example.test');
        await page.getByRole('textbox', { name: 'Mensagem' }).fill('Mensagem de teste local.');
        await page.getByRole('button', { name: /Enviar mensagem/ }).click();
      };
      await page.route('**/api/contact', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"userEmailSent":true}' }));
      await fill();
      await until(page, () => document.querySelector('.contact-form-status').textContent.includes('Mensagem enviada'));
      await page.unroute('**/api/contact');
      await page.route('**/api/contact', (route) => route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false}' }));
      await fill();
      await until(page, () => document.querySelector('.contact-form-status').textContent.includes('Não foi possível'));
      await page.unroute('**/api/contact');
      await page.getByRole('button', { name: 'Copiar e-mail' }).click();
      await until(page, () => document.querySelector('.contact-copy-status').textContent.length > 0);
      const invalid = await page.request.post(new URL('/api/contact', base).href, { data: { name: 'x', email: 'bad', message: 'short' } });
      assert.equal(invalid.status(), 400);
    });

    await check('theme toggle switches and persists', async () => {
      await page.getByRole('button', { name: 'Alternar tema claro/escuro' }).click();
      const first = await page.locator('html').getAttribute('class');
      await page.reload();
      assert.equal(await page.locator('html').getAttribute('class'), first);
      await page.getByRole('button', { name: 'Alternar tema claro/escuro' }).click();
    });

    await check('desktop has no horizontal overflow', async () => { await noOverflow(page); });
    await page.screenshot({ path: path.join(output, 'desktop.png'), fullPage: true });
    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const phone = await mobile.newPage();
    observe(phone);
    await phone.goto(base, { waitUntil: 'networkidle' });
    await check('mobile menu opens, navigates, closes with Escape; no overflow', async () => {
      await noOverflow(phone);
      const toggle = phone.locator('.menu-toggle');
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await phone.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await toggle.click();
      await phone.locator('#navLinks a[href="#habilidades"]').click();
      await until(phone, () => location.hash === '#habilidades');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await noOverflow(phone);
    });
    await phone.screenshot({ path: path.join(output, 'mobile.png'), fullPage: true });
    await mobile.close();

    assert.deepEqual(errors, [], 'Browser runtime/console errors');
    fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify({ base, passed: results }, null, 2));
    console.log(`${results.length} browser groups passed; no runtime or console errors.`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
