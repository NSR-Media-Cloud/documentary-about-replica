// Founders — a full-height background image slides "over" the page:
//   • the framed photo grows from 80% → 100% while the spacer scrolls in,
//   • it blurs (10px) and darkens (overlay → .6) while the first bio scrolls up,
//   • when the second bio arrives the first photo fades out (cross-dissolve to photo 2)
//     and the small portrait in the corner slides up to reveal the second portrait,
//   • at the very end the overlay goes to black and the whole stack drifts 10% down.
// Every tween is scrubbed linearly by scroll position.
import { qs, qsa, isPhone } from './dom.js';

export function initFounders() {
  const root = qs('.founders');
  if (!root) return;
  const sticky = qs('.founders__sticky', root);
  const spacer = qs('.founders__spacer', root);
  const outer1 = qs('.founders__outer', root);
  const overlay = qs('.founders__overlay', root);
  const imagesBox = qs('.founders__images', root);
  const bg1 = qs('.founders__sticky .img', root);
  const smalls = qsa('.founders__small-overflow .img', root);
  const phone = isPhone();

  const st = (trigger, start, end) => ({ trigger, start, end, scrub: true });

  gsap.context(() => {
    gsap
      .timeline()
      .fromTo(sticky,
        { width: phone ? '50%' : '80%', height: '80dvh' },
        { width: '100%', height: '100vh', ease: 'linear', scrollTrigger: st(spacer, 'clamp(0% 100%)', 'clamp(100% 100%)') })
      .to(sticky,
        { filter: 'blur(10px)', ease: 'linear', scrollTrigger: st(outer1, 'clamp(0% 100%)', 'clamp(100% 100%)') })
      .fromTo(overlay,
        { background: 'rgba(0, 0, 0, .6)' },
        { background: 'rgba(0, 0, 0, 1)', ease: 'linear', scrollTrigger: st(root, 'clamp(100% 100%)', 'clamp(100% 0%)') })
      .fromTo(bg1,
        { opacity: 1 },
        { opacity: 0, ease: 'linear', scrollTrigger: st(outer1, 'clamp(100% 100%)', 'clamp(100% 0%)') })
      .fromTo(smalls,
        { y: 0 },
        { y: '-100%', ease: 'linear', scrollTrigger: st(outer1, 'clamp(100% 100%)', 'clamp(100% 0%)') })
      .fromTo(overlay,
        { background: 'rgba(0, 0, 0, 0)' },
        { background: 'rgba(0, 0, 0, .6)', ease: 'linear', scrollTrigger: st(outer1, 'clamp(0% 100%)', 'clamp(100% 99%)') })
      .fromTo(imagesBox,
        { y: 0 },
        { y: '10%', ease: 'linear', scrollTrigger: st(root, 'clamp(100% 100%)', 'clamp(100% 0%)') });
  }, root);
}
