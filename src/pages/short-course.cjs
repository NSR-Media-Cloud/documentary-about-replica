'use strict';
// /courses/short-film-playbook — the single-product "short course" page. Stand-in copy: the product, price and promotion are invented.
const BOX = { image: '/assets/img/hero-5.jpg', lines: ['Short Film', 'Playbook'], fine: 'Video lessons · budget templates · festival kit' };
const OVERVIEW = 'The complete system behind a festival-selected short film: every step, every document, every decision.';
module.exports = {
  path: '/courses/short-film-playbook',
  title: 'Short Film Playbook',
  description: OVERVIEW,
  active: '',
  course: 'short-film-playbook',
  bodyClass: 'course-page',
  blocks: [
    { block: 'shortCourseHero', title: 'Short Film Playbook', overview: OVERVIEW, price: '$49', image: '/assets/img/hero-4.jpg', box: BOX },
    {
      block: 'shortCourseBody',
      blocks: [
        {
          block: 'infoCards', heading: 'One short film, from first idea to festival laurels.', subheading: 'What’s Included',
          cards: [
            { title: 'Complete budget sheets', image: 'hero-1', doc: 'budget' },
            { title: 'Day-by-day shoot plan', image: 'hero-4', doc: 'schedule' },
            { title: 'Festival premiere', image: 'founder-2-sm', doc: 'laurel' },
          ],
        },
        {
          block: 'ctaClickImages', href: '/contact', image: 'hero-2', button: 'Purchase Now',
          heading: 'Go from a rough idea to a festival-ready short',
          body: 'See what a short really costs at three budget levels, how to write one strong scene, how to shoot it in a few days, and how to pick the right festivals.',
        },
        {
          block: 'accordion:default', tag: 'FAQ', heading: ['Learn more', 'about this course'], primaryButton: 'Purchase Now',
          items: [
            { q: "How long does it take?", a: "About four hours of video, plus all the templates." },
            { q: "Do I need my own camera gear?", a: "No. The playbook covers three budget levels, including a phone-only version, and explains exactly what to rent, borrow or buy at each one." },
            { q: "What exactly is in the playbook, and will it be enough to get my first short made?", a: "You get the whole path in order: choosing a story you can afford to tell, writing a scene that works, budgeting and scheduling three shooting days, directing non-actors, cutting and sound, and finally which festivals to target and how to submit. Nothing is held back." },
            { q: "Which templates and documents come with it?", a: "A budget workbook with three worked examples, a three-day shoot schedule, call sheets, release forms, and a festival submission tracker with deadlines." },
            { q: "Is there a refund?", a: "Because the lessons are digital we cannot refund once you have access, but the preview lessons are free to watch first." },
          ],
        },
        {
          block: 'courseBanner', title: 'Short Film Playbook', overview: OVERVIEW, promo: 'Limited Time Offer',
          contains: ['Video lesson breakdowns', 'Working budget templates', 'Festival submission kit'],
          priceLabel: 'Launch Price', price: '$49', image: '/assets/img/hero-4.jpg', box: BOX,
        },
      ],
    },
  ],
};
