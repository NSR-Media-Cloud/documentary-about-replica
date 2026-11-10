const { launch, openPage, waitReady, sleep, path, SP } = require('./lib.cjs');
(async () => {
  const b = await launch();
  const errs = [];
  for (const vw of [1440, 390]) {
    const page = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: 'http://localhost:4660/about', blockThird: true, suppressPopup: true, mobile: vw <= 480 });
    page.on('pageerror', (e) => errs.push(vw + ' ' + e.message));
    await page.evaluate(() => { try { sessionStorage.clear(); } catch (e) {} });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitReady(page); await sleep(2500);
    const seen1 = await page.evaluate(() => sessionStorage.getItem('rta-seen'));
    console.log(vw, 'first load: preloader gone?', await page.evaluate(() => !document.querySelector('#pre-wrapper')), 'seen flag', seen1);
    // click an internal link: expect cover then navigation
    await page.evaluate(() => { const a = [...document.querySelectorAll('a')].find((x) => x.getAttribute('href') === '/courses'); a.click(); });
    await sleep(250);
    const mid = await page.evaluate(() => ({ running: document.querySelector('#transition').classList.contains('is-running'), col: getComputedStyle(document.querySelector('.transition__col')).transform.slice(0, 28), wipe: getComputedStyle(document.querySelector('.transition__wipe')).transform.slice(0, 28) }));
    console.log(vw, 'mid-cover', JSON.stringify(mid));
    await page.screenshot({ path: path.join(SP, 'shots2', 'tr-mid-' + vw + '.jpg'), type: 'jpeg', quality: 60 });
    await page.waitForFunction(() => location.pathname === '/courses', { timeout: 8000 }).catch(() => {});
    await sleep(150);
    const early = await page.evaluate(() => ({ path: location.pathname, cover: document.documentElement.classList.contains('tr-cover'), pre: !!document.querySelector('#pre-wrapper') }));
    console.log(vw, 'after navigation (early)', JSON.stringify(early));
    await sleep(2800);
    const late = await page.evaluate(() => ({ cover: document.documentElement.classList.contains('tr-cover'), ready: document.documentElement.classList.contains('is-ready'), running: document.querySelector('#transition').classList.contains('is-running'), h: document.documentElement.scrollHeight }));
    console.log(vw, 'after reveal', JSON.stringify(late));
    await page.close();
  }
  console.log('errors:', errs.length ? errs : 'none');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
