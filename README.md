# Musicated Records — site

Static site for **musicatedrecords.com**. Plain HTML/CSS/JS, no build step — deploys
straight to **GitHub Pages** (source: `main` branch, root).

## Pages

| Path            | Purpose                                                                   |
| --------------- | ------------------------------------------------------------------------- |
| `/`             | Home — hero visualiser, featured releases, "musicated" definition, who we are, events |
| `/listen.html`  | Buy / Listen — every streaming + DJ store + retailers                     |
| `/live.html`    | Live / Stream — YouTube embed + archive                                   |
| `/sync.html`    | Sync · TV / Film — the sync arm + selected placements                     |
| `/merch.html`   | Merch — Coming Soon banner + preview tiles                                |
| `/about.html`   | About — the label story                                                   |
| `/contact.html` | Contact — one centred general form                                        |

Nav order: Home / Buy · Listen / Live / Sync / Merch / About / Contact.

## Assets & conventions

- Global styles `assets/styles.css`, global JS `assets/main.js`, hero canvas `assets/hero-viz.js`.
- **Cache-busting is non-negotiable.** Every CSS/JS/asset reference carries `?v=YYYYMMDDx`.
  Bump it on every change that touches `styles.css`, `main.js` or `hero-viz.js`, or returning
  visitors get stale files. Current: `?v=20260829c`.
  One-liner: `sed -i '' 's/v=20260829c/v=20260829c/g' *.html assets/styles.css`
- Round-2 logo: `assets/logo-eric-round2.png` (transparent PNG, knocked out from Eric's
  "Musicated Blue 2" artwork). Drives the hero overlay, About photo, merch watermarks,
  the favicon set and `og-card.jpg`.
- The hero logo is a **static HTML overlay** (`.hero__viz__logo`); the canvas vinyl spins
  around it. `hero-viz.js` deliberately draws no logo and no tonearm — the logo supplies one.

## Design tokens (locked — sibling language with ericmartinmusic.club)

Bg `#07080a` / `#0d0f13` / `#14171d` · Ink `#f3f4f7` / `#b9bdc7` / `#777b86`
Teal `#5fc9d6` · Gold `#ffc94a` · Hot `#ff5d8f` (LIVE only)
Anton (display) · Inter (body) · JetBrains Mono (labels/kickers)

## Deploy — GitHub Pages

```bash
git add -A && git commit -m "…" && git push
```

Pages serves `main` at root. Custom domain is set in repo Settings → Pages.
`.nojekyll` is present so nothing gets filtered by Jekyll.

## To activate forms

Sign up at formspree.io, create endpoints for each form, paste them into `FORM_ENDPOINTS`
at the top of `assets/main.js`, bump the cache version, and push.
