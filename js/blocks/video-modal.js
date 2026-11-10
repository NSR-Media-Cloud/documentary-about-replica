// Video lightbox, modelled on the source's custom full-screen player: title top-left, "Close [×]" top-right,
// a timeline with elapsed / total time, hover preview and a vertical volume slider along the bottom.
// Controls appear when the pointer moves and fade out again when it is idle.
// This study ships no footage, so playback is SIMULATED: the still slowly pushes in while the timeline runs in real time
// (click or Space to pause, drag the bar to seek). The volume slider is part of the design but has no audio to control.
import { qs } from '../dom.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pad = (n) => String(n).padStart(2, '0');
/** mm:ss:cs — minutes, seconds, hundredths (the source's timecode format). */
const fmt = (s) => { s = Math.max(0, s); return `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}:${pad(Math.floor((s % 1) * 100))}`; };
/** A repeatable pseudo-duration per film (2:30 – 8:00) so each card feels like its own piece. */
const durationFor = (key) => { let h = 7; for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 150 + (h % 330) + (h % 83) / 100; };

const ICON_VOL = '<svg fill="none" height="14" viewBox="0 0 14 14" width="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="m8.55556 14v-1.64c1.16666-.3467 2.10644-1.0133 2.81944-2 .713-.98667 1.0694-2.10667 1.0694-3.36s-.3564-2.37333-1.0694-3.36-1.65278-1.65333-2.81944-2v-1.64c1.60744.373333 2.91664 1.21013 3.92774 2.5104s1.5167 2.7968 1.5167 4.4896c0 1.69333-.5056 3.1901-1.5167 4.4904s-2.3203 2.1368-3.92774 2.5096zm-8.55556-4.58v-4.8h3.11111l3.88889-4v12.8l-3.88889-4zm8.55556.8v-6.44c.60925.29333 1.08577.73333 1.42955 1.32.34379.58667.51539 1.22667.51489 1.92 0 .68-.1719 1.31013-.51567 1.8904s-.82003 1.0168-1.42877 1.3096z" fill="#fff"/></svg>';
const ICON_MUTED = '<svg fill="none" height="14" viewBox="0 0 14 14" width="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="m0 9.42v-4.8h3.11111l3.88889-4v12.8l-3.88889-4z" fill="#fff"/><path d="m9.5 5 4 4m0-4-4 4" stroke="#fff"/></svg>';
const ICON_MARKER = '<svg class="player__marker" fill="none" height="12" viewBox="0 0 14 12" width="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="m0 0h14v8l-7 4-7-4z" fill="#fff"/></svg>';

let current = null;

export function openVideoModal({ poster, title = '', duration } = {}) {
  if (current) return;
  const host = qs('#modal');
  if (!host) return;
  const dur = duration || durationFor(title || poster);
  const el = document.createElement('div');
  el.className = 'player is-controls';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', title || 'Video');
  el.innerHTML = `
    <div class="player__stage"><div class="player__frame"><img class="player__video" alt="" src="${poster}"></div></div>
    <div class="player__note t-mono-s">Stand-in video: this design study ships no footage</div>
    <div class="player__timeline">
      <span class="t-mono-s" data-now>00:00:00</span>
      <div class="player__grab" data-grab>
        <div class="player__bar" data-bar>
          <div class="player__progress" data-progress></div>
          <div class="player__hover" data-hover></div>
          ${ICON_MARKER}
        </div>
        <div class="player__preview" data-preview style="transform:translateX(calc(-50% + 0px))"><picture><img alt="" src="${poster}"></picture><span class="t-mono-s" data-preview-time>00:00:00</span></div>
      </div>
      <span class="t-mono-s">${fmt(dur)}</span>
      <div class="player__volume">
        <button type="button" aria-label="Mute" data-mute>${ICON_VOL}</button>
        <div class="player__vol-slider" role="slider" aria-label="Volume" aria-valuemin="0" aria-valuemax="1" aria-valuenow="1" tabindex="0" data-vol><div class="player__vol-handle" data-handle></div></div>
        <div class="player__vol-text t-mono-s" data-vol-text>1</div>
      </div>
    </div>
    <div class="player__info t-mono-s"></div>
    <button class="player__close t-mono-s" type="button">Close [×]</button>`;
  qs('.player__info', el).textContent = title;
  host.appendChild(el);
  current = el;
  if (window.lenis) window.lenis.stop();
  const prevFocus = document.activeElement;

  const $ = (s) => qs(s, el);
  const bar = $('[data-bar]'), grab = $('[data-grab]'), progress = $('[data-progress]'), hover = $('[data-hover]');
  const marker = $('.player__marker'), now = $('[data-now]'), preview = $('[data-preview]'), previewTime = $('[data-preview-time]');
  const vol = $('[data-vol]'), handle = $('[data-handle]'), volText = $('[data-vol-text]'), mute = $('[data-mute]');
  const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 1;

  const st = { t: 0, playing: true, vol: 1, muted: false };
  let barW = 0;
  const measure = () => { barW = bar.getBoundingClientRect().width; };
  const paint = () => {
    const p = st.t / dur;
    now.textContent = fmt(st.t);
    progress.style.transform = `scaleX(${p})`;
    marker.style.transform = `translateX(${p * barW}px)`;
  };
  const setPlaying = (on) => { st.playing = on; el.classList.toggle('is-paused', !on); };
  const toggle = () => { if (st.t >= dur) st.t = 0; setPlaying(!st.playing); };

  let last = performance.now(), raf = 0;
  const tick = (ts) => {
    const dt = Math.min(0.1, (ts - last) / 1000); last = ts;
    if (st.playing) { st.t = Math.min(dur, st.t + dt); if (st.t >= dur) setPlaying(false); }
    paint();
    raf = requestAnimationFrame(tick);
  };

  // ---- controls visibility: shown on movement, hidden after a moment of stillness
  let idle = 0;
  const wake = () => { el.classList.add('is-controls'); clearTimeout(idle); idle = setTimeout(() => el.classList.remove('is-controls'), 2800); };
  el.addEventListener('pointermove', wake);
  el.addEventListener('pointerdown', wake);

  // ---- click anywhere on the picture toggles playback
  qs('.player__stage', el).addEventListener('click', toggle);

  // ---- timeline: hover preview, click / drag to seek
  const posAt = (e) => clamp(e.clientX - bar.getBoundingClientRect().left, 0, barW);
  let dragging = false;
  grab.addEventListener('pointermove', (e) => {
    const x = posAt(e), p = x / barW;
    hover.style.transform = `scaleX(${p})`;
    hover.classList.add('is-hover'); preview.classList.add('is-hover');
    preview.style.transform = `translateX(calc(-50% + ${x}px))`;
    previewTime.textContent = fmt(p * dur);
    if (dragging) { st.t = p * dur; paint(); }
  });
  grab.addEventListener('pointerleave', () => { if (!dragging) { hover.classList.remove('is-hover'); preview.classList.remove('is-hover'); } });
  grab.addEventListener('pointerdown', (e) => { dragging = true; grab.setPointerCapture(e.pointerId); st.t = (posAt(e) / barW) * dur; paint(); });
  const endDrag = () => { dragging = false; };
  grab.addEventListener('pointerup', endDrag);
  grab.addEventListener('pointercancel', endDrag);
  grab.addEventListener('lostpointercapture', () => { endDrag(); hover.classList.remove('is-hover'); preview.classList.remove('is-hover'); });

  // ---- volume (UI only: there is no audio in this study)
  const paintVol = () => {
    const v = st.muted ? 0 : st.vol;
    handle.style.top = `${(1 - v) * 48 * rem()}px`;
    volText.textContent = String(Math.round(v * 100) / 100);
    vol.setAttribute('aria-valuenow', String(Math.round(v * 100) / 100));
    mute.innerHTML = v === 0 ? ICON_MUTED : ICON_VOL;
  };
  const setVolFromPointer = (e) => {
    const r = vol.getBoundingClientRect();
    st.vol = clamp(1 - (e.clientY - r.top - 4 * rem()) / (48 * rem()), 0, 1);
    st.muted = false; paintVol();
  };
  let volDrag = false;
  vol.addEventListener('pointerdown', (e) => { volDrag = true; vol.setPointerCapture(e.pointerId); volText.classList.add('is-hover'); setVolFromPointer(e); });
  vol.addEventListener('pointermove', (e) => { if (volDrag) setVolFromPointer(e); });
  const endVol = () => { volDrag = false; volText.classList.remove('is-hover'); };
  vol.addEventListener('pointerup', endVol);
  vol.addEventListener('pointercancel', endVol);
  vol.addEventListener('pointerenter', () => volText.classList.add('is-hover'));
  vol.addEventListener('pointerleave', () => { if (!volDrag) volText.classList.remove('is-hover'); });
  vol.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { st.vol = clamp(st.vol + 0.1, 0, 1); st.muted = false; paintVol(); e.preventDefault(); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { st.vol = clamp(st.vol - 0.1, 0, 1); st.muted = false; paintVol(); e.preventDefault(); }
    e.stopPropagation();
  });
  mute.addEventListener('click', (e) => { e.stopPropagation(); st.muted = !st.muted; paintVol(); });
  el.querySelector('.player__timeline').addEventListener('click', (e) => e.stopPropagation());

  // ---- closing
  const close = () => {
    cancelAnimationFrame(raf); clearTimeout(idle);
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', measure);
    gsap.to(el, { opacity: 0, duration: 0.3, ease: 'none', onComplete: () => { el.remove(); current = null; if (window.lenis) window.lenis.start(); prevFocus && prevFocus.focus && prevFocus.focus(); } });
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === ' ' && !/^(BUTTON|DIV)$/.test(e.target.tagName)) { e.preventDefault(); toggle(); }
    else if (e.key === 'ArrowRight' && e.target === document.body) { st.t = Math.min(dur, st.t + 5); }
    else if (e.key === 'ArrowLeft' && e.target === document.body) { st.t = Math.max(0, st.t - 5); }
    else if (e.key === 'Tab') { // keep focus inside the player
      const f = [...el.querySelectorAll('button, [tabindex="0"]')].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', measure);
  qs('.player__close', el).addEventListener('click', (e) => { e.stopPropagation(); close(); });

  // ---- go
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'none' });
  requestAnimationFrame(() => { measure(); paintVol(); paint(); });
  raf = requestAnimationFrame((ts) => { last = ts; tick(ts); });
  qs('.player__close', el).focus({ preventScroll: true });
  wake();
}
