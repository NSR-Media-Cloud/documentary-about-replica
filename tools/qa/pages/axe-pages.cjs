// axe on several pages after scrolling through them (so lazy / animated content is in its final state):  node axe-pages.cjs <route-no-slash>,... [vw]
const { launch, openPage, waitReady, sleep } = require('./lib.cjs');
const routes = (process.argv[2] || '').split(',').map((r) => '/' + r.replace(/^\/+/, '').replace(/^.*Program Files\/Git\//, ''));
const vw = +(process.argv[3] || 1440);
(async () => {
  const b = await launch();
  for (const r of routes) {
    const p = await openPage(b, { vw, vh: vw <= 480 ? 844 : 900, url: 'http://localhost:4660' + (r === '/' ? '/' : r), blockThird: true, suppressPopup: true, mobile: vw <= 480 });
    await waitReady(p); await sleep(2500);
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(120); }
    await p.evaluate(() => window.scrollTo(0, 0)); await sleep(800);
    await p.addScriptTag({ path: require.resolve('axe-core') });
    const res = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes.slice(0, 3).map((n) => n.target.join(' ').slice(0, 70)) })));
    console.log(r.padEnd(34), res.length ? JSON.stringify(res) : 'no violations');
    await p.close();
  }
  await b.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
