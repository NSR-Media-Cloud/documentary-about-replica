'use strict';
// /about — stand-in copy, written to the same line counts as the source page.
module.exports = {
  path: '/about',
  title: 'About',
  description: 'Why we started The Reel Truth Academy',
  active: '/about',
  blocks: [
    {
      block: 'hero:flyingImages',
      tag: 'About Us',
      heading: 'Why we started The Reel Truth Academy',
      images: [{ n: 1, h: 2036 }, { n: 2, h: 1008 }, { n: 3, h: 1008 }, { n: 4, h: 2036 }, { n: 5, h: 1008 }, { n: 6, h: 1008 }],
    },
    {
      block: 'scrollText',
      tag: 'Short and Honest',
      text: 'We believe a great documentary can change how a room sees the world, and that learning to make one should not take a film-school budget or a lucky introduction. So we built a school where working filmmakers share their process, answer your real questions and push your ideas further, from first spark to final cut.',
    },
    {
      block: 'numberedTextBlocks',
      tag: 'Our Vow',
      heading: 'Our pledge to the people who make films',
      items: [
        ['Practical Craft Skills', 'Our lessons give you the skills and the confidence to turn a rough idea into a finished film, one clear and practical step at a time.'],
        ['Honest Feedback', 'Get notes and guidance from working professionals and fellow students to sharpen every scene of your film.'],
        ['A Working Community', 'We are building a wide community of makers, offering open resources, modest production grants and a stage where you can share completed work.'],
        ['Real Industry Links', 'We partner with festivals and broadcasters to open real doors for your stories.'],
      ],
    },
    {
      block: 'slideoverImage',
      smalls: ['small-1', 'small-2'],
      founders: [
        {
          img: 'founder-1',
          tag: 'Co-founder, Director',
          name: 'Marguerite Aldous',
          bio: 'Marguerite Aldous is a documentary director who began her career documenting town-hall meetings in her hometown. She read cultural studies before turning to the camera, and her films follow ordinary people through extraordinary decisions. Her work has screened at festivals across Europe and North America and has been acquired by public broadcasters and online platforms. She now teaches the craft she wishes she had been shown at the very start of her own career.',
          badges: [
            ['laurel-1.svg', 'Official selection laurel, Northlight Doc Fest'],
            ['laurel-2.svg', 'Best feature laurel, Greywater Film Awards'],
            ['laurel-3.svg', 'Audience award laurel, Harbour Docs'],
            ['mark-1.svg', 'Public Screen', 360],
            ['mark-2.svg', 'reelnet'],
            ['mark-3.svg', 'GRAIN'],
            ['mark-4.svg', 'Fieldcast'],
            ['mark-5.svg', 'open/lens'],
          ],
        },
        {
          img: 'founder-2',
          tag: 'Co-founder, Director',
          name: 'Idris Kovac',
          bio: 'Award-winning producer and director Idris Kovac found his calling while working as a field medic and logging footage for a relief charity during the long winter of a regional crisis. He went on to direct several widely shown documentaries, including a feature that follows a ferry crew through one hard season, and a concert film that earned a jury prize at Harbour Docs. His films have won him honours from broadcasters and festivals alike, and he still mentors first-time directors every season. With experience on sets in more than thirty countries, Idris has also directed commercial campaigns for well-known consumer brands and travel companies.',
          badges: [
            ['laurel-4.svg', 'Jury prize laurel, Harbour Docs'],
            ['laurel-5.svg', 'Official selection laurel, Slowlight Festival'],
            ['laurel-6.svg', 'Staff pick laurel, Open Reel'],
            ['laurel-7.svg', 'Special mention laurel, Greywater'],
            ['laurel-8.svg', 'Official selection laurel, Fieldwork Fest'],
            ['laurel-9.svg', 'Best short laurel, Northlight'],
          ],
        },
      ],
    },
  ],
};
