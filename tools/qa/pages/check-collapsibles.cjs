// Collapsible panels (quiz, icon list) at both widths: height of the form per step, the open/close end states, and that the closed page height is unchanged.
const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
(async () => {
  const b = await launch();
  for (const vw of [1440, 390]) {
    const p = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: 'http://localhost:4660/', blockThird: true, suppressPopup: true, mobile: vw <= 480 });
    await p.evaluate(() => { try { sessionStorage.setItem('rta-seen', '1'); } catch (e) {} });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.reload({ waitUntil: 'domcontentloaded' }); await waitReady(p); await sleep(2000);
    const h0 = await p.evaluate(() => document.documentElement.scrollHeight);
    const formH = () => p.evaluate(() => Math.round(document.querySelector('[data-quiz-form]').getBoundingClientRect().height));
    await p.evaluate(() => document.querySelector('[data-quiz]').scrollIntoView({ block: 'start' })); await sleep(700);
    console.log(vw, 'closed: page', h0, 'form', await formH());
    await p.evaluate(() => document.querySelector('[data-quiz-toggle]').click()); await sleep(1100);
    const steps = [await formH()];
    for (let i = 0; i < 3; i++) { await p.evaluate(() => document.querySelector('.quiz__option').click()); await sleep(450); steps.push(await formH()); }
    console.log(vw, 'form height per step (q1,q2,q3,result):', steps.join(' / '), ' result card text:', (await p.evaluate(() => document.querySelector('.quiz__result') && document.querySelector('.quiz__result h3').textContent)));
    await p.evaluate(() => document.querySelector('[data-quiz-toggle]').click()); await sleep(1100);
    console.log(vw, 'closed again: form', await formH(), 'page', await p.evaluate(() => document.documentElement.scrollHeight), 'inert', await p.evaluate(() => document.querySelector('[data-quiz-form]').hasAttribute('inert')));
    // icon list: open tab 1, then tab 3; widths change -> open panel must follow its text
    await p.evaluate(() => document.querySelector('[data-icon-text]').scrollIntoView({ block: 'center' })); await sleep(600);
    const panelH = () => p.evaluate(() => [...document.querySelectorAll('.icon-text__panel')].map((e) => Math.round(e.getBoundingClientRect().height)).join(','));
    console.log(vw, 'icon panels closed:', await panelH());
    await p.evaluate(() => document.querySelectorAll('.icon-text__button')[0].click()); await sleep(1000);
    console.log(vw, 'tab1 open:', await panelH());
    await p.evaluate(() => document.querySelectorAll('.icon-text__button')[2].click()); await sleep(1000);
    console.log(vw, 'tab3 open (tab1 closed):', await panelH());
    if (vw === 1440) { await p.setViewport({ width: 700, height: 900 }); await sleep(900); console.log(vw, 'after resize to 700px wide, tab3 panel follows its text:', await panelH(), 'scrollHeight of body inside', await p.evaluate(() => Math.round(document.querySelectorAll('.icon-text__tab-body')[2].scrollHeight))); }
    console.log(vw, 'errors:', errs.length ? errs : 'none');
    await p.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
