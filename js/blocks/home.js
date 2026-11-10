// Home page behaviours: the glide band, the testimonial slider, the course quiz, the "what's included" accordion and a light
// parallax on the testimonial cards.
import { qs, qsa, isPhone, prefersReducedMotion, clamp } from '../dom.js';

/* ---- glideTrack: the grey band travels down the list as the section scrolls (start "top 70%", end "bottom 30%"),
        and its label swaps once the band's centre passes into the second group ---- */
function initGlide() {
  qsa('[data-glide]').forEach((list) => {
    const band = qs('.glide__band', list), titles = qs('.glide__titles', list), groups = qsa('.glide__group', list);
    if (!band || groups.length < 2) return;
    let shown = 0;
    const setTitle = (i) => {
      if (i === shown) return;
      shown = i;
      gsap.to(titles, { y: -i * (titles.firstElementChild ? titles.firstElementChild.offsetHeight : 44), duration: 0.45, ease: 'power3.out', overwrite: true });
    };
    ScrollTrigger.create({
      trigger: list, start: 'top 70%', end: 'bottom 30%', scrub: true,
      onUpdate: (self) => {
        if (isPhone()) return;
        const travel = list.offsetHeight - band.offsetHeight;
        const y = travel * self.progress;
        gsap.set(band, { y });
        const centre = y + band.offsetHeight / 2;
        let idx = 0;
        groups.forEach((g, i) => { if (centre >= g.offsetTop) idx = i; });
        setTitle(idx);
      },
    });
  });
}

/* ---- quoteFrame: swipeable full-screen slider; each picture moves at 20% of the slide speed ---- */
function initQuoteFrame() {
  qsa('[data-quote-frame]').forEach((root) => {
    const vp = qs('.quote-frame__viewport', root), track = qs('.quote-frame__container', root);
    const slides = qsa('.quote-frame__slide', root), pics = slides.map((s) => qs('.quote-frame__parallax', s));
    const n = slides.length, st = { pos: 0 };
    const paint = () => {
      track.style.transform = `translate3d(${(-st.pos * 100).toFixed(3)}%,0,0)`;
      pics.forEach((p, k) => { p.style.transform = `translate3d(${(-20 * (k - st.pos)).toFixed(3)}%,0,0)`; });
    };
    const go = (to) => { const t = ((to % n) + n) % n; gsap.to(st, { pos: t, duration: 0.85, ease: 'power3.out', onUpdate: paint, overwrite: true }); };
    let cur = 0;
    const move = (d) => { cur = (cur + d + n) % n; go(cur); };
    qs('[data-prev]', root).addEventListener('click', () => move(-1));
    qs('[data-next]', root).addEventListener('click', () => move(1));
    // drag / swipe
    let down = null;
    vp.addEventListener('pointerdown', (e) => { down = { x: e.clientX, pos: st.pos, t: performance.now() }; gsap.killTweensOf(st); vp.setPointerCapture(e.pointerId); });
    vp.addEventListener('pointermove', (e) => {
      if (!down) return;
      st.pos = clamp(down.pos - (e.clientX - down.x) / vp.clientWidth, -0.15, n - 0.85);
      paint();
    });
    const end = (e) => {
      if (!down) return;
      const dx = e.clientX - down.x, v = dx / Math.max(1, performance.now() - down.t);
      cur = clamp(Math.round(down.pos - dx / vp.clientWidth - v * 0.25), 0, n - 1);
      down = null; go(cur);
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    root.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1); });
    paint();
  });
}

/* ---- "what's included": one tab open at a time ---- */
function initIconText() {
  qsa('[data-icon-text]').forEach((list) => {
    const tabs = qsa('.icon-text__tab', list);
    const set = (tab, open) => {
      const btn = qs('.icon-text__button', tab), panel = qs('.icon-text__panel', tab);
      btn.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      panel.toggleAttribute('inert', !open);
      panel.classList.toggle('is-open', open);   // the grid row animates 0fr ↔ 1fr (css), so the panel follows its content
    };
    tabs.forEach((tab) => {
      qs('.icon-text__button', tab).addEventListener('click', () => {
        const open = qs('.icon-text__button', tab).getAttribute('aria-expanded') !== 'true';
        tabs.forEach((t) => set(t, t === tab ? open : false));
      });
    });
  });
}

/* ---- the course quiz ---- */
const QUESTIONS = [
  { q: 'Where are you with filmmaking right now?', opts: ['Just starting out', 'I have made a few films', 'I work in the industry'] },
  { q: 'What do you most want to get better at?', opts: ['Story and directing', 'Camera and lighting', 'Editing and sound', 'Business and clients'] },
  { q: 'How do you like to learn?', opts: ['Short, practical lessons', 'Long, deep dives', 'With feedback from others'] },
];
const pick = (a) => {
  const [level, goal, style] = a;
  if (goal === 0) return level === 0 ? 'nonfiction-foundations' : 'advanced-storytelling';
  if (goal === 1) return level === 2 ? 'field-notes-pro' : 'the-roving-eye';
  if (goal === 2) return 'the-final-cut';
  return level === 2 || style === 1 ? 'producing-essentials' : 'make-and-sell';
};

function initQuiz() {
  qsa('[data-quiz]').forEach((root) => {
    const form = qs('[data-quiz-form]', root), body = qs('[data-quiz-body]', root), toggle = qs('[data-quiz-toggle]', root);
    const courses = JSON.parse(root.dataset.quizResults || '{}');
    let open = false, step = 0, answers = [];
    const render = () => {
      if (step >= QUESTIONS.length) {
        const c = courses[pick(answers)];
        body.innerHTML = `<div class="quiz__result"><span class="t-mono-s">Your best match</span><h3 class="t-ms"></h3><p class="t-p"></p><a class="btn btn--orange" href="/courses/${c.slug}"><span class="t-mono-s">View course</span><svg class="btn__arrow" width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden="true"><path d="m4 1 4 4m0 0-4 4m4-4h-8" stroke="#fff"/></svg></a><button class="quiz__restart t-mono-s" type="button">Start again</button></div>`;
        qs('h3', body).textContent = c.title;
        qs('p', body).textContent = `From $${c.cost}. ${c.line}`;
        qs('.quiz__restart', body).addEventListener('click', () => { step = 0; answers = []; render(); });
      } else {
        const Q = QUESTIONS[step];
        body.innerHTML = `<div class="quiz__step"><span class="quiz__count t-mono-s">Question ${step + 1} of ${QUESTIONS.length}</span><h3 class="t-ms"></h3><div class="quiz__options" role="group"></div></div>`;
        qs('h3', body).textContent = Q.q;
        Q.opts.forEach((o, i) => {
          const b = document.createElement('button');
          b.type = 'button'; b.className = 'quiz__option t-p'; b.textContent = o;
          b.addEventListener('click', () => { answers[step] = i; step += 1; render(); });
          qs('.quiz__options', body).appendChild(b);
        });
      }
    };
    toggle.addEventListener('click', () => {
      open = !open;
      toggle.setAttribute('aria-expanded', String(open));
      form.setAttribute('aria-hidden', String(!open));
      form.toggleAttribute('inert', !open);
      form.classList.toggle('is-open', open);   // css animates the grid row 0fr ↔ 1fr
      if (open) { step = 0; answers = []; render(); }
    });
    // the framed video fades and unmasks as it arrives
    const frame = qs('[data-quiz-frame]', root);
    if (frame && !prefersReducedMotion()) {
      const media = qs('.quiz__media', frame);
      gsap.set(frame, { opacity: 0 });
      gsap.set(media, { clipPath: 'inset(50%)' });
      ScrollTrigger.create({
        trigger: frame, start: 'top 85%', once: true,
        onEnter: () => {
          gsap.to(frame, { opacity: 1, duration: 0.8, ease: 'none' });
          gsap.to(media, { clipPath: 'inset(0%)', duration: 1.2, ease: 'power3.out' });
        },
      });
    }
  });
}

/* ---- testimonial cards drift at slightly different speeds ---- */
function initTestimonials() {
  if (prefersReducedMotion()) return;
  qsa('.testimonials__card').forEach((card, i) => {
    gsap.fromTo(card, { y: i ? 40 : 0 }, { y: i ? -30 : 20, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

export function initHome() {
  initGlide();
  initQuoteFrame();
  initIconText();
  initQuiz();
  initTestimonials();
}
