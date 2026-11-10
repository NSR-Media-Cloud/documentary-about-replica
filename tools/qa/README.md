# QA harness — original vs replica

Headless-Chrome scripts used to verify the replica against the live page. They drive an installed Chrome
(set `CHROME_PATH` if it is not in the default Windows location) through `puppeteer-core`.

```bash
cd tools/qa
npm install                       # puppeteer-core only
# 1. start the replica:  node ../../server.cjs   (http://localhost:4660)

# layout: positions + sizes of ~50 elements at one viewport, then a side-by-side diff
node metrics.cjs 1440 900 orig
node metrics.cjs 1440 900 replica
node cmp-metrics.cjs 1440

# animation: scroll both pages to the same positions, record nav / hero / statement / founders state
node probe2.cjs orig 1440 900
node probe2.cjs replica 1440 900
node cmp-states.cjs 1440x900

# visual: orig | replica pairs for chosen scroll positions
node pairs.cjs out/shots/orig-1440x900 out/shots/replica-1440x900 out/pairs.png 640 0,1350,2700,4950
```

Use `390 844`, `768 1024`, `1280 720` or `1920 1080` in place of `1440 900` for other viewports.
The `orig` runs load the live site (network required) with the scroll-popup suppressed so it cannot cover the page.
Output lands in `tools/qa/out/` (ignored by the server).

## All pages (`pages/`)

The multi-page comparison tools used to build every template. They need the replica running on :4660 and, for the `orig` runs, network access.

```bash
cd tools/qa/pages
node fp.cjs orig funding                 # layout fingerprint of the live page at 1440 and 390 (item rects + type metrics)
node fp.cjs rep funding                  # …and of the replica
node fpdiff.cjs funding 1440             # item-by-item diff, sections first
node sections.cjs rep funding            # one line per section: y and height (compare with "orig")
node secdiff.cjs funding 390 2 2         # items of one section pair, side by side
node try-text.cjs funding ".film-grid header h3 > span" "" "candidate copy A" "candidate copy B"   # line counts of copy at both widths
node shot.cjs rep funding 1440 slices 0.5 0 4300      # viewport slices; shot-clip / shot-hover for crops and hover states
node smoke-all.cjs "" 1440               # every page: console errors + failed requests
node axe-pages.cjs "/,funding,enterprise" 1440        # axe after scrolling the whole page
node check-reduced-motion.cjs            # prefers-reduced-motion: reduce — no CSS or GSAP loop may keep running (also lists what loops when motion is allowed: VERBOSE=1)
```

`routes.cjs` maps each template to its original URL and the replica's stand-in slug. `probe-*.cjs` / `check-*.cjs` exercise one interaction each (film-grid hover and modal, glide band, line drawing,
logo marquee speed, text/media stack, video player, page transition, home blocks).
Output goes to `tools/qa/out/pages/` (override with `QA_OUT`). Scripts that read the original's CSS/DOM (`cssdump`, `subtree`, `tree`, `course-shape`, `films-shape`) expect a **local, saved copy of the
original site's files in `out/pages/crawl/`** (`html/`, `css/`, `data/`). That copy is deliberately not part of the repository.
