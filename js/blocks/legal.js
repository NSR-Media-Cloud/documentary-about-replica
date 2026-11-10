// Legal pages — highlights the "Sections" link of the block being read and scrolls smoothly to a block on click.
import { qs, qsa, isPhone } from '../dom.js';

export function initLegal({ lenis }) {
  const root = qs('.legal');
  if (!root) return;
  const blocks = qsa('.legal__block', root);
  const links = qsa('.legal__links li', root);
  const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

  const setActive = (id) => links.forEach((li) => li.classList.toggle('is-active', li.id === `link-${id}`));

  // a block is "current" once its box (which starts 120rem above its heading) reaches the top of the viewport;
  // nothing is current while the page title is still showing
  const update = () => {
    let id = null;
    for (const b of blocks) if (b.getBoundingClientRect().top <= 2) id = b.id;
    setActive(id);
  };

  links.forEach((li, i) => {
    qs('a', li).addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(blocks[i], { duration: 1.2 });
      history.replaceState(null, '', `#${blocks[i].id}`);
    });
  });

  // the phone's link row scrolls sideways: keep the active chip in view
  const follow = () => {
    const on = links.find((li) => li.classList.contains('is-active'));
    const ul = qs('.legal__links', root);
    if (on && isPhone()) ul.scrollTo({ left: on.offsetLeft - 12 * rem(), behavior: 'smooth' });
  };

  lenis.on('scroll', () => { update(); });
  update();
  setInterval(follow, 400);

  if (location.hash) {
    const target = qs(location.hash.replace(/[^#\w-]/g, ''), root);
    if (target) lenis.scrollTo(target, { immediate: true });
  }
}
