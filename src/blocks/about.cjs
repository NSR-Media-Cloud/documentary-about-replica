'use strict';
// The four blocks that make up the About page (and scroll text, which other pages reuse).
const { esc, pic } = require('../util.cjs');

const heroFlying = (p) => `  <header class="hero" id="top">
    <div class="hero__sticky">
      <div class="hero__middle">
        <h1 class="hero__tag t-mono orange" data-split>${esc(p.tag)}</h1>
        <h2 class="hero__heading t-l" data-split>${esc(p.heading)}</h2>
      </div>
      <div class="hero__images">
${p.images.map((i) => `        ${pic({ src: `/assets/img/hero-${i.n}.jpg`, w: 1792, h: i.h, lazy: false, priority: true })}`).join('\n')}
      </div>
      <div class="hero__scroll t-mono-s"><div class="moveUpF" style="--delay:.8s">Scroll to explore</div></div>
    </div>
  </header>`;

const scrollText = (p) => `  <section class="scroll-text padding">
    <h2 class="scroll-text__tag t-mono orange">${esc(p.tag)}</h2>
    <div class="scroll-text__paragraph t-m">
      <div class="t-m" data-lines>${esc(p.text)}</div>
      <div class="scroll-text__abs t-m" data-lines data-abs aria-hidden="true">${esc(p.text)}</div>
    </div>
  </section>`;

const numbered = (p) => `  <section class="numbered padding">
    <header>
      <h2 class="numbered__tag t-mono orange">${esc(p.tag)}</h2>
      <h3 class="t-m">${esc(p.heading)}</h3>
    </header>
    <div class="numbered__grid">
${p.items.map(([h, t], i) => `      <div>
        <div class="numbered__number t-mono-s">[ ${String(i + 1).padStart(2, '0')} ]</div>
        <h4 class="numbered__heading t-p">${esc(h)}</h4>
        <div class="t-p">${esc(t)}</div>
      </div>`).join('\n')}
    </div>
  </section>`;

const slideover = (p) => `  <section class="founders">
    <div class="founders__images">
      <div class="founders__sticky">
${p.founders.map((f) => `        ${pic({ src: `/assets/img/${f.img}-lg.jpg`, w: 2400, h: 1350, sm: { src: `/assets/img/${f.img}-sm.jpg`, w: 1000, h: 1810 } })}`).join('\n')}
        <div class="founders__overlay"></div>
      </div>
    </div>
    <div class="founders__spacer"></div>
    <div class="founders__inner padding" style="--length:${p.founders.length}">
      <div class="founders__infos">
${p.founders.map((f) => `        <div class="founders__outer">
          <div class="founders__info-wrap">
            <div class="founders__info">
              <h2 class="founders__tag t-mono orange">${esc(f.tag)}</h2>
              <div class="founders__info-inner">
                <h3 class="t-m">${esc(f.name)}</h3>
                <div class="founders__body t-p"><p>${esc(f.bio)}</p></div>
                <div class="founders__grid">
${f.badges.map(([file, alt, w]) => `                  ${pic({ src: `/assets/svg/badges/${file}`, alt, w: w || 376, h: 240 })}`).join('\n')}
                </div>
              </div>
            </div>
          </div>
        </div>`).join('\n')}
      </div>
      <div class="founders__small-wrap">
        <div class="founders__small-inner corners corners--s">
          <div class="founders__small-overflow">
${p.smalls.map((s, i) => `            ${pic({ src: `/assets/img/${s}.jpg`, w: 784, h: 974, style: `--index:${-i}` })}`).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

module.exports = {
  'hero:flyingImages': { render: heroFlying },
  scrollText: { render: scrollText },
  numberedTextBlocks: { render: numbered },
  slideoverImage: { render: slideover },
};
