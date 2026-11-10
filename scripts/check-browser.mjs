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
async function scrollSettled(page) {
  await page.evaluate(() => new Promise(resolve => {
    let previous = window.scrollY;
    let stableFrames = 0;
    const inspect = () => {
      if (window.scrollY === previous) stableFrames += 1;
      else { previous = window.scrollY; stableFrames = 0; }
      if (stableFrames >= 8) resolve();
      else requestAnimationFrame(inspect);
    };
    requestAnimationFrame(inspect);
  }));
}
async function scrollTo(page, selector) {
  await page.locator(selector).first().evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await settled(page);
}
async function noOverflow(page) {
  const size = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
  assert.ok(size.document <= size.width + 1, JSON.stringify(size));
}
async function expandProjects(page) {
  const toggle = page.getByRole('button', { name: /Explorar mais projetos/ });
  if (await toggle.count()) await toggle.click();
}

(async () => {
  const browser = await chromium.launch({ channel: process.env.PORTFOLIO_BROWSER || 'chrome', headless: true });
  const errors = [];
  const consoleErrors = [];
  const mediaResponses = [];
  function observe(page, { expectedResourceFailure = false } = {}) {
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && !expectedResourceFailure && !message.text().includes('503 (Service Unavailable)')) {
        consoleErrors.push(message.text());
      }
    });
    page.on('response', response => {
      if (/\/portfolio\/assets\/.*\.(mp4|webp)(?:\?|$)/.test(response.url())) {
        mediaResponses.push({ url: response.url(), status: response.status() });
      }
    });
  }
  try {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark', permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await desktop.newPage();
    observe(page);
    const response = await page.goto(base);
    assert.equal(response.status(), 200);
    await page.locator('article.project-card').first().waitFor();
    await settled(page);

    await check('SSR, three highlights, confirmed links and no provisional downloads', async () => {
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('main').count(), 1);
      assert.equal(await page.locator('article.project-card').count(), 3);
      const text = await page.locator('#projetos').innerText();
      assert.ok(!/EvoluTEA|Snippet.?Box|Motiva Handball/i.test(text));
      assert.equal(await page.locator('video[src]').count(), 0);
      assert.equal(await page.locator('a[href$=".pdf"], a[href*="PREVIA_INTERATIVA"]').count(), 0);
      assert.equal(fs.existsSync('public/curriculo-laryssa-finizola.pdf'), false);
      assert.equal(fs.existsSync('public/PREVIA_INTERATIVA.html'), false);
      assert.equal(await page.getByRole('link', { name: 'Ver site: LOOP 3D Studio', exact: true }).getAttribute('href'), 'https://loop-3d-studio.vercel.app/');
      assert.equal(await page.getByRole('link', { name: 'Ver site: Heloire', exact: true }).getAttribute('href'), 'https://heloire.vercel.app/');
      for (const link of await page.locator('a[target="_blank"]').all()) assert.match(await link.getAttribute('rel'), /noopener noreferrer/);
      const profile = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      assert.equal(profile.name, 'Laryssa Finizola');
      assert.ok(!JSON.stringify(profile).includes('seu-'));
    });
    await page.screenshot({ path: path.join(output, 'desktop-dark.png') });

    await check('theme switch persists after reload', async () => {
      await page.getByRole('button', { name: 'Alternar tema claro/escuro' }).click();
      await until(page, () => document.documentElement.classList.contains('light'));
      assert.match(await page.locator('html').getAttribute('class'), /light/);
      await page.reload();
      assert.match(await page.locator('html').getAttribute('class'), /light/);
      await page.screenshot({ path: path.join(output, 'desktop-light.png') });
      await page.getByRole('button', { name: 'Alternar tema claro/escuro' }).click();
      await until(page, () => document.documentElement.classList.contains('dark'));
    });
    await check('more projects expands to seven and collapses to three', async () => {
      await expandProjects(page);
      assert.equal(await page.locator('article.project-card').count(), 7);
      await page.getByRole('button', { name: /Recolher projetos/ }).click();
      assert.equal(await page.locator('article.project-card').count(), 3);
      await expandProjects(page);
      assert.equal(await page.locator('article.project-card').count(), 7);
    });
    await check('removed laboratory panel and scene are absent, contact CTA targets contact', async () => {
      assert.equal(await page.locator('#laboratorio, .lab-drawer, .architecture-scene, .skill-orbit, .orbit-node').count(), 0);
      assert.equal(await page.getByText('Explorar laboratório interativo', { exact: false }).count(), 0);
      assert.equal(await page.getByRole('link', { name: 'Converse comigo', exact: true }).getAttribute('href'), '#contato');
    });
    await check('project filters return 3, 2, 2 and 7 cards', async () => {
      await expandProjects(page);
      for (const [name, count] of [['Landing pages', 3], ['Produtos digitais', 2], ['Repositórios', 2], ['Todos', 7]]) {
        await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
        assert.equal(await page.locator('article.project-card').count(), count);
      }
    });
    await check('all seven case dialogs, focus containment, Escape and return focus', async () => {
      await expandProjects(page);
      for (const name of ['LOOP 3D Studio', 'Heloire', 'Margem', 'Alinhora', 'Rodrigues Turismo', 'Challengefy', 'Fullstackfy']) {
        const trigger = page.getByRole('button', { name: `Bastidores de ${name}`, exact: true });
        await trigger.click();
        await page.locator('dialog[open]').waitFor({ state: 'visible' });
        assert.equal(await page.locator('dialog[open]').count(), 1);
        assert.equal(await page.locator('dialog').getByRole('heading', { name, exact: true }).count(), 1);
        await page.locator('#dialogDescription').click();
        assert.equal(await page.locator('dialog[open]').count(), 1, 'Dialog content must not close the dialog');
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
      await scrollTo(page, '#habilidades');
      await until(page, () => [...document.querySelectorAll('video')].every(v => v.paused));
    });
    await check('five skill folders and individual technology chips', async () => {
      assert.equal(await page.locator('.skill-folder').count(), 5);
      for (const label of ['Front-end', 'Back-end', 'Dados', 'Ferramentas e arquitetura', 'Design & UI']) {
        const folder = page.locator('.skill-folder').filter({ hasText: label });
        await folder.click();
        assert.equal(await folder.getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('.skill-folder[aria-pressed="true"]').count(), 1);
        assert.ok(await page.locator('.skill-tag').count() >= 4);
        for (const chip of await page.locator('.skill-tag').all()) {
          await chip.focus();
          await page.keyboard.press('Enter');
          assert.equal(await chip.getAttribute('aria-pressed'), 'true');
          assert.equal(await page.locator('.skill-tag[aria-pressed="true"]').count(), 1);
          assert.ok((await page.locator('.lab-detail-title').textContent()).includes('·'));
        }
      }
      await page.locator('.skills-main').screenshot({ path: path.join(output, 'skills.png') });
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
        for (const selector of ['#inicio', '#projetos', '#sobre', '#experiencia', '#habilidades', '#contato']) {
          await scrollTo(page, selector);
          await noOverflow(page);
        }
      }
    });

    await check('all anchor targets, local routes and preserved contact channels', async () => {
      const missing = await page.locator('a[href^="#"]').evaluateAll(links => links
        .map(link => link.getAttribute('href')).filter(href => href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1)))));
      assert.deepEqual(missing, []);
      assert.equal(await page.locator('a[href="tel:+5583921497340"]').count(), 1);
      assert.ok((await page.locator('#contato').innerText()).includes('Campina Grande'));
      for (const [name, href] of [['Challengefy', 'https://github.com/jrs-soft/challengefy-front'], ['Fullstackfy', 'https://github.com/jrs-soft/fullstackfy-front']]) {
        assert.equal(await page.getByRole('link', { name: `Ver repositório: ${name}`, exact: true }).getAttribute('href'), href);
      }
      assert.equal((await page.request.get(new URL('/favicon.ico', base).href)).status(), 200);
      assert.equal((await page.request.get(new URL('/api/contact', base).href)).status(), 405);
      const invalid = await page.request.post(new URL('/api/contact', base).href, {
        headers: { 'Content-Type': 'application/json' }, data: '{',
      });
      assert.equal(invalid.status(), 400, 'Malformed input must fail before provider delivery');
    });

    await check('desktop navigation and contact CTA work with click and Enter', async () => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      for (const id of ['sobre', 'experiencia', 'sobre', 'projetos', 'habilidades', 'contato']) {
        await page.locator(`#navLinks a[href="#${id}"]`).click();
        await scrollSettled(page);
        await page.waitForFunction(target => document.querySelector(`#navLinks a[href="#${target}"]`)?.getAttribute('aria-current') === 'location', id);
        assert.equal(new URL(page.url()).hash, `#${id}`);
      }
      for (const method of ['click', 'Enter']) {
        await page.locator('.brand').click();
        await scrollSettled(page);
        const contactLink = page.getByRole('link', { name: 'Converse comigo', exact: true });
        if (method === 'click') await contactLink.click();
        else { await contactLink.focus(); await page.keyboard.press('Enter'); }
        await scrollSettled(page);
        assert.equal(new URL(page.url()).hash, '#contato');
        assert.equal(await page.locator('#navLinks a[href="#contato"]').getAttribute('aria-current'), 'location');
      }
    });

    await check('hero, portrait, illustration and all project images decode', async () => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      const images = page.locator('main img');
      assert.ok(await images.count() >= 9);
      for (const image of await images.all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(async el => { await el.decode(); });
        assert.ok(await image.evaluate(el => el.complete && el.naturalWidth > 0));
        assert.ok((await image.getAttribute('alt'))?.length > 0);
      }
      const sources = await images.evaluateAll(elements => elements.map(el => el.getAttribute('src')).join(' '));
      assert.match(sources, /hero-dino/);
      assert.match(sources, /about-illustration/);
      assert.match(sources, /profile-pic/);
    });

    await check('all six videos load and decode only after explicit intent', async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const videos = await context.newPage();
      observe(videos);
      try {
        await videos.goto(base);
        await settled(videos);
        await expandProjects(videos);
        assert.equal(await videos.locator('video').count(), 6);
        assert.equal(await videos.locator('video[src]').count(), 0);
        for (const title of ['LOOP 3D Studio', 'Heloire', 'Margem', 'Alinhora', 'Rodrigues Turismo', 'Fullstackfy']) {
          const play = videos.getByRole('button', { name: `Reproduzir prévia de ${title}`, exact: true });
          await play.click();
          await videos.waitForFunction(name => {
            const button = document.querySelector(`button[aria-label="Pausar prévia de ${name}"]`);
            const video = button?.closest('[data-video-project]')?.querySelector('video');
            return video && !video.paused && video.currentTime > 0 && video.readyState >= 2 && video.videoWidth > 0;
          }, title, { timeout: 12000 });
          assert.equal(await videos.locator('video').evaluateAll(elements => elements.filter(el => !el.paused).length), 1);
          await videos.getByRole('button', { name: `Pausar prévia de ${title}`, exact: true }).click();
        }
        assert.ok(await videos.locator('video').evaluateAll(elements => elements.every(el => el.muted && el.playsInline && el.preload === 'none')));
      } finally { await context.close(); }
    });

    const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, colorScheme: 'dark' });
    const phone = await mobile.newPage();
    observe(phone);
    await phone.goto(base);
    await settled(phone);
    await check('mobile keyboard menu, section navigation and active indication', async () => {
      const menu = phone.getByRole('button', { name: 'Abrir menu' });
      await menu.focus(); await phone.keyboard.press('Enter'); await settled(phone);
      assert.equal(await phone.locator('#navLinks a').first().evaluate(el => el === document.activeElement), true);
      await phone.keyboard.press('Escape');
      assert.equal(await menu.evaluate(el => el === document.activeElement), true);
      await menu.click();
      await phone.getByRole('link', { name: 'Projetos', exact: true }).click();
      await phone.waitForTimeout(900);
      assert.equal(await phone.getByRole('button', { name: 'Abrir menu' }).getAttribute('aria-expanded'), 'false');
      assert.equal(await phone.locator('#navLinks a[href="#projetos"]').getAttribute('aria-current'), 'location');
      await noOverflow(phone);
      for (const method of ['click', 'Enter']) {
        await phone.locator('.brand').click();
        await scrollSettled(phone);
        const contactLink = phone.getByRole('link', { name: 'Converse comigo', exact: true });
        assert.equal(await contactLink.getAttribute('href'), '#contato');
        if (method === 'click') await contactLink.click();
        else { await contactLink.focus(); await phone.keyboard.press('Enter'); }
        await scrollSettled(phone);
        assert.equal(new URL(phone.url()).hash, '#contato');
        assert.equal(await phone.locator('#navLinks a[href="#contato"]').getAttribute('aria-current'), 'location');
      }
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
        observe(reduced);
        await reduced.goto(base); await settled(reduced);
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
      observe(fallback, { expectedResourceFailure: true });
      await fallback.route('**/*-preview.mp4', route => route.abort());
      await fallback.goto(base);
      await settled(fallback);
      await fallback.getByRole('button', { name: 'Reproduzir prévia de LOOP 3D Studio' }).click();
      await until(fallback, () => document.querySelector('[data-video-project="loop"] button').disabled);
      assert.equal(await fallback.locator('[data-video-project="loop"] .preview-poster').evaluate(el => getComputedStyle(el).opacity), '1');
      assert.match(await fallback.locator('[data-video-project="loop"] button').getAttribute('aria-label'), /indisponível/);
      await context.close();
    });
    assert.deepEqual(errors, [], 'Browser runtime errors');
    assert.deepEqual(consoleErrors, [], 'Unexpected browser console errors');
    assert.ok(mediaResponses.every(response => response.status < 400), 'Project media HTTP errors');
    fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify({ base, passed: results, runtimeErrors: errors, consoleErrors, mediaResponses }, null, 2));
    console.log(`${results.length} browser groups passed; no runtime or unexpected console errors.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
