'use strict';
// /short-documentary-competition — stand-in copy for an invented "24 Hour Doc" contest; the films, names and laurels are fictional.
const img = (n) => `/assets/img/${n}.jpg`;
module.exports = {
  path: '/short-documentary-competition',
  title: 'Short Documentary Competition',
  description: 'Make an original short documentary in 24 hours and compete for awards and prize money',
  active: '/short-documentary-competition',
  blocks: [
    {
      block: 'hero:infoVideo', heading: 'The 24 Hour Doc Challenge',
      overview: 'The 24 Hour Doc challenge asks members to make an original short documentary in a single day.',
      button: { label: 'Submit', href: '/contact' },
      info: [['Submissions Open', 'May 11th 2027'], ['Submissions Close', 'July 30th 2027']],
      image: img('film-1'),
    },
    {
      block: 'imageBlocks', tag: 'Categories',
      heading: 'Show off your storytelling and compete for <span style="color:#FFA200">awards</span> and real prize money',
      blocks: ['Best Film', 'Emerging Filmmaker', 'Best Cinematography', 'Best Editing', 'Best Sound', 'Audience Award'],
    },
    {
      block: 'fullVideo', image: img('film-4'), title: 'The 24 Hour Doc Challenge',
      name: 'The Reel Truth Academy', tagline: 'Tips, tricks and rules for the 24 Hour Doc contest.',
    },
    {
      block: 'textBlocks', tag: 'Overview', heading: 'Entry Rules & Requirements',
      button: { label: 'Enter your film', href: '/contact' },
      blocks: [
        ['24 Hours', 'Film everything within one 24-hour window. A short pick-up session of up to two hours on another day is allowed.'],
        ['RTA Members', 'Open to current RTA members, entering as the director.'],
        ['Duration', 'Runtime must be 2 to 6 minutes long.'],
        ['Foreign Languages', 'Non-English films need English subtitles burned in.'],
        ['Fresh Work', 'Only films made for this contest are eligible.'],
        ['Archival Footage', 'Archive material is fine when it comes from your subject and is relevant to their story. List every source in your submission notes.'],
        ['Stock Footage', 'No stock footage is accepted.'],
        ['Submission', 'Upload your finished film to Vimeo or YouTube and paste the link into the entry form before the closing date. Keep the video unlisted if you like, but do not make it private, because the judges need to be able to watch it. Late entries cannot be accepted, and you must hold the rights to both the film and every piece of music in it. No exceptions will be made. Ask us early if anything is unclear.'],
      ],
    },
    {
      block: 'quote', image: 'film-4', author: 'Maya Ross',
      text: 'Entering the 24 Hour Doc changed how I make films. One day, one story, no time to doubt myself: it taught me to trust my instincts, and I carry that onto every single shoot now.',
    },
    {
      block: 'filmStack', tag: 'Previous Winners',
      heading: 'Get inspired by the short docs past members shot in a single day',
      films: [
        { title: 'Chalk and Thread', creator: 'Iris Callahan', still: img('win-1') },
        { title: 'Last Light', creator: 'Teodor Marsh', still: img('win-2') },
        { title: 'Corner Shop', creator: 'Amara Okonkwo-Reyes', still: img('win-3') },
        { title: 'Tin Roof', creator: 'Sam Delaney', still: img('win-4') },
      ],
    },
    {
      block: 'laurels', tag: 'Awards',
      heading: 'These are a few of the festival laurels that short films made for our 24 Hour Doc challenge have won',
      laurels: [
        { kicker: 'OFFICIAL SELECTION', lines: ['HARBOR LIGHTS', 'FILM FESTIVAL'], year: '2027', style: 'caps' },
        { kicker: 'WINNER', lines: ['Northfield', 'Documentary Days'], year: '2026', style: 'serif' },
        { kicker: 'OFFICIAL SELECTION', lines: ['MERIDIAN', 'SHORT FILM', 'AWARDS'], year: '2027', style: 'bold' },
        { kicker: 'FINALIST', lines: ['Low Country', 'International', 'Film Fest'], year: '2026', style: 'mono' },
        { kicker: 'OFFICIAL SELECTION', lines: ['CEDAR VALLEY', 'SCREEN WEEK'], year: '2026', style: 'caps' },
      ],
    },
  ],
};
