# UI/UX Audit — `theartofdocumentary.com` (part 1: `/about` · part 2: the other 23 URLs)

*Captured 9–10 Nov 2026 with headless Chrome (puppeteer-core), the Chrome DevTools protocol, axe-core 4.10 and a read-through of the page's shipped CSS and JavaScript.
Everything below was measured or read from the live page — nothing is guessed. Where something is an inference, it says so.*

> **Scope of part 1.** One page (`/about`), at five viewports (390, 768, 1280, 1440, 1920 px wide), in its default state plus the menu, the hover states, the cookie panel and the scroll-triggered subscribe popup.
> **Not covered in part 1:** the other routes (see **part 2**, §12–14), real-device touch behaviour, screen-reader testing, server/CDN configuration.

---

## 0. Contents

1. [Executive summary](#1-executive-summary)
2. [Page anatomy](#2-page-anatomy)
3. [Visual design system](#3-visual-design-system) — colour, type, spacing/grid, imagery, the `rem` trick
4. [Responsive behaviour](#4-responsive-behaviour)
5. [Interaction & motion design](#5-interaction--motion-design)
6. [UX findings, prioritised](#6-ux-findings-prioritised)
7. [Code audit](#7-code-audit)
8. [Scorecard](#8-scorecard)
9. [How the replica was built and verified](#9-how-the-replica-was-built-and-verified)
10. [Recommendations](#10-recommendations)
11. [Appendix — tokens, easings, selectors](#11-appendix)
12. [Part 2 — site map and component model](#12-site-map-and-component-model)
13. [UX findings from the other templates](#13-ux-findings-from-the-other-templates)
14. [What the replica does differently on these pages](#14-what-the-replica-does-differently-on-these-pages) — incl. the full page-height table

---

## 1. Executive summary

**What the page is.** An "About us" page for an online documentary-filmmaking school, built as a *scroll-told story*: a 3-screen-tall hero where six photographs fly toward you, a statement that wipes from dim to white line by line, four numbered promises, a full-bleed founders section that slides over the page, then a compact footer. The whole page is black, set in one grotesque + one mono face, with a single orange accent.

**What it does very well**

| | |
|---|---|
| **A genuinely coherent system** | One palette (black, white, `#ffa200`), two typefaces, one spacing unit, one default easing curve. Nothing on the page looks like it came from somewhere else. |
| **Typographic hierarchy** | Display text is huge and tight (92/82 px at −0.04 em), body text is small and calm (20/24), and every label is a 14 px uppercase mono. The contrast in scale *is* the design. |
| **Motion that carries the content** | The hero fly-through, the line-by-line statement wipe and the founders' slide-over are all scroll-scrubbed (no timers), so the reader controls the pace. Timings and easings come from a small shared token set. |
| **Proportional scaling** | Every dimension is in a unit that is exactly 1/1440 of the viewport width (1/375 on phones), so the composition never reflows between 481 px and any desktop width — it just scales. |
| **Micro-interactions** | The button wipe, the social-arrow swap, the menu's indent-on-hover and the course-cover reveal are crisp, consistent and cheap. |

**What holds it back** (details in §6)

1. **A promotional popup interrupts the story after only ~450 px of scrolling**, locks scrolling, and covers the page with a discount offer — on a page whose job is trust and narrative. *(P1)*
2. **The hero consumes 34 % of the page height** (2 700 of 7 819 px at 1440×900) to show six decorative images; the only cue is a tiny "scroll to explore". *(P1)*
3. **The statement is unreadable until you scroll it**: the un-revealed copy is `#333` on `#000` = **1.7 : 1**, below even the 3 : 1 large-text threshold. *(P1)*
4. **Tablets get a shrunken desktop**: between 481 and ~1100 px the layout scales down linearly, so body text is 10.7 px and mono labels are **7.5 px** at 768 px wide. *(P2)*
5. **Keyboard users can't see where they are**: `outline: 0` is applied to every button and input and nothing replaces it. *(P2)*
6. **Accessibility plumbing is thin**: axe reports 2 violations (`aria-label` on non-interactive `div`s; the cookie panel outside any landmark), the menu has no focus handling or Escape, and informative images (founder portraits, award laurels) have empty `alt`. *(P2–P3)*
7. **Weight on a content page**: a 1.15 MB application chunk, analytics + session-recording scripts, and 39 country-flag SVG requests fired on every load for a phone-number field most visitors never see. *(P3)*

**Overall:** a strong, distinctive, well-engineered visual system whose weaknesses are almost all *policy* decisions (the popup, the hero length, the contrast of the reveal) and *accessibility plumbing*, not craft problems. Score: **see §8**.

---

## 2. Page anatomy

All numbers measured at **1440 × 900**, `rem` = 1 px.

| # | Section | y-range | Height | What it is |
|---|---|---|---|---|
| – | Preloader | fixed, z 9 999 999 999 | 100 vh | Black cover, `[ NAME ] [ NN PERCENT ]`, lifts at 100 % |
| – | Nav bar | fixed | **81** (24 + 33 + 24) | Logo (72×26), `MENU` (76×33) and `JOIN NOW →` (130.5×33) pills |
| 1 | **Hero — flying images** | 0 – 2 700 | **300 svh** | Sticky 100 svh stage; centred label + display heading; six absolutely-placed photos in a `perspective: 100vw` box |
| 2 | **Scroll text** | 2 700 – 3 650 | 950 | 110 pad · tag in col 1 · 920 px statement (72/65, 10 lines) · 110 pad |
| 3 | **Numbered values** | 3 650 – 4 525 | 875 | Label + 3-line heading, then a 2×2 grid of `[ 01 ]`–`[ 04 ]` blocks |
| 4 | **Founders slide-over** | 4 525 – 7 335 | 2 810 | Sticky image stack · 100 vh spacer · two 100 lvh bio panels · sticky corner portrait |
| 5 | Footer | 7 335 – 7 819 | 484 | Logo, invitation + orange CTA, two link columns, legal row |
| – | Cookie notice | fixed, bottom-right | 318 × 48 | White bar: text · `MANAGE` · `ACCEPT` |
| – | Subscribe popup | fixed, z 9 999 | 920 × 518 | Appears after ~450 px of scroll |

**Total page height:** 7 819 px at 1440 × 900 · 6 436 at 390 × 844 · 7 434 at 768 × 1024 · 6 470 at 1280 × 720 · 9 705 at 1920 × 1080.
(It varies because the hero, founders panels and spacer are *viewport-height* units while the rest is viewport-*width* units.)

**The column system.** Content hangs from four vertical lines at 1440: **x = 24** (page gutter, section labels) · **x = 378** (24 + 354 — headings, bios, the numbered grid) · **x = 968** (24 + 8 × 118 — second grid column, footer "Pages") · **x = 1204** (24 + 10 × 118 — footer "Courses", the founders' corner portrait). They come from a 12-column grid (`1fr`, 24 px gap → 94 px columns, 118 px pitch) used by the footer and the menu, and from fixed widths (330 / 448 / 802 / 920) elsewhere.

**Reading order / information scent.** Label (what is this?) → big statement → supporting detail. Every section starts with an orange mono label at the page gutter (`ABOUT US`, `PLAIN AND SIMPLE`, `OUR AIM`, `CO-FOUNDER, DIRECTOR`), which works as a consistent wayfinding device.

---

## 3. Visual design system

### 3.1 Colour

| Token | Value | Used for |
|---|---|---|
| Black | `#000` | `main` background, preloader, menu, footer |
| Page | `#121212` | `body` background (shows only outside `main`: overscroll, popup backdrop) |
| White | `#fff` | Primary text, logo, outlines at 20 % |
| **Orange** | `#ffa200` | The only accent: labels, hover state, CTAs, "NEW" pills, ribbon |
| Dim | `#333` | Un-revealed statement text |
| Hairline | `#232323` | Divider above the menu's legal row |
| Selection | `#ccc4b9` | `::selection` — a warm grey, the only off-palette tone |
| Wipe | `#79837a` | Page-transition columns (not visible on this page) |
| "Red" | `red` | The blinking dot beside the active menu item (`nav_colorChange`, 1 s) — off-palette |

**Contrast (WCAG 2.2, computed):**

| Pair | Ratio | Verdict |
|---|---|---|
| `#fff` on `#000` | 21.0 : 1 | AAA |
| `#fff` on `#121212` | 18.9 : 1 | AAA |
| `#ffa200` on `#000` | 10.4 : 1 | AAA — the accent is very safe on black |
| `#ffa200` on `#fff` | **2.0 : 1** | **Fails** — used in the popup ("40 % off" highlight and body copy) |
| `#333` on `#000` | **1.7 : 1** | **Fails** — the un-revealed statement (by design; see §6) |
| `rgba(0,0,0,.62)` on `#fff` | 6.2 : 1 | Pass ("Manage", "Always active" in the cookie bar) |
| 20 % white outline on black | ≈ 1.7 : 1 | Below the 3 : 1 non-text threshold (nav pill borders); the *label* carries the meaning, so low impact |

### 3.2 Typography

Two families, loaded from the site's own origin (`font-display: swap`, the two regular faces preloaded):

- **Founders Grotesk** (400 and 700) — neo-grotesque, small x-height (44 / 63 of cap-height = 0.70), narrow-ish.
- **Founders Grotesk Mono** (400) — advance 0.614 em, cap-height 0.63 em.

Both are commercial faces. The replica substitutes open-licence look-alikes (§9), calibrated by measurement.

**The scale** (desktop @1440 / phone @375; `rem` units; weight 400 on this page):

| Class | Role on the page | Desktop size / line / tracking | Phone size / line / tracking |
|---|---|---|---|
| `L` | Hero heading | 92 / 82 / −0.04 em | 52 / 48 / −0.045 em |
| `M` | Statement, section headings, founder names | 72 / 65 / −0.04 em | 40 / 38 / −0.02 em |
| `MC` | Menu course links | 40 / 32 / −0.04 em | 32 / 30 / −0.02 em |
| `XS` | Footer invitation | 34 / 32 / −0.02 em | 24 / 22 / −0.02 em |
| `P` | Body copy, value headings | 20 / 24 / −0.01 em | 18 / 22 / −0.01 em |
| `SP` | Cookie text, popup body | 14 / 16 / −0.01 em | same |
| `XSP` | Popup eyebrow | 12 / 12 / −0.02 em · uppercase | same |
| `mono` | Section labels | 20 / 20 / −0.02 em · uppercase | 14 / 12 |
| `monoS` | Buttons, links, `[ 01 ]` numbers, hints | 14 / 14 / −0.02 em · uppercase | same |
| `NCT` | "NEW" pills | 12 / 14 / −0.02 em · uppercase | same |

(`XL` 116/110, `XXL` 232/178 and the semi-bold `…B` variants exist in the stylesheet but this page doesn't use them.)

**Observations**

- **Line-height below 1 at display sizes** (82/92 = 0.89, 65/72 = 0.90) and −0.04 em tracking give the headings their dense, editorial look. It creates a real engineering problem — descenders (`y`, `g`) get clipped by the line masks used for the reveal — solved with a `padding: 0 4rem 10rem; margin-top: −10rem` pair on every split line. Elegant, but fragile: any new display class needs the same pair.
- **The mono layer does the "interface" work**: labels, numbers in brackets `[ 03 ]`, buttons, links, hints. Everything that is *about* the content rather than *the* content is mono and uppercase — a clear, learnable rule.
- **Bracket motifs** (`[ 01 ]`, `[ ↗ ]`, `[ THE ART OF … ]` in the preloader) are a recurring, cheap brand device.
- **One weight.** The page is entirely weight 400; hierarchy comes from size, colour and family only. (Bold faces are loaded for other pages and the popup heading.)
- **Mapping quirk:** the classes named `…SB`/`…B` ask for `font-weight: 600`, but only a 700 face exists, so the browser silently uses the 700 face.

### 3.3 Spacing and grid

Everything is a multiple of 2–4 px at 1440. The tokens actually used:

`1 · 2 · 4 · 8 · 9 · 10 · 12 · 14 · 16 · 20 · 22 · 24 · 32 · 40 · 60 · 64 · 80 · 110 · 260 · 354`

| Rule | Value |
|---|---|
| Page gutter | 24 (12 on phones) |
| Grid gap | 24 |
| Section padding (vertical) | **110** (60 on phones) |
| Bottom safe zone for sticky panels | 80 (40 on phones) |
| Label → content | 9–10 (the label's `margin-top` aligns its cap line with the heading's) |
| Heading → body | 60 (40 on phones) |
| Button | padding 10 / 24 / 9, radius 99, gap 8 |

The `margin-top: 9–10` on the orange labels is a small, careful detail: it optically aligns the label's baseline with the first line of the 72 px heading beside it.

### 3.4 Imagery and iconography

- **Hero photos:** six images in two ratios — portrait 1792 × 2036 (0.88) and landscape 1792 × 1008 (16 : 9) — all 448 px wide, positioned at hand-picked offsets (top-left 24/82; top-right 24/82; bottom 166/24; …). Dark, cinematic, behind-the-scenes stills. They are the page's emotional content.
- **Founders' backgrounds:** two 16 : 9 desktop crops (5760 × 3240 source) and two portrait phone crops (1500 × 2720) — `<picture>` with a `max-width: 480px` source.
- **Corner brackets** (`corners` class): eight 1 px gradients draw four L-shaped corners around the small founder portrait, 8 px arms. A pure-CSS viewfinder motif that echoes the `[ ]` text brackets.
- **Award laurels / outlet logos:** eight and six 376 × 240 tiles per founder, white on transparent. They are the page's *proof* content.
- **Icons:** one 8×9 arrow (a 3-stroke SVG path), one 8×8 "↗" built from two paths, nothing else. No icon font.
- **Course covers** (menu): 330 × 460 portraits, one per course, revealed on hover.

### 3.5 The `rem` trick — the page's technical signature

```css
:root            { --dw: 1440; }
@media (max-width: 480px) { :root { --dw: 375; } }
html             { font-size: calc(100vw / var(--dw)); }
```

So `1rem = 100vw / 1440` (1 px at 1440, 1.33 px at 1920, 0.53 px at 768) and **every** length in the stylesheet is written in `rem`. Consequences:

| ✅ | ⚠️ |
|---|---|
| The composition is pixel-faithful to the design file at 1440 and scales perfectly to any width; no fluid-type formulas, no breakpoints between 481 and ∞. | Below ~1100 px text becomes small (§4). Above ~1920 px it keeps growing with no cap (at 2560 px body copy is 35.6 px). |
| Designers hand off in "px at 1440" and developers type the same numbers. | `rem` no longer follows the user's browser font-size setting — **users cannot enlarge text** (WCAG 1.4.4 risk). |
| One media query (≤480 px) covers all responsive logic. | Zooming the browser changes `vw`-based `rem`, so zoom behaves differently from a normal site. |

---

## 4. Responsive behaviour

There are exactly **two layouts**: *desktop* (≥ 481 px, scaled by `vw/1440`) and *phone* (≤ 480 px, scaled by `vw/375`). One breakpoint, no tablet layout.

| Viewport | `rem` | Body `P` | `SP` | `monoS` | `XSP` | Hero `L` |
|---|---|---|---|---|---|---|
| 390 (phone) | 1.04 px | 18.7 px | — | 14.6 px | — | 54 px |
| **768 (tablet)** | **0.533 px** | **10.7 px** | **7.5 px** | **7.5 px** | **6.4 px** | 49 px |
| 1024 | 0.711 px | 14.2 px | 10 px | 10 px | 8.5 px | 65 px |
| 1280 | 0.889 px | 17.8 px | 12.4 px | 12.4 px | 10.7 px | 82 px |
| 1440 | 1 px | 20 px | 14 px | 14 px | 12 px | 92 px |
| 1920 | 1.333 px | 26.7 px | 18.7 px | 18.7 px | 16 px | 123 px |

**Phone layout changes** (all verified): hero shortens to 100 svh and the scroll fly-through is switched off (three of six images are hidden; the other three simply arrive); the statement and values stack to one column; the founders' corner portrait is removed; images grids become 3-up at 27 vw; the footer becomes a 2-column grid; the menu becomes a column-reverse flex list with 2-column page links and a full-width legal bar; the cookie notice becomes a full-width bar; the popup becomes a single column with the image on top.

**Things that work:** no horizontal scroll at any width tested; touch uses native scrolling (Lenis `syncTouch` is off); sticky panels use `svh`/`dvh`/`lvh` deliberately (`svh` for the hero so the URL bar can't reveal black, `lvh` for the bio panels, `dvh` for the menu).

---

## 5. Interaction & motion design

### 5.1 Smooth scroll

Lenis, driven from GSAP's ticker so ScrollTrigger and the scroll position never disagree.
`duration: 1.2` · `easing: t => min(1, 1.001 − 2^(−10t))` (expo-out) · `wheelMultiplier: 1.8` · vertical only · touch left native. Scrollbars are hidden **everywhere** (`width: 0; scrollbar-width: none`), `overscroll-behavior: none`, and `history.scrollRestoration = 'manual'` with a forced `scrollTo(0, 0)` on load.

### 5.2 Preloader

Black cover containing `[ NAME ]` and `[ NN PERCENT ]` side by side (stacked on phones).

- **Progress:** a Pace-style simulated loader that follows real activity (document, fonts, requests, event-loop lag). Observed on a fast machine: counter reaches 100 at ≈ 1.3 s.
- **On 100 %:** the `<html>` element gets a `ready` class, which arms every entrance transition on the page, and the exit timeline runs:
  - cover `y: 0 → −100 %` · 1 s · `o3`
  - label/counter `y → −110 %` · 0.3 s · `o3` · starting at 5 % of the previous tween
  - nav `y: −100 % → 0` · 1 s · `o3` (after the cover)
- Total: gone at ≈ 3.2 s on a fast machine. (The *home page* variant also scrolls a stack of ten photos up; the About page doesn't.)

### 5.3 Entrance text

Headings are split into **visual lines** (measured by word `top` positions, re-measured 150 ms after a resize) and each line is wrapped in `overflow: hidden`. Lines start at `translateY(120 %)` and rise with `0.7 s cubic-bezier(.25, 1, .5, 1)` once `html.ready` is set, each with `--delay = start + (lineIndex + 1) × 0.1 s` (hero label starts at 0.3 s; heading at 0.25 s; "Scroll to explore" fixed at 0.8 s).

### 5.4 Hero: the fly-through (the page's showpiece)

Geometry: six images, `perspective: 100vw` on their container, each starting at `translateZ(−200vw)` (so one-third scale, clustered on the centre), opacity 0.

1. **Intro** (once, ~2.4 s after mount): images 1–3 tween `z → 0` and `opacity → 1`, **0.8 s, `o3`**, starting at 2.4 s, 2.56 s, 2.72 s (each at "`<20%`" of the last).
2. **Scrub** (after the intro completes; skipped on phones): `z → innerWidth` for **all six** with `stagger 0.1`, ease `io1`, scrubbed from scroll 0 to *(header bottom at 60 % of the viewport)* = 2 160 px at 900 px tall. Because `z = perspective`, each image reaches the camera plane and flies past — scale tends to infinity, so it sweeps over the viewport and is then clipped.
3. **Fade-in of the late three** (images 4–6): `opacity → 1`, `stagger 0.3`, linear, scrubbed over scroll 0 → 70 % of header height (1 890 px).

The *measured* result: at y = 900 image 4 is 10.5 % opaque; at y = 1 350 image 5 is 45.7 %; at y = 1 800 image 6 is 80.9 % — an exact match for the maths above.
*Minor dead code:* the CSS also sets `filter: blur(-15px)` — a negative blur is invalid, the declaration is dropped, so there is no blur (the visuals confirm it).

### 5.5 Statement wipe

Two copies of the paragraph occupy the same box: a dim base (`#333`) and a white overlay (`aria-hidden`) whose **lines** are `background-clip: text` boxes with `width: var(--scale)`, `overflow: clip`, `white-space: nowrap`. One scrubbed trigger (start `clamp(0% 80%)`, end `clamp(70% 50%)`) sets each line's `--scale = clamp((progress − k/n) × n, 0, 1)`: lines reveal strictly one after another, left to right. Making the overlay's lines shrink-wrap (`align-items: flex-start`) means `100 %` is exactly the text width, so the wipe feels even.

### 5.6 Founders slide-over (seven scrubbed tweens)

| # | Target | From → To | Scroll range (trigger: start → end) |
|---|---|---|---|
| 1 | Image frame | 80 % × 80 dvh → 100 % × 100 vh (phones start at 50 %) | spacer: top-at-bottom → bottom-at-bottom (3 735 → 4 635) |
| 2 | Image frame | blur 0 → 10 px | first panel: top-at-bottom → bottom-at-bottom (4 635 → 5 535) |
| 3 | Overlay | black .6 → 1 | section end sweeping the viewport (6 435 → page end) |
| 4 | Image 1 | opacity 1 → 0 (reveals image 2) | first panel: bottom-at-bottom → bottom-at-top (5 535 → 6 435) |
| 5 | Corner portraits | `y 0 → −100 %` (swap) | same as 4 |
| 6 | Overlay | black 0 → .6 | first panel: top-at-bottom → bottom-at-99 % (4 635 → ≈ 5 544) |
| 7 | Whole image stack | `y 0 → 10 %` (parallax drift) | section end sweeping the viewport |

Measured at y = 4 950: blur 3.5 px, overlay 0.208; at 5 400: 8.5 px, 0.506; at 5 850: first image at 65 %, portraits at −85.4 px; at 6 750: overlay 0.86, stack drifted 183 px — all reproduced exactly in the replica.

### 5.7 Nav bar and menu

- **Bar:** fixed, but moves with the scroll *delta* (`quickSetter` on `y`): clamp `0…81` px while scrolling down, retracts as you scroll up, and returns fully when you approach the page bottom. (So the menu button is unreachable while reading down until you scroll up a little.)
- **Open:** Lenis stops; the panel's height tweens `0 → 100 dvh` and its black background `y −100 % → 0` (1 s, `o4`); left links/headings stagger in (`y 100 % → 0`, 0.5 s, 0.05 s stagger), right links likewise (0.7 s), login button fades up (+0.3 s), the legal bar drops in. The Menu button turns **orange** and reads **CLOSE**.
- **Hover (desktop):** page links indent 8 px and turn orange (0.4 s); course links indent 24 px and turn orange, and after 50 ms that course's cover slides up in the right column (`y 101 % → 0`, 1 s, `o4`). Leaving the column slides all covers away.
- **Active page:** a `●` before the link blinks transparent ↔ **red** every 0.5 s.

### 5.8 Buttons, links, small controls

| Control | Behaviour |
|---|---|
| **Pill button** (`border`, `orange`, `light`, `dark`, `orange-dark`) | A pseudo-element fill wipes up from the bottom (`scaleY 0 → 1.02`, origin bottom, **0.5 s `cubic-bezier(.25,1,.5,1)`**); label/outline colour change in 0.35 s linear; arrow nudges +2 px (0.3 s). Desktop only — phones get no hover. (Verified at Web-Animations level: the fill really does run to 100 %.) |
| **Text link** | 1 px underline scales in from the left (`scaleX 0 → 1`, 0.3 s), exits to the right. Phones use a native underline instead. |
| **Social `[ ↗ ]`** | Two arrows in one 8×8 viewport: the visible one exits up-right while a second enters from bottom-left (0.4 s). |
| **Cookie bar** | `MANAGE` opens a panel (heading, options, Required "always active", Analytics toggle 28×16); `ACCEPT` stores a 365-day cookie. |

### 5.9 Subscribe popup

~1 s after load, and once the reader has scrolled **0.5 viewport heights**, a white 920 × 518 card fades in (1 s, `io2`) over a 60 % dark overlay, **Lenis is stopped**, and a CLOSE pill hangs on the card's top-right corner. Fields have floating mono labels over a 1 px underline; the phone field has a flag + dial-code selector (which is why 39 flag SVGs are requested from a CDN on every page load). Closing writes `sessionStorage.popup = 'disabled'` (and a successful subscription a one-year cookie).

---

## 6. UX findings, prioritised

Severity: **P1** — hurts the page's main job · **P2** — real usability/accessibility barrier · **P3** — polish, robustness, weight.

### P1

**F1 — Popup interrupts the story at ~450 px.**
*Evidence:* the popup is created 1 s after load and shown when scroll ≥ 0.5 × viewport height (measured: visible at y = 520, absent at y = 450). It stops smooth-scroll, covers ~80 % of the viewport, and promotes a time-limited discount.
*Why it matters:* the About page asks for trust; a coupon prompt before the reader has seen the second section undermines that and breaks the scroll-told rhythm the page is built on. It also fires on every fresh session.
*Fix:* defer until after the founders section (or exit intent), show a slim non-modal bar instead, never lock scroll, and give it `role="dialog"`, a focus trap and Escape.

**F2 — The hero is 3 screens long.**
*Evidence:* header height `300svh` = 2 700 px of a 7 819 px page (34.5 %); the headline is pinned while six photos pass. The only affordance is a 14 px mono "Scroll to explore" that fades in at 0.8 s.
*Why it matters:* strong first impression, but no content or CTA is available for ~2.4 screens, and (inference, not measured) a wheel multiplier of 1.8× plus inertia makes it easy to overshoot. On phones the designers already shortened it to 100 svh and dropped the effect — evidence that it is dispensable.
*Fix:* 200 svh, or let a CTA ("Meet the founders ↓") live inside the stage.

**F3 — The key statement fails contrast until revealed.**
*Evidence:* `#333` on `#000` = 1.7 : 1. Reading depends on the wipe; if the reader stops mid-section, half the statement stays near-invisible. The white overlay is `aria-hidden`, so assistive tech reads only the dim copy (fine) — but *low-vision* users cannot read it.
*Fix:* raise the resting colour to ≥ 3 : 1 (≈ `#6b6b6b`), keep white as the "read" state. Respect `prefers-reduced-motion` by showing it fully revealed.

### P2

**F4 — Tablets get a shrunken desktop.** (Table in §4.) At 768 px the 14 px mono labels are 7.5 px and the 12 px popup eyebrow is 6.4 px — below any legibility floor. *Fix:* clamp the unit (`max(1px, 100vw/1440)` below 1100 px) or add a 481–1100 layout.

**F5 — No visible keyboard focus.** `button, input, select, textarea { outline: 0 }` and nothing replaces it; the cookie, popup and menu are all unusable by sight for keyboard users. *Fix:* a `:focus-visible` ring in the accent colour (the replica adds one).

**F6 — Menu has no focus handling.** The panel opens over the page but focus stays on the button; Tab walks through hidden page content; there is no Escape handler; the closed panel is not `inert`. *Fix:* move focus in, trap, `inert` the rest/closed state, Escape to close.

**F7 — Text cannot be enlarged.** Because every size is `vw`-derived `rem`, the browser's default-font-size setting has no effect. *Fix:* keep `rem` tied to the user's font size and drive the layout scale from a `vw`-based custom property, or at minimum put a `max()` floor under every size so the user's setting can win.

**F8 — The red blinking dot is off-palette and perpetual.** A 1 s infinite colour toggle (to pure red) next to the active page link; it never stops and ignores reduced motion. *Fix:* use the orange accent, and stop it under `prefers-reduced-motion`.

### P3

**F9 — Semantics.** axe: *serious* `aria-prohibited-attr` (the split-text components put `aria-label` on a plain `div`); *moderate* `region` (cookie panel outside landmarks). The document outline is odd: the small label "About Us" is the `h1`, the big display text is an `h2`. Founder portraits and award laurels use `alt=""` even though they carry meaning. No skip link.

**F10 — Weight and third parties.** 1.15 MB `_app` chunk (GSAP + ScrollTrigger + CustomEase + Lenis + loader + nav + popup + CMS rich-text), 140 KB framework, 116 KB main, 112 KB `nomodule` polyfills; Google Tag, Google Analytics, a conversion-measurement call and a session-recording script (Hotjar bootstrap present in the bundle); **39 twemoji SVG requests** from a public CDN for the popup's phone selector; six 4 480 w `srcset` preloads for hero images (three of which are `display: none` on phones). Measured CLS 0.038 (fonts + cookie bar), no long tasks.

**F11 — Dead and leaked styles.** `filter: blur(-15px)` (invalid); a full carousel stylesheet (`.slick-*`) on a page with no carousel; CMS-studio CSS (`[data-testid=hotspot-image-input]`) in the public bundle; z-index inflation (`9999999999` for the preloader).

**F12 — Scrollbars hidden everywhere.** Combined with a 3-screen hero and smooth scroll, readers get no progress cue. A thin custom progress indicator would help.

### Strengths worth keeping (do not "fix" these)

- The one-accent discipline: orange appears *only* on labels, hover and primary CTAs.
- Section labels at the gutter — a perfect, repeatable wayfinding pattern.
- Scroll-scrubbed (not timer-driven) motion: the reader is always in control.
- The 12-column footer/menu grid and the viewport-proportional unit: consistent, predictable, easy to maintain.
- Careful typographic detail: optical label alignment, bracket motifs, mono for "interface".

---

## 7. Code audit

### 7.1 Stack (observed)

| Layer | What |
|---|---|
| Framework | **Next.js** (Pages Router; `__NEXT_DATA__`, `x-nextjs-cache: STALE`, `s-maxage=60, stale-while-revalidate` → ISR), React |
| Hosting | nginx behind CloudFront (HTTP/3 advertised) |
| CMS | **Sanity** — page document `aboutPage` with four content components, plus a global `settings` document (nav, footer, popups, banners, preloader images) |
| Images | Sanity CDN through Next's image optimiser (`/_next/image`, widths 240 → 4 480, q = 80) |
| Styling | **CSS Modules** (hashed `module_class__hash`) + one global sheet; no utility framework |
| Animation | **GSAP 3.15** + ScrollTrigger + CustomEase, **Lenis** |
| Loader | a Pace.js-derived progress simulator |
| Analytics | Google Tag (GA4) + conversion measurement; Hotjar bootstrap; cookie-consent gating |
| Commerce | Kajabi (login, shop links) |
| Flags | twemoji 14 SVGs from cdnjs |

### 7.2 Content model → components

```
aboutPage
├─ hero            { type: "flyingImages", tag, heading, images[6] }
├─ scrollText      { color, tag, text }
├─ numberedTextBlocks { tag, heading, blocks[4]{ heading, body } }
└─ slideoverImage  { sections[2]{ tag, heading, body (portable text), imageGrid[≤8],
                                  backgroundImage, backgroundImageMobile, smallImage } }
settings           { nav/footer links, popup*, banners, preloaderImages[10], … }
```

Each section is lazily code-split (`chunks/8903` hero variants 24 KB, `811` scroll text 5 KB, `1578` numbered blocks 1 KB, `6599` founders 4 KB, `3615` footer 20 KB). The page entry chunk is 635 bytes — a good sign: authoring is content-driven and the shell is thin.

### 7.3 CSS architecture

Six stylesheets: a 66.9 KB global sheet (reset, fonts, tokens, **every shared component** — nav, buttons, cookie, popup, text scale, `ani` helpers, slick, flip-clock …), a 23.6 KB sheet (hero variants, video modal, other sections), and four 1–3 KB per-section modules loaded only here.
Strong conventions: one `@media (max-width: 480px)` per module, `rem` everywhere, shared animation helper classes (`moveUp`, `moveUpF`, `fadeUp20/50`, `blurFade`, `mediaParallax`, `heroMediaClip`, `fillWidth`) armed by a single `html.ready` class and a per-element `--delay`.
Weak spots: the global sheet carries other pages' components; unused vendor CSS; no logical properties; colours repeated as literals (`#ffa200` ×40+) instead of variables — only `--gfs` and `--dw` are custom properties.

### 7.4 JavaScript patterns worth noting

- **Easing registry:** 27 named cubic-bezier curves (`o1…o6`, `i1…i6`, `io1…io6`, `in1/out1/inOut1…`, `quartIn/Out/InOut`) registered once with `CustomEase`; every tween uses a name. Easy to audit, easy to retune.
- **`gsap.context()`** around every effect with `revert()` on cleanup — React-safe.
- **`ScrollTrigger` `clamp()`** positions (`clamp(0% 80%)`) so triggers never run beyond the scrollable range.
- **Split text** is a custom component: measure → group by `top` → rebuild → re-run on resize; `aria-label` on the container and `aria-hidden` on the lines (the source of the axe violation).
- **Nav** quick-setter follows scroll delta, no per-frame layout reads.

### 7.5 Z-index inventory

`main 1` · `cookie 20` (desktop) / `999` (phone) · `nav 100` · `banner 101` · `video modal 200` · `modal root 995` · `wipe 999` · `transition columns 1000` · `popup 9 999` · **`preloader 9 999 999 999`**. Works; a named scale (10/20/30…) would be safer.

---

## 8. Scorecard

| Dimension | Score /5 | Notes |
|---|---|---|
| Visual hierarchy | **5** | Scale contrast does all the work |
| Typography | **4.5** | Superb tracking/size system; tablet sizes and non-scalable text cost half a point |
| Colour & contrast | **3.5** | Accent is excellent; `#333` reveal text and orange-on-white popup fail |
| Layout & grid | **4.5** | Consistent columns, one unit; tablet layout missing |
| Motion design | **5** | Scrubbed, tokenised, purposeful; one off-palette perpetual blink |
| Navigation & IA | **4** | Clear, compact; menu hides while reading down; no focus management |
| Accessibility | **2.5** | Two axe violations, no focus ring, no dialog semantics, empty alts |
| Performance | **3.5** | Fast on desktop, heavy script and avoidable third-party requests |
| Content design | **4** | Concise, label → statement → detail; popup undermines trust |
| Conversion UX | **3** | Strong brand pull, but the popup is premature and the hero long |
| **Overall** | **≈ 3.9 / 5** | A beautiful, disciplined system held back by policy and plumbing |

---

## 9. How the replica was built and verified

**Location:** `documentary-about-replica/` — a static site (HTML + 4 CSS files + 9 ES modules), served by a 40-line Node server on **port 4660**.
GSAP 3.15.1 (ScrollTrigger, CustomEase) and Lenis 1.3.27 are vendored in `vendor/`; fonts are self-hosted.

### 9.1 What is identical to the source

Layout geometry, type scale, spacing, colours, the `rem` system and breakpoint, every animation (same libraries, same timelines, same easing curves, same trigger positions), the preloader sequence, hover/interaction behaviour, the menu, cookie notice and popup (geometry), and the page's total height at five viewports.

### 9.2 Deliberate differences (and why)

| Area | Replica | Reason |
|---|---|---|
| **Copy** | Original stand-in text written to match each block's length and line count | The source's words are its owner's copyrighted content. Edit `index.html` to use your own. |
| **Brand** | "The Reel Truth Academy", wordmark **RTA** drawn from an open-licence Didone (vector path) | Avoids reproducing someone else's logo/name. |
| **Photography** | 18 Unsplash-licence stills, cropped to the same ratios (`tools/fetch-photos.cjs`; credits in `tools/photos.manifest.json`) | Source photos are copyrighted. Replace the files in `assets/img/` (same names) to use yours. |
| **Award / outlet logos** | Generated laurel and wordmark SVGs with fictional festivals | Third-party trademarks. |
| **Fonts** | Instrument Sans 400/600 and Fragment Mono 400, rescaled with `size-adjust` (87.5 % / 92 %) and a small tracking correction | The source uses commercial faces. Measured: cap/x-height within ~2 %, text widths within ~1–3 %. |
| **Analytics / IDs** | None | The source's analytics and recorder IDs belong to its owner and were intentionally not carried over. |
| **Forms** | Client-side only — validation and a thank-you state, nothing is sent | There is no back end here. |
| **Popup artwork** | A row of tilted course "boxes" built from the course covers | Stand-in for the source's product-box art. |
| **Routes** | Links other than *Home/About/logo* are inert; the page-transition wipe is not built | Single-page replica. |
| **Accessibility additions** (invisible to mouse users) | Skip link, `:focus-visible` ring, `inert`/`aria-hidden`/Escape/focus on the menu, `role="navigation"` on the menu, dialog roles on the popup, reduced-motion and `prefers-contrast` fallbacks for the statement; under `prefers-reduced-motion` every endless loop — marquees, the slow push-ins on stills and the player, the blinking dot, the enterprise demos — holds still (`tools/qa/pages/check-reduced-motion.cjs`) | Fixes F5/F6/F9 without changing the visuals. |

### 9.3 Verification results

Method: the same scripts were run against both sites in headless Chrome (puppeteer-core), screenshots and numeric state captured at identical scroll positions.

**Layout** (every measured element: position and size; threshold ±2.5 px):

| Viewport | Elements compared | Out of tolerance |
|---|---|---|
| 1440 × 900 | 50 | **1** — the hero heading *box* is 7 px wider (different words, not different layout) |
| 390 × 844 | 50 | **1** — same heading box (+6 px) |
| 768 × 1024 | 50 | **1** — same heading box (+4 px) |

Nav (81 px), logo, both buttons, section labels, scroll hint, every numbered block, founder panels, corner portrait, footer columns and the meta row are **pixel-identical** (0.0 delta). Total page height is **identical at all five viewports** (6 436 / 7 434 / 6 470 / 7 819 / 9 705).

**Animation state** (17 scroll positions at 1440; 15 at 390):

| Quantity | Worst absolute difference |
|---|---|
| Nav translate | 0 px |
| Hero image opacity (6 images × 17 positions) | 0 |
| Hero image depth (`translateZ`) | 0 px |
| Hero image projected rectangle | 2.9 px (desktop, on images scaled > 10×) · 0.1 px (phone) |
| Statement reveal (mean %) | 0.01 % |
| Founders frame width / height | 0 px |
| Frame blur, overlay alpha, background opacity, portrait translate, stack parallax | identical to the printed precision at every position |

**Interactions** (1440): join-button hover → colour `rgb(0,0,0)`, outline `#ffa200` 1 px, fill `scaleY(1.02)`, arrow `+2 px` — identical; menu opens to 900 px, Lenis stops, button reads "Close", closes to 0, Lenis restarts — identical.
**Popup**: card 920 × 517 (source 518); form column, title, fields and button within 1 px.
**Console:** no errors or warnings on the replica.
**Accessibility scan (axe 4.10):** replica default state — **0 violations** (source: 2). Open menu — **0**. Popup open — 1 (`color-contrast`: the orange highlight on white, 2.0 : 1 — kept deliberately because it is the source's own design; see §3.1).

Evidence images (source | replica pairs for the About page at desktop and phone, plus the menu and popup) were produced with `tools/qa` during the study. They are not part of this repository because the left half of each is a capture of the source site; regenerate them locally with `tools/qa/pairs.cjs` and `tools/qa/pages/shot.cjs` (see `tools/qa/README.md`).

### 9.4 Known limits

- With different copy and a different font, **line breaks inside paragraphs can differ** from the source; the stand-in copy was tuned so every block matches at 1440 and 390, but other widths may wrap differently.
- The cookie bar is 9 px narrower than the source's because the stand-in sans sets that 26-character string ~3 % narrower.
- The hero heading box is 4–7 px wider (word shapes).
- Real-device touch, Safari/Firefox rendering and screen readers were not tested.

---

## 10. Recommendations

If this page were being *improved* rather than replicated, in order of impact:

1. **Move the popup** to after the founders section and make it a non-blocking bar; add dialog semantics if it stays modal. *(F1)*
2. **Shorten the hero** to ~200 svh and put one CTA on the stage. *(F2)*
3. **Lift the resting statement colour** to ≥ 3 : 1 and honour reduced motion. *(F3)*
4. **Fix the unit** so text never drops below ~14 px / 11 px (mono) — `max()` floor or a tablet layout — and honour user font size. *(F4, F7)*
5. **Add a focus ring** and menu focus management (`inert`, trap, Escape). *(F5, F6)*
6. **Clean the semantics**: real `h1`, drop `aria-label` from `div`s, add landmark for the cookie bar, alt text for the laurels/portraits, skip link. *(F9)*
7. **Trim weight**: lazy-load the phone-flag selector, drop unused carousel/CMS CSS, don't preload hidden hero images on phones, split vendor code. *(F10, F11)*
8. **Replace the red blink** with the orange accent and stop it for reduced motion. *(F8)*
9. **Add a progress cue** (thin line) now that scrollbars are hidden. *(F12)*
10. **Name the z-index scale** and move colours to CSS custom properties.

---

## 11. Appendix

### 11.1 Easing curves (CustomEase registry)

`quartIn .5,0,.75,0` · `quartOut .25,1,.5,1` · `quartInOut .75,0,.25,1` · `in1 .33,0,.68,0` · `out1 .33,1,.68,1` · `inOut1 .65,0,.35,1` · `in2 .8,0,.6,.6` · `out2 .4,.4,.1,1` · `inOut2 .8,0,.2,1` · `i1 .47,0,.745,.715` · `o1 .39,.575,.565,1` · `io1 .445,.05,.55,.95` · `i2 .55,.085,.68,.53` · `o2 .25,.46,.45,.94` · `io2 .455,.03,.515,.955` · `i3 .55,.055,.675,.19` · `o3 .215,.61,.355,1` · `io3 .645,.045,.355,1` · `i4 .895,.03,.685,.22` · `o4 .165,.84,.44,1` · `io4 .77,0,.175,1` · `i5 .755,.05,.855,.06` · `o5 .23,1,.32,1` · `io5 .86,0,.07,1` · `i6 .95,.05,.795,.035` · `o6 .19,1,.22,1` · `io6 1,0,0,1`

**Used on this page:** `o3` (preloader, hero intro), `o4` (menu, covers), `io1` (hero scrub), `io2` (popup), `quartOut` (all CSS transitions), `linear` (all other scrubs).

### 11.2 Duration tokens

`.3` (arrow, underline, cookie fade) · `.35` (colour, outline) · `.4` (menu hover, social arrow) · `.5` (button fill, popup close, cookie toggle ≈ .3) · `.7` (line entrances, menu links) · `.8` (hero images) · `1` (cover lift, menu panel, popup fade, covers) · `1.2` (Lenis).

### 11.3 Selector map used by the verification scripts

| Concept | Source (CSS-module prefix) | Replica |
|---|---|---|
| Hero | `flyingImages_header` | `.hero` |
| Hero images | `flyingImages_images > picture` | `.hero__images > .img` |
| Statement lines | `scrollText_abs .split > .wrap` | `.scroll-text__abs .split > .wrap` |
| Numbered | `numberedTextBlocks_section` | `.numbered` |
| Founders | `slideoverImage_section` | `.founders` |
| Image frame / overlay | `…_stickyImages` / `…_overlay` | `.founders__sticky` / `.founders__overlay` |
| Corner portraits | `…_smallOverflow picture` | `.founders__small-overflow .img` |
| Footer / nav | `footer` / `#nav` | `footer` / `#nav` |

### 11.4 Licences of what ships in the replica

GSAP (standard no-charge licence) · Lenis (MIT) · Instrument Sans, Fragment Mono, Bodoni Moda (SIL OFL 1.1) · photography (Unsplash Licence; sources listed in `tools/photos.manifest.json`) · all other code, copy, SVG artwork: original to this project.

---

# Part 2 — the other 23 URLs

*Captured 10 Nov 2026 with the same method as part 1 (headless Chrome, CDP, the shipped CSS and the page-builder JSON behind each route). "Observed" means measured on the live site;
"inferred" means reconstructed from CSS or code because the behaviour could not be captured.*

## 12. Site map and component model

### 12.1 Templates

The site has **24 URLs** (23 pages + a 404) built from **9 templates** and about **35 page-builder components**. Every route's content is a list of components held in the CMS; a component without
`hideShow: true` is stored but not rendered, which is why `/the-aod-accelerator` (four components in the CMS) renders **only its hero**.

| Template | URLs | Components (in order) |
|---|---|---|
| Home | `/` | hero:fullBleedCentered · glideTrack · stats · quoteFrame · courseCards · courseQuiz · pricingCards · iconTextBlocks · ctaMedia · testimonialCards · pricingCards · videoSlider · pricingTable · filmGrid · pricingCards |
| About | `/about` | (part 1) |
| Course listing | `/courses` | editorial card stack ⇄ grid toggle, marquee strips |
| Course | 7 slugs | fixed hero · accordion (breakdown) · [textMediaCards · ctaClickImages] · scrollText quote · videoSlider · stats · socialCards · pricingCards · courseCardStack · contactForm |
| Short course | `/courses/<slug>` (1) | shortCourseHero · textMediaCards (info) · ctaClickImages (as a link) · accordion (FAQ + button) · courseBanner |
| Module | 3 slugs | addOnHero · sessionsBreakdown · courseCardStack · contactForm |
| Marketing | `/certification`, `/funding`, `/enterprise`, `/short-documentary-competition`, `/the-aod-accelerator` | see §12.4 |
| Utility | `/frequently-asked-questions`, `/legals/*`, `/contact` | accordion · legal text + table of contents · contactForm |
| 404 | any | text + two buttons |

### 12.2 Patterns that recur

* **One entrance system.** Every page adds a single `ani_ready` class to `<html>` once the preloader has finished (on later visits — inferred — once the page wipe has lifted); every `moveUp / moveUpF / blurFade / fadeUp50 / mediaParallax / heroMediaClip / fillWidth` helper is armed by that one class. Delays are inline `--delay` custom properties.
* **Sticky stacks.** Three components stack full-height cards with `position: sticky; top: 0; height: 100svh`, each next card covering the previous (text/media stack, previous-winners stack, course-card stack). On phones all three degrade to an ordinary column.
* **Fixed hero + spacer.** Course pages pin the hero (`position: fixed`) and put a `100svh` spacer in the flow; a black `::after` fades in with `--opacity = min(0.8, 0.8 · scrollY / heroHeight)` while the rest of the page, on a black background, scrolls over it.
* **Four buttons, one anatomy.** Orange, light, border and dark pills; the fill wipes up from the bottom in `.5 s` (`cubic-bezier(.25,1,.5,1)`), the arrow moves 2 px; the same classes are used on links, buttons and non-interactive `div`s inside a whole-block link.
* **Hover-intent previews.** Film cards and course cards react to hover only above 480 px; phones get a tap and a "Load more" button instead.
* **Section rhythm.** 110rem vertical padding (80/60 on phones), a centred `M` heading, an orange `mono` tag; groups of 3 at a 24rem gutter.
* **Video.** Every video is a lazy `<video>` (preview loops are muted; full versions open in one shared custom player).

### 12.3 New measured motion

| Behaviour | Measured |
|---|---|
| Glide band (home) | translateY `0 → listHeight − 80rem` (484 px at 1440), linear, ScrollTrigger `start: top 70%`, `end: bottom 30%`; the band label swaps (`translateY −44rem`, `.45 s`) when the band's centre passes the second group's top |
| Quote slider (home) | 4 slides, loop, drag; each picture's transform was observed at 0 / −20 / −40 / −60 % for slides 1–4 at rest; the model `−20% × (slide − position)` (inferred) reproduces it |
| Award grid lines (competition) | 7 rules, `--scale` 0 → 1 linear from `top top` to `bottom bottom` of the section; grey `#757575` over `#333`, growing from the centre |
| Logo strips | 120rem slides, 64rem gap, **60 px/s**, endless |
| Film grid | hover: card media shrinks to 424 × 228rem inside 12rem corner marks (`.3 s`, `cubic-bezier(.25,1,.5,1)`), siblings drop to 50 % opacity, preview starts within 150 ms; ≤ 480 px: 3 cards + "Load more" reveals the rest and removes the button |
| Text/media stack (enterprise) | three 1920² looping videos (4.1 s, 5.67 s, 18 s), `object-fit: contain` in a 444 × 498rem box; phones: square 365 × 365 box |
| Player | timecode `mm:ss:cs`, 2rem bar, 186 × 105rem hover preview, vertical volume slider (56rem), controls fade `.3 s` and hide when the pointer is idle; a "[PAUSE]/[PLAY]" cursor label exists in the DOM but is `display: none` |
| Page transition | **inferred** from CSS (its frames could not be captured): 11 columns `#79837a`, `scaleY 0 → 1` from the bottom, then lifted; phones use a `#121212` panel sliding up; a frame of `100vw + 164rem` carries corner marks |

## 13. UX findings from the other templates

### P1

1. **Horizontally scrollable card rows are unreachable by keyboard.** The phone card rows (`textMediaCards`, breakdown cards) scroll with touch but have no focusable element (axe: `scrollable-region-focusable`). *Replica: `tabindex="0"` + `role="group"`.*
2. **The promo ticker fails contrast.** The separator dots use `opacity: .5` on `#ffa200` — below 4.5 : 1. *Replica: `.7`.*
3. **A closed programme still has a live route.** `/the-aod-accelerator` renders a hero with a dated "Enrol Now" (March 2023 – June 2024 in the CMS) and nothing else; the page is a dead end.
4. **Phone hero overflow on that page.** The title line measures 456 px inside a 390 px viewport (a long word at 54 px) and the information grid inherits the width. *Replica: a shorter title, so it wraps.*
5. **Meaning that exists only in motion.** The three "benefits of a team plan" panels (seat counter, progress bars, benefits) are silent looping videos with no text alternative observed; the savings figure and the benefit names are visible only in the footage.

### P2

6. Dead or stale content: the player's cursor label is styled but `display: none`; the home hero's CMS entry carries a countdown whose date has passed (it is not rendered); the quiz's result and loading panels are styled but the quiz itself loads on demand and its questions were not captured.
7. Whole-block links wrap a heading, a paragraph **and** a button-styled `div`; the accessible name is the concatenation, which reads poorly (`ctaClickImages`).
8. On touch the film-card hover affordances (corner marks, dimming, the shrinking picture) are switched off by the phone CSS, so a card shows nothing more than a still until it is tapped.
9. Pricing figures are repeated three times on the home page in three different layouts with three different headings; the first has no heading at all.
10. Bold cuts (`MB`, `XSB`, `SB`) appear on the home page (glide track, course prices) — a second weight in an otherwise single-weight system.
11. **Continuous marquees have no pause control.** The pricing ticker bands, the organisation logo strip (60 px/s), the course-listing strips and the promo banner ticker (a 20 s loop) scroll forever, in parallel with other content, for as long as the page is open — WCAG 2.2.2 asks for a way to pause, stop or hide anything that moves for more than five seconds. The source offers none. *The replica reproduces them as designed (they carry only repeated, decorative words and marks, and every one stops under `prefers-reduced-motion`, which `tools/qa/pages/check-reduced-motion.cjs` verifies on nine page states); a pause button or pause-on-hover would be the smallest fix.*

### Strengths worth keeping

* The **glide band** is a rare scroll effect that stays legible: the reading line is fixed, the content moves, and on phones it degrades to a plain list.
* **Sticky stacks** tell a sequence without carousels, and every stack has a real phone fallback.
* **One button system** and one rhythm of space across 24 URLs — the site feels like one object.
* The **comparison table** collapses into stacked cards with the row label repeated beside each icon, instead of a squashed table.

## 14. What the replica does differently on these pages

| Source | Replica | Why |
|---|---|---|
| Videos (hero loops, film previews, "recordings", full films) | a still with a slow push-in; the player's playback is simulated (timeline, preview, volume UI) | the footage is the owner's; no audio is shipped, so the volume slider only moves |
| Seat / progress / benefits demos | rebuilt as live HTML + GSAP loops of the same length (4.1 / 5.7 / 18 s) | stand-in for the footage |
| Product box art | CSS-drawn box (container-query sized) | the artwork is the owner's |
| Client, festival and award logos | fictional marks and generated laurels | third-party and owner trademarks |
| Student photos / avatars | stock photos, initials in coloured circles | people's likenesses |
| Course "logo" images | typographic logos whose heights come from the source (they set each card's height) | the logos are the owner's |
| The filmmaker quiz (a form panel that opens under the buttons; its questions were not captured) | an invented three-question quiz that recommends one of the seven courses | the original questions and scoring are unknown |
| Page transition | rebuilt from the CSS | not observable |
| Accelerator title | shortened | avoids the phone overflow (P1-4) |
| Film-card hover shrink and the video slider's active frame (the source animates `width` / `height`) | a uniform `scale` plus a `clip-path` crop; the picture is the same (checked pixel-for-pixel in the end states: mean difference 2 / 255 on the busiest still, 0.6 on the slider) | the stills are 16:9, so scaling and cropping is exactly what resizing under `object-fit: cover` does, and no layout property is animated |
| Collapsible panels (the home quiz, the "what's included" list) | the grid row animates `0fr ↔ 1fr` instead of a measured pixel height | the panel always follows its content, including when a resize re-wraps the text (a measured height went stale) |
| Phone height of the Short Film page | compared with the source **with its videos loaded** (box 365 × 365 instead of the unloaded 150 px) | the page is taller once the videos play |

Remaining measured differences: one wrapped line on the phone layout of two modules (−22 / −23 px), the legal pages (+14 px at both widths; the privacy policy is −151 px at 390 — filler text that wraps differently) and a rounding pixel on a few pages.

Two things behind the numbers worth knowing: (1) on phones the source's community-card video is a 300 × 150 CSS-pixel `<video>` that never loads and has no poster, so the replica's still is cropped to that box; (2) the Short Film page's phone height is measured with the source's three 1920² videos loaded (their boxes become 365 × 365 squares).

### 14.1 Document height, original vs replica

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

### 14.2 Other checks

* **Console:** no errors or warnings on any of the 24 URLs, at 1440 and 390 (`smoke-all.cjs`).
* **Accessibility (axe 4.10):** 0 violations on `/`, `/about`, `/contact`, `/courses`, `/certification`, `/funding`, `/enterprise`, `/short-documentary-competition`, `/the-rta-accelerator`, `/frequently-asked-questions`, and the Short Film page and two course pages at 390.
* **Triggers:** every watch / join / purchase button on the new pages opens the player or the subscribe popup; quiz, accordion, quote slider, glide band and "Load more" verified numerically (`check-*.cjs`).
* **Not tested:** real devices, Safari/Firefox, screen readers, the page transition against the source's own frames.
