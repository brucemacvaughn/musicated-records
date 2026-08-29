# AGENTS.md — Musicated Records website

Instructions for any AI agent working in this repo. Read this before making changes.

## What this is

The public website for Musicated Records, a UK independent house label run by Eric Martin.
Plain HTML, CSS and JavaScript. **No framework, no build step, no package.json.** It is served
directly by GitHub Pages from `main` at the repository root.

Live: `brucemacvaughn.github.io/musicated-records` (custom domain `musicatedrecords.com` pending).

Eric Martin is the owner and the person you are usually working for. He is not a developer.
Explain what you did in plain language, and never assume he will read code to understand you.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Home |
| `listen.html` | Buy / Listen |
| `live.html` | Live / Stream |
| `sync.html` | Sync · TV / Film |
| `about.html` | About |
| `contact.html` | Contact |
| `merch.html` | Merch — **deliberately unlinked** from nav and footer, still deploys |
| `assets/styles.css` | All styling for every page |
| `assets/main.js` | Nav, scroll reveals, form handling |
| `assets/hero-viz.js` | Canvas spinning vinyl on the home page |
| `assets/releases/` | Record cover artwork |
| `assets/tv/` | TV/film poster artwork for the Sync page |
| `.nojekyll` | Must exist. Removing it breaks asset serving. |

## Hard rules

1. **Relative paths only.** `assets/styles.css`, never `/assets/styles.css`. Absolute paths
   break the site under the `github.io/musicated-records/` subdirectory. Inside
   `assets/styles.css`, `url()` paths are relative to the CSS file itself
   (`url('musicated-logo-circle.png')`, not `url('assets/...')`).
   The one intentional absolute is `og:image`, which needs a fully-qualified URL.

2. **Do not add a cache-busting query string.** `?v=...` was removed on purpose. It required a
   manual bump on every asset change and repeatedly made people think a change had not deployed.
   GitHub Pages caches for about ten minutes and self-heals. Do not reintroduce it.

3. **The nav and footer are duplicated in all seven HTML files.** Any change to a menu item,
   footer link or the brand block must be applied to every page or the site becomes inconsistent.

4. **Do not reformat or minify HTML.** Keep the existing indentation and line structure. Collapsing
   sections onto single long lines makes every future diff unreadable and hides mistakes.

5. **Never force-push and never rewrite history.** Other people commit here. Rebase or merge.

6. **Do not introduce a framework, bundler, package manager or build step.** If a task seems to
   need one, stop and say so instead.

## The logo — the most important section

The logo reaches the site through **three independent routes**. Changing one does not change the
others. This has already caused a wasted session.

| Route | Files | Where it shows |
| --- | --- | --- |
| 1 | `assets/musicated-logo-circle.png` | Hero vinyl overlay, home page panel, About panel, merch watermark |
| 2 | `assets/favicon-16/32/180/192/512.png`, `favicon.ico`, `apple-touch-icon.png` | Browser tab **and `.brand__mark`** — the 44px logo tile in the nav on every page. It is a CSS `background`, not an `<img>`. |
| 3 | `assets/og-card.jpg` | The preview image when a link is shared |

Routes 2 and 3 are **generated from** the logo, not linked to it. **You cannot fix them by editing
HTML or CSS.** They require regenerating image files, which you cannot do.

**If asked to change the logo:** update route 1, then say clearly that the favicons and og-card
also need regenerating from the new artwork and that a human with an image tool must do it.
Do not report the logo change as complete without that caveat.

There is exactly **one** logo file in this repo. Eleven orphaned legacy logo files were deleted to
stop agents rediscovering the wrong one. Do not add more logo variants.

## Never infer an image's shape from its filename

You cannot see images. An agent once assumed from the name
`assets/musicated-logo-circle.png` that the asset was "a centred 1:1 circular mark", sized it as a
square, and pushed a logo that spilled out of the vinyl label on the live site. At that time it was
a wide 1.722:1 lockup. **If a change depends on an image's shape, proportions or where its content
sits inside the frame, say so and ask — do not infer it from the filename or from what a previous
version was.**

## The hero logo geometry

`assets/musicated-logo-circle.png` is a **square circular mark, 1200x1200**, and it has been
trimmed so its **bounding box is exactly the record** — no transparent padding, disc centred. That
is deliberate: it means plain centring works and no positional offset is needed.

```css
transform: translate(-50%, -50%);
width: 32%;
```

The canvas in `assets/hero-viz.js` draws its teal ring at `0.40 x 0.96 x 0.46` = **0.1766** of the
viz width. The logo's disc radius is half its own width, so 32% puts the disc at 0.16 of the viz —
**91% of the ring** — leaving the teal visible as a rim around the artwork. Measured after the
change: centre offset 0.00, 0.00 px.

**Do not set the width to 36.8%.** That is the label *diameter*, and at that size the logo covers
the teal ring completely. **Do not size or position the logo from JavaScript** — `hero-viz.js` must
not touch `.hero__viz__logo`, because runtime inline styles override the stylesheet and make the
CSS look correct while the live page is wrong. That has happened once and was very hard to find.

**If the logo file is ever replaced, re-measure.** These numbers describe this specific PNG. A
replacement that is not square, or not trimmed to its disc, needs different values — and the
favicons and og-card must be regenerated too (see the logo section above).

## What you cannot do here

- **You cannot see the rendered website.** You read source, not pixels. Never conclude how the
  live site looks from the code alone.
- **You cannot generate or resize images.** Favicons, og-card, cover art, poster crops — all need
  a human. Say so; do not work around it.
- **You cannot verify a visual fix.** After a visual change, tell Eric to look at the live site
  himself, wait ten minutes and hard-refresh.

## When a change "doesn't show up"

Work this order. It is almost always the first item.

1. GitHub Pages caches for ~10 minutes. Wait, then hard-refresh (`Cmd/Ctrl+Shift+R`).
2. Confirm the commit actually landed on `main`.
3. Check the **Actions** tab for a green tick.
4. Only then consider anything else.

**Do not diagnose a deployment or publishing-source problem from a visual symptom.** This has
already happened once: the logo appeared unchanged, and the conclusion drawn was that Pages was
"not serving `main`". Pages was serving `main` correctly. The old logo was coming from the favicon
files (route 2 above). A visual symptom you cannot see is not evidence about deployment.

If you are about to suggest changing deployment settings, deleting files, renaming files, or
switching branches to fix a cosmetic problem — **stop and ask a human first.**

## Images

- Record covers and TV posters: square, **800×800**, JPEG, **under 200 KB**.
- Never commit an original phone photo or designer export. A 5.57 MB cover and a 631 KB 3000px
  logo have both reached `main` and had to be reduced afterwards.
- Replacing artwork? Reuse the exact existing filename. Every page referencing it then updates at
  once and no HTML edit is needed.

## Content rules

- The home page hero ends **"In art we trust."** — this is Eric's deliberate wording. Leave it.
- Every other page uses the label tagline **"In House We Trust"**. Both are correct as they stand.
- The **"musicated, adj."** dictionary card on the home page stays. Eric values it. Do not remove
  or reword it without being asked directly.
- Newsletter heading is **"Stay Up to Date"**.
- Nav order is fixed: Home / Buy · Listen / Live / Sync / Merch is hidden / About / Contact.

## Hero visualiser

`assets/hero-viz.js` draws the spinning vinyl on canvas. The logo sitting in the middle is a
separate static HTML image (`.hero__viz__logo`, ~29% width) layered on top — the record spins
around it. The canvas deliberately draws **no logo and no tonearm**; the logo artwork supplies the
tonearm. Do not re-add either, and do not grow the overlay past about 34% or it swallows the record.

## Before you finish

- Every internal `href`, `src` and CSS `url()` must point at a file that exists.
- HTML tags must balance — check any section you edited.
- Nav and footer identical across all seven pages.
- No `?v=` query strings anywhere.
- Say plainly what you changed, what you could not verify, and anything that still needs a human.
