/* Optional browser QA. Reuses an installed Playwright; adds no runtime dependency. */
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
async function until(page, callback) { await page.waitForFunction(callback, null, { timeout: 12000 }); }
async function settled(page) { await page.waitForTimeout(450); }
async function scrollTo(page, selector) {
  await page.locator(selector).first().evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await settled(page);
}
async function noOverflow(page) {
  const size = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
  assert.ok(size.document <= size.width + 1, JSON.stringify(size));
}

(async () => {
  const browser = await chromium.launch({ channel: process.env.PORTFOLIO_BROWSER || 'chrome', headless: true });
  const errors = [];
  try {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark', permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await desktop.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(base);
    assert.equal(response.status(), 200);
    await page.locator('.layer-button').first().waitFor();
    await settled(page);

    await check('SSR, seven projects, confirmed links and no removed projects', async () => {
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('main').count(), 1);
      assert.equal(await page.locator('article.project-card').count(), 7);
      const text = await page.locator('main').innerText();
      assert.ok(!/EvoluTEA|Snippet.?Box|Motiva Handball/i.test(text));
      assert.equal(await page.locator('video[src]').count(), 0);
      assert.equal(await page.getByRole('link', { name: 'Ver site: LOOP 3D Studio', exact: true }).getAttribute('href'), 'https://loop-3d-studio.vercel.app/');
      assert.equal(await page.getByRole('link', { name: 'Ver site: Heloire', exact: true }).getAttribute('href'), 'https://heloire.vercel.app/');
      for (const link of await page.locator('a[target="_blank"]').all()) assert.match(await link.getAttribute('rel'), /noopener noreferrer/);
      const profile = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      assert.equal(profile.name, 'Laryssa Finizola');
      assert.ok(!JSON.stringify(profile).includes('seu-'));
    });
    await check('CSS 3D layers, keyboard, drag and reset', async () => {
      await page.getByRole('button', { name: '02 API', exact: true }).click();
      assert.match(await page.locator('#layerDescription').textContent(), /Regras/);
      const model = page.locator('.stack-model');
      const before = await model.getAttribute('style');
      await page.locator('.architecture-scene').focus();
      await page.keyboard.press('ArrowRight');
      await settled(page);
      assert.notEqual(await model.getAttribute('style'), before);
      await page.keyboard.press('3');
      assert.equal(await page.locator('.layer-controls').getByRole('button', { name: '03 Dados', exact: true }).getAttribute('aria-pressed'), 'true');
      const bounds = await page.locator('.architecture-scene').boundingBox();
      const beforeDrag = await model.getAttribute('style');
      await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      await page.mouse.down();
      await page.mouse.move(bounds.x + bounds.width / 2 + 80, bounds.y + bounds.height / 2 + 25, { steps: 5 });
      await page.mouse.up();
      await settled(page);
      assert.notEqual(await model.getAttribute('style'), beforeDrag);
      await page.getByRole('button', { name: 'Restaurar vista' }).click();
      await settled(page);
      assert.match(await model.getAttribute('style'), /-28deg/);
    });
    await page.screenshot({ path: path.join(output, 'desktop-dark.png') });

    await check('theme switch persists after reload', async () => {
      await page.getByRole('button', { name: 'Alternar tema claro/escuro' }).click();
      assert.match(await page.locator('html').getAttribute('class'), /light/);
      await page.reload();
      assert.match(await page.locator('html').getAttribute('class'), /light/);
      await page.screenshot({ path: path.join(output, 'desktop-light.png') });
      await page.getByRole('button', { name: 'Alternar tema claro/escuro' }).click();
    });
    await check('project filters return 3, 2, 2 and 7 cards', async () => {
      for (const [name, count] of [['Landing pages', 3], ['Produtos digitais', 2], ['Repositórios', 2], ['Todos', 7]]) {
        await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
        assert.equal(await page.locator('article.project-card').count(), count);
      }
    });
    await check('all seven case dialogs, focus containment, Escape and return focus', async () => {
      for (const name of ['LOOP 3D Studio', 'Heloire', 'Margem', 'Alinhora', 'Rodrigues Turismo', 'Challengefy', 'Fullstackfy']) {
        const trigger = page.getByRole('button', { name: `Bastidores de ${name}`, exact: true });
        await trigger.click();
        await page.locator('dialog[open]').waitFor({ state: 'visible' });
        assert.equal(await page.locator('dialog[open]').count(), 1);
        assert.equal(await page.locator('dialog').getByRole('heading', { name, exact: true }).count(), 1);
        await page.keyboard.press('Shift+Tab');
        assert.ok(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)));
        for (let i = 0; i < 4; i++) {
          await page.keyboard.press('Tab');
          assert.ok(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)));
        }
        await page.keyboard.press('Escape');
        await page.waitForFunction(label => document.activeElement?.getAttribute('aria-label') === label, `Bastidores de ${name}`);
        assert.equal(await page.locator('dialog[open]').count(), 0);
        assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
      }
    });
    await check('real muted video, explicit pause, one player and offscreen pause', async () => {
      await scrollTo(page, '[data-video-project="loop"]');
      const frame = page.locator('[data-video-project="loop"]');
      await frame.hover();
      await until(page, () => [...document.querySelectorAll('video')].some(v => !v.paused && v.currentTime > 0));
      assert.match(await frame.locator('video').getAttribute('src'), /loop-preview\.mp4$/);
      assert.ok(await frame.locator('video').evaluate(v => v.muted && v.playsInline));
      await until(page, () => getComputedStyle(document.querySelector('[data-video-project="loop"] .preview-poster')).opacity === '0');
      assert.equal(await frame.locator('.preview-poster').evaluate(el => getComputedStyle(el).opacity), '0');
      await frame.getByRole('button', { name: 'Pausar prévia de LOOP 3D Studio' }).click();
      await page.mouse.move(2, 200);
      await frame.hover();
      await settled(page);
      assert.ok(await frame.locator('video').evaluate(v => v.paused));
      await frame.getByRole('button', { name: 'Reproduzir prévia de LOOP 3D Studio' }).click();
      await until(page, () => !document.querySelector('[data-video-project="loop"] video').paused);
      await scrollTo(page, '[data-video-project="heloire"]');
      await page.locator('[data-video-project="heloire"]').hover();
      await until(page, () => !document.querySelector('[data-video-project="heloire"] video').paused);
      assert.equal(await page.locator('video').evaluateAll(videos => videos.filter(v => !v.paused).length), 1);
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await until(page, () => [...document.querySelectorAll('video')].every(v => v.paused));
      await page.evaluate(() => { delete document.hidden; });
      await scrollTo(page, '#laboratorio');
      await until(page, () => [...document.querySelectorAll('video')].every(v => v.paused));
    });
    await check('four laboratory groups and individual technologies', async () => {
      for (const [label, core] of [['Front-end', 'UI'], ['Back-end', 'API'], ['Dados', 'DB'], ['Ferramentas e arquitetura', 'DEV']]) {
        await page.locator('.lab-tab').filter({ hasText: label }).click();
        assert.equal(await page.locator('.orbit-center b').textContent(), core);
        await page.locator('.orbit-node').first().click();
        assert.equal(await page.locator('.orbit-node[aria-pressed="true"]').count(), 1);
        assert.ok((await page.locator('.lab-detail-title').textContent()).includes('·'));
      }
      await page.locator('.lab-grid').screenshot({ path: path.join(output, 'laboratory.png') });
    });
    await check('copy email and contact success/error with mocked delivery only', async () => {
      await page.getByRole('button', { name: 'Copiar e-mail' }).click();
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'laryssafinizoladev@gmail.com');
      await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, userEmailSent: false }) }));
      await page.getByLabel('Nome', { exact: true }).fill('Teste local');
      await page.getByLabel('E-mail', { exact: true }).fill('teste@example.com');
      await page.getByLabel('Mensagem', { exact: true }).fill('Mensagem de validação local, sem envio real.');
      await page.getByRole('button', { name: 'Enviar mensagem' }).click();
      await until(page, () => document.querySelector('.contact-form-status').textContent.includes('Mensagem enviada'));
      assert.equal(await page.getByLabel('Nome', { exact: true }).inputValue(), '');
      await page.unroute('**/api/contact');
      await page.route('**/api/contact', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false}' }));
      await page.getByLabel('Nome', { exact: true }).fill('Teste local');
      await page.getByLabel('E-mail', { exact: true }).fill('teste@example.com');
      await page.getByLabel('Mensagem', { exact: true }).fill('Mensagem de validação local, sem envio real.');
      await page.getByRole('button', { name: 'Enviar mensagem' }).click();
      await until(page, () => document.querySelector('.contact-form-status').textContent.includes('Não foi possível'));
      await page.unroute('**/api/contact');
    });
    await check('responsive widths 320, 375, 768, 1024, 1440 and 1920', async () => {
      for (const width of [320, 375, 768, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        for (const selector of ['#inicio', '#projetos', '#laboratorio', '#sobre', '#contato']) {
          await scrollTo(page, selector);
          await noOverflow(page);
        }
      }
    });

    const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, colorScheme: 'dark' });
    const phone = await mobile.newPage();
    phone.on('pageerror', error => errors.push(error.message));
    await phone.goto(base);
    await settled(phone);
    await check('mobile keyboard menu, section navigation and active indication', async () => {
      const menu = phone.getByRole('button', { name: 'Abrir menu' });
      await menu.focus(); await phone.keyboard.press('Enter'); await settled(phone);
      assert.equal(await phone.getByRole('link', { name: 'Projetos', exact: true }).evaluate(el => el === document.activeElement), true);
      await phone.keyboard.press('Escape');
      assert.equal(await menu.evaluate(el => el === document.activeElement), true);
      await menu.click();
      await phone.getByRole('link', { name: 'Projetos', exact: true }).click();
      await phone.waitForTimeout(900);
      assert.equal(await phone.getByRole('button', { name: 'Abrir menu' }).getAttribute('aria-expanded'), 'false');
      assert.equal(await phone.locator('#navLinks a[href="#projetos"]').getAttribute('aria-current'), 'location');
      await noOverflow(phone);
    });
    await check('mobile viewport video and pause preference survives filtering', async () => {
      await scrollTo(phone, '[data-video-project="loop"]');
      await until(phone, () => !document.querySelector('[data-video-project="loop"] video').paused);
      await phone.getByRole('button', { name: 'Pausar prévia de LOOP 3D Studio' }).click();
      await phone.getByRole('button', { name: /^Repositórios/ }).click();
      await phone.getByRole('button', { name: /^Todos/ }).click();
      await scrollTo(phone, '[data-video-project="loop"]');
      assert.ok(await phone.locator('[data-video-project="loop"] video').evaluate(v => v.paused && !v.getAttribute('src')));
      await phone.getByRole('button', { name: 'Reproduzir prévia de LOOP 3D Studio' }).click();
      await until(phone, () => !document.querySelector('[data-video-project="loop"] video').paused);
      assert.equal(await phone.locator('video').evaluateAll(videos => videos.filter(v => !v.paused).length), 1);
      await phone.locator('article.project-card').first().screenshot({ path: path.join(output, 'mobile-feature.png') });
    });
    await phone.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await phone.screenshot({ path: path.join(output, 'mobile-hero.png') });

    for (const preference of ['reduced-motion', 'save-data', 'slow-network']) {
      await check(`${preference} disables automatic video loading`, async () => {
        const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, reducedMotion: preference === 'reduced-motion' ? 'reduce' : 'no-preference' });
        if (preference !== 'reduced-motion') await context.addInitScript(value => {
          const connection = new EventTarget();
          connection.saveData = value === 'save-data';
          connection.effectiveType = value === 'slow-network' ? '2g' : '4g';
          Object.defineProperty(navigator, 'connection', { configurable: true, value: connection });
        }, preference);
        const reduced = await context.newPage();
        await reduced.goto(base); await settled(reduced);
        if (preference === 'reduced-motion') {
          assert.equal(await reduced.locator('.scene-simple').count(), 1);
          await reduced.getByRole('button', { name: '02 API', exact: true }).click();
          assert.match(await reduced.locator('#layerDescription').textContent(), /Regras/);
        }
        await scrollTo(reduced, '[data-video-project="loop"]');
        assert.equal(await reduced.locator('video[src]').count(), 0);
        await reduced.getByRole('button', { name: 'Reproduzir prévia de LOOP 3D Studio' }).click();
        await until(reduced, () => !document.querySelector('[data-video-project="loop"] video').paused);
        await context.close();
      });
    }
    await check('media failure keeps poster and accessible unavailable label', async () => {
      const context = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
      const fallback = await context.newPage();
      await fallback.route('**/*-preview.mp4', route => route.abort());
      await fallback.goto(base);
      await fallback.getByRole('button', { name: 'Reproduzir prévia de LOOP 3D Studio' }).click();
      await until(fallback, () => document.querySelector('[data-video-project="loop"] button').disabled);
      assert.equal(await fallback.locator('[data-video-project="loop"] .preview-poster').evaluate(el => getComputedStyle(el).opacity), '1');
      assert.match(await fallback.locator('[data-video-project="loop"] button').getAttribute('aria-label'), /indisponível/);
      await context.close();
    });
    assert.deepEqual(errors, [], 'Browser runtime errors');
    fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify({ base, passed: results, runtimeErrors: errors }, null, 2));
    console.log(`${results.length} browser groups passed; no runtime errors.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
