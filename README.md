# Documentary school — full-site replica (all 24 URLs)

A pixel- and motion-faithful local replica of the **layout, typography, spacing, colour system, interaction and scroll-driven animation** of every page of an online
documentary-filmmaking school's website — rebuilt from a measured UI/UX audit of the live site, template by template.

* **Audit:** [`docs/UIUX-AUDIT.md`](docs/UIUX-AUDIT.md) — visual design → interaction → code, with measured tokens, findings and the verification report
  (part 1 is the About page; part 2 covers the other 23 URLs).
* **Evidence:** the audit's verification report and the document-height table [below](#how-it-was-verified). Captures of the live site are not part of this repository
  (they belong to its owner); `tools/qa` can regenerate side-by-side pairs locally.

> **What is and isn't copied.** The *design system and behaviour* are reproduced. The source's **words, photographs, logos, award laurels, client logos, product
> imagery, video and commercial fonts belong to its owner**, so this build uses original stand-ins: new copy written to the same lengths and line counts, a new wordmark
> ("The Reel Truth Academy", **RTA**), Unsplash-licence photography, generated laurels and made-up organisation marks, CSS-drawn product boxes and
> "screen recordings", and open-licence fonts. **Every person, quote, film, figure, price, date and award in the content is invented sample material**
> (the legal pages are filler, not legal text). This is a design study and is not affiliated with the source.

## Run it

```bash
node server.cjs            # http://localhost:4660/   (any free port: node server.cjs 5000)
node src/build.cjs         # regenerate the HTML from src/  (only needed after editing src/; the built pages are committed)
```

Needs only Node 18+ (the server and the generator have no dependencies). Clean URLs (`/about`, `/courses/make-and-sell`), a real 404 page, trailing-slash
redirects and the source's `/early-course-registration` redirect are handled by `server.cjs`; any static host works if you map the same URLs to the generated folders.

Handy while reviewing:

| | |
|---|---|
| `sessionStorage.clear()` | show the preloader again (it plays once per session; later pages use the page wipe) |
| `?popup=0` / `sessionStorage.removeItem('popup')` | disable / re-enable the scroll-triggered subscribe popup |
| `localStorage.removeItem('rta_cookies')` | bring the cookie notice back |
| OS "reduce motion" | statement fully revealed, hero skips its fly-through, no page wipe, tickers and loops stop |

## The pages

| URL | Template | Built from (blocks) |
|---|---|---|
| `/` | Home | hero:fullBleedCentered · glideTrack · stats · quoteFrame · homeCourses · courseQuiz · pricingCards ×3 · iconTextBlocks · ctaMedia · testimonialCards · videoSlider · pricingTable · filmGrid |
| `/about` | About | the fly-through hero, scroll text, values, founders slide-over |
| `/courses` | Course listing | editorial stack ⇄ grid toggle, marquee strips |
| `/courses/<slug>` ×7 | Course | fixed hero · breakdown accordion · quote · video slider · stats · community cards · pricing · course card stack · contact (+ text/media cards and a CTA on two of them) |
| `/courses/short-film-playbook` | Single-product course | shortCourseHero · infoCards · CTA link · FAQ · courseBanner |
| `/modules/<slug>` ×3 | Add-on module | module hero · sessions breakdown · course stack · contact |
| `/certification` | Marketing | hero · numbered steps through a pinned frame · certificates |
| `/funding` | Marketing | hero · three apply columns · member film grid (hover preview, full-screen player) |
| `/enterprise` | Marketing | hero · organisation-mark marquee · sticky text/media stack with three live stand-in "recordings" · small print · centred contact form |
| `/short-documentary-competition` | Marketing | info-video hero · award categories on a scroll-drawn grid · film-strip video · rules · quote · previous-winners stack · festival laurels |
| `/the-rta-accelerator` | Marketing | hero only — the source renders nothing else on this route |
| `/frequently-asked-questions`, `/legals/*`, `/contact`, 404 | Utility | accordion, legal text with a scrolling table of contents, contact form (floating labels, country picker, topics), 404 |

Everything else the audit found is in place: preloader, hiding nav, full-screen menu with course covers, cookie notice, subscribe popup, smooth scroll, the page wipe,
and a full custom video player (timeline with hover preview, volume, idle-hiding controls — playback is simulated because the study ships no footage).

## Project layout

```
src/build.cjs            static generator: src/pages/*.cjs + src/blocks/*.cjs + src/shell.cjs → <route>/index.html
src/pages/               one file per page: { path, title, blocks:[{ block, ...props }] }  (all copy lives here)
src/blocks/              one file per CMS-style component: { render(props) → html, css:[names] }
src/data/                courses, course-page specs, countries, fictional logos / laurels / product box art
css/base.css             fonts, the rem system (1rem = 100vw/1440, /375 on phones), reset, entrance helpers
css/type.css             the type scale (L, M, MC, XS, P, SP, XSP, bold cuts + 3 mono sizes)
css/components.css       preloader, buttons, nav + menu, footer, cookie, popup, player, page wipe
css/blocks/              the stylesheet of each block (loaded only on pages that use it)
js/app.js                boot: GSAP + ScrollTrigger + CustomEase + Lenis wiring, loads page blocks on demand
js/blocks/               one module per interactive block (accordion, film grid, quote slider, quiz, player…)
vendor/                  gsap, ScrollTrigger, CustomEase (GSAP 3.15), lenis 1.3
assets/fonts, img, svg   Instrument Sans + Fragment Mono (OFL) · 32 stand-in photos (Unsplash) · wordmark, generated laurels
assets/flags             59 Twemoji country flags for the phone-number picker (CC-BY 4.0)
server.cjs               static server (clean URLs, 404, redirects, range requests)
tools/                   fetch-photos.cjs (+ credits manifest), fetch-flags.cjs, qa/ (verification harness)
docs/                    UIUX-AUDIT.md
```

## Using your own content

* **Copy and structure:** edit the page files in `src/pages/` and run `node src/build.cjs`. Keep each text close to the stand-in's length to keep the source layout's line breaks
  and section heights (the audit lists the measured lengths).
* **Photos:** replace files in `assets/img/` keeping names and aspect ratios, or list new ones in `tools/photos.manifest.json` and run `node tools/fetch-photos.cjs`.
* **Logo:** `assets/svg/logo.json` holds the wordmark path used by the nav, footer and product boxes.
* **Product boxes, laurels, organisation marks:** drawn in CSS/SVG (`src/data/boxart.cjs`, `badges.cjs`, `logos.cjs`); replace them with images where you have the real ones.
* **Fonts:** swap the `@font-face` files in `css/base.css`; if the faces are metrically different adjust `size-adjust` and the `--sans-fix` / `--mono-fix` tokens.

## How it was verified

`tools/qa` runs the same scripts against the live site and this replica in headless Chrome — see [`tools/qa/README.md`](tools/qa/README.md).

**Document height, original vs replica** (px; replica routes use stand-in slugs):

| replica route | 1440 orig | 1440 replica | Δ | 390 orig | 390 replica | Δ |
|---|---:|---:|---:|---:|---:|---:|
| `/` | 16772 | 16771 | -1 | 23203 | 23202 | -1 |
| `/about` | 7819 | 7819 | 0 | 6436 | 6436 | 0 |
| `/contact` | 3264 | 3264 | 0 | 3714 | 3714 | 0 |
| `/courses` | 7432 | 7432 | 0 | 7593 | 7593 | 0 |
| `/courses` (grid view) | 5035 | 5035 | 0 | 6906 | 6905 | -1 |
| `/courses/nonfiction-foundations` | 12260 | 12259 | -1 | 12731 | 12731 | 0 |
| `/courses/advanced-storytelling` | 12704 | 12704 | 0 | 12949 | 12949 | 0 |
| `/courses/make-and-sell` | 12681 | 12680 | -1 | 12946 | 12946 | 0 |
| `/courses/the-final-cut` | 12661 | 12661 | 0 | 12845 | 12846 | +1 |
| `/courses/the-roving-eye` | 12546 | 12546 | 0 | 12726 | 12727 | +1 |
| `/courses/field-notes-pro` | 12588 | 12588 | 0 | 12957 | 12958 | +1 |
| `/courses/producing-essentials` | 12920 | 12919 | -1 | 13007 | 13008 | +1 |
| `/courses/short-film-playbook` | 4728 | 4728 | 0 | 5199 | 5199 | 0 |
| `/modules/craft-lab` | 8599 | 8599 | 0 | 8310 | 8310 | 0 |
| `/modules/maker-toolkit` | 7584 | 7584 | 0 | 7373 | 7351 | -22 |
| `/modules/guest-sessions` | 8014 | 8014 | 0 | 7955 | 7932 | -23 |
| `/certification` | 5490 | 5490 | 0 | 5714 | 5714 | 0 |
| `/funding` | 4285 | 4285 | 0 | 4874 | 4874 | 0 |
| `/short-documentary-competition` | 10690 | 10690 | 0 | 7306 | 7307 | +1 |
| `/the-rta-accelerator` | 1384 | 1384 | 0 | 1775 | 1775 | 0 |
| `/enterprise` | 6823 | 6823 | 0 | 5578 | 5578 | 0 |
| `/frequently-asked-questions` | 1866 | 1866 | 0 | 2752 | 2752 | 0 |
| `/legals/terms-of-use` | 11452 | 11466 | +14 | 14381 | 14395 | +14 |
| `/legals/privacy-policy` | 7942 | 7946 | +4 | 10053 | 9902 | -151 |
| `/no-such-page-xyz` | 900 | 900 | 0 | 844 | 844 | 0 |

Document height matches the source to within 1 px at both widths on every page, except one wrapped line on the phone layout of two modules (−22 / −23 px) and the legal pages (+14 px; the privacy policy is −151 px at 390 —
filler text that wraps differently). Interactions were checked numerically against the source:
film-grid hover / "Load more", glide band travel, drawn grid lines (`top top → bottom bottom`), logo strip speed (60 px/s), accordion timings, player states, page transition, quiz. No console errors on
any page; **axe: 0 violations** on every page checked, at both widths.

## Credits and licences

GSAP (standard no-charge licence) · Lenis (MIT) · Instrument Sans, Fragment Mono, Bodoni Moda (SIL OFL 1.1; the wordmark is drawn from Bodoni Moda) · country flags from [Twemoji](https://github.com/jdecked/twemoji) © Twitter / contributors (CC-BY 4.0) ·
photography from Unsplash (Unsplash Licence — sources in `tools/photos.manifest.json`) · everything else is original to this project.
The audit analyses a third-party site for learning purposes; no captures of that site are included in this repository.
