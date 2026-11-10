// Loads every built replica page and reports console errors/warnings, failed requests and the document height.
const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
const norm = (r) => '/' + r.split('Program Files/Git/').pop().replace(/^\/+/, '');
const ROUTES = process.argv[2] ? process.argv[2].split(',').map(norm) : [
  '/', '/about', '/contact', '/courses', '/certification', '/frequently-asked-questions', '/legals/terms-of-use', '/legals/privacy-policy',
  '/courses/nonfiction-foundations', '/courses/advanced-storytelling', '/courses/make-and-sell', '/courses/the-final-cut', '/courses/the-roving-eye', '/courses/field-notes-pro', '/courses/producing-essentials',
  '/modules/craft-lab', '/modules/maker-toolkit', '/modules/guest-sessions', '/funding', '/enterprise', '/short-documentary-competition', '/the-rta-accelerator', '/courses/short-film-playbook', '/does-not-exist',
];
const vw = +(process.argv[3] || 1440);
(async () => {
  const browser = await launch();
  let bad = 0;
  for (const r of ROUTES) {
    const page = await openPage(browser, { vw, vh: vw <= 480 ? 844 : 900, url: 'http://localhost:4660' + r, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
    const msgs = [], failed = [];
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) msgs.push(m.text().slice(0, 140)); });
    page.on('pageerror', (e) => msgs.push('pageerror ' + String(e.message).slice(0, 140)));
    page.on('response', (res) => { if (res.status() >= 400 && !/does-not-exist/.test(res.url())) failed.push(res.status() + ' ' + res.url().replace('http://localhost:4660', '')); });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitReady(page); await sleep(2200);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.evaluate((hh) => window.scrollTo(0, hh), h); await sleep(900);
    const ok = !msgs.length && !failed.length;
    if (!ok) bad++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${r.padEnd(36)} h=${h}${msgs.length ? '  console: ' + msgs.slice(0, 2).join(' | ') : ''}${failed.length ? '  failed: ' + failed.slice(0, 3).join(' ') : ''}`);
    await page.close();
  }
  console.log(bad ? `${bad} page(s) with problems` : 'all pages clean');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
