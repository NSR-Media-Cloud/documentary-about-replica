'use strict';
// /funding — stand-in copy; the nine films are fictional.
const still = (n) => `/assets/img/film-${n}.jpg`;
module.exports = {
  path: '/funding',
  title: 'Funding',
  description: 'Funding, finishing grants and release deals for member films',
  active: '/funding',
  blocks: [
    {
      block: 'hero:textImage', tag: 'Funding Models', heading: 'RTA funds our members’ films',
      image: { src: '/assets/img/hero-5.jpg', w: 1792, h: 1008, sm: { src: '/assets/img/hero-4.jpg', w: 1200, h: 1363 } },
    },
    {
      block: 'ctaBlocks',
      heading: 'Three ways we back our members, from the first spark to the finished film',
      blocks: [
        { index: 'one', title: 'RTA Launch Fund', body: 'Money to get a new film off the ground', label: 'Apply Here', href: '/contact' },
        { index: 'two', title: 'RTA Completion Fund', body: 'Grants that carry a film over the finish line', label: 'Apply Here', href: '/contact' },
        { index: 'three', title: 'RTA Release Deals', body: 'Paid festival and web releases', label: 'Apply Here', href: '/contact' },
      ],
    },
    {
      block: 'filmGrid', tag: 'Member Films', mobileLimit: 3,
      heading: 'Work our members finished after taking the courses, from short docs to ads, reels and campaigns',
      films: [
        { title: 'Low Tides', creator: 'Nora Quill', type: 'Documentary', still: still(1), award: 'Audience Choice, Autumn Showcase' },
        { title: 'Paper Boats', creator: 'Ivo Castellan', type: 'Documentary', still: still(2) },
        { title: 'Hush', creator: 'Dana Whitlow', type: 'Documentary', still: still(3) },
        { title: 'The Salt Road North', creator: 'Priya Valdane', type: 'Documentary', still: still(4) },
        { title: 'Morning Rush', creator: 'Rae Fontaine', type: 'Commercial', still: still(5) },
        { title: 'Where Rivers Begin', creator: 'Eun Ji', type: 'Documentary', still: still(6) },
        { title: 'Small Town Signal', creator: 'Marcus Delacour', type: 'Campaign', still: still(7) },
        { title: 'Daylight', creator: 'Camille Okafor', type: 'Reel', still: still(8) },
        { title: 'Kindle', creator: 'Jules Brandt', type: 'Commercial', still: still(9) },
      ],
    },
  ],
};
