const { launch, openPage, waitReady, sleep, path, SP } = require('./lib.cjs');
(async () => {
  const b = await launch();
  const page = await openPage(b, { vw: 1440, vh: 900, url: 'http://localhost:4660/', blockThird: true, suppressPopup: true });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => ['error', 'warning'].includes(m.type()) && errs.push(m.text()));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitReady(page); await sleep(2500);
  // glide band
  for (const y of [900, 1100, 1300, 1600]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(1200);
    console.log('glide', y, JSON.stringify(await page.evaluate(() => { const l = document.querySelector('[data-glide]'); const bd = l.querySelector('.glide__band'); const t = l.querySelector('.glide__titles'); return { band: getComputedStyle(bd).transform, titles: getComputedStyle(t).transform }; })));
  }
  // quote slider
  await page.evaluate(() => document.querySelector('[data-quote-frame]').scrollIntoView());
  await sleep(1000);
  const pos = () => page.evaluate(() => document.querySelector('.quote-frame__container').style.transform + ' | ' + [...document.querySelectorAll('.quote-frame__parallax')].map((p) => p.style.transform.match(/-?[\d.]+/)[0]).join(','));
  console.log('quote start', await pos());
  await page.evaluate(() => document.querySelector('[data-quote-frame] [data-next]').click()); await sleep(1200);
  console.log('quote next', await pos());
  await page.evaluate(() => document.querySelector('[data-quote-frame] [data-prev]').click()); await sleep(1200);
  console.log('quote prev', await pos());
  // quiz
  await page.evaluate(() => document.querySelector('[data-quiz]').scrollIntoView()); await sleep(800);
  await page.evaluate(() => document.querySelector('[data-quiz-toggle]').click()); await sleep(900);
  for (let i = 0; i < 3; i++) { await page.evaluate(() => document.querySelector('.quiz__option').click()); await sleep(500); }
  await sleep(900);
  console.log('quiz', JSON.stringify(await page.evaluate(() => ({ h: document.querySelector('[data-quiz-form]').style.height, result: document.querySelector('.quiz__result') ? document.querySelector('.quiz__result').textContent.replace(/\s+/g, ' ').slice(0, 120) : null }))));
  await page.screenshot({ path: path.join(SP, 'shots2', 'rep-home-quiz.png') });
  // icon accordion
  await page.evaluate(() => document.querySelector('[data-icon-text]').scrollIntoView({ block: 'center' })); await sleep(800);
  await page.evaluate(() => document.querySelectorAll('.icon-text__button')[1].click()); await sleep(900);
  console.log('icon', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('.icon-text__panel')].map((p) => p.style.height))));
  console.log('errors:', errs.length ? errs : 'none');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
