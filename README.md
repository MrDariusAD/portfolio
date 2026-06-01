# Salih-Can Özdemir — Personal Portfolio

A high-profile, production-ready personal portfolio for **Salih-Can Özdemir**, Senior
Software Engineer (Angular & .NET) based in Düsseldorf. Built with **Angular 18**,
**Tailwind CSS**, and **PrimeNG**, themed in the colours of **Galatasaray Istanbul**,
with a decoupled **Payload CMS** content layer and an automated **GitHub Pages**
CI/CD pipeline.

![Stack](https://img.shields.io/badge/Angular-18-DD0031) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8) ![PrimeNG](https://img.shields.io/badge/PrimeNG-18-A80633)

---

## ✨ Features

- **Galatasaray theme system** — crimson `#a80633` + gold `#fbbb20`, with seamless
  light/dark mode (system-aware, persisted, no flash-of-wrong-theme) driven by CSS
  variables and Tailwind's `darkMode: 'class'`. All state changes animate at
  `duration-300 ease-in-out`.
- **Glassmorphism sticky header** with social channels (GitHub, LinkedIn, Email,
  Discord) and a theme toggle.
- **Interactive career timeline** — click any milestone node to update a live detail
  panel (stack, tasks, responsibilities) without a route change.
- **Filterable & searchable skills matrix** — reactive `FormControl` search +
  `p-selectButton` category chips, rendered in a responsive
  `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` grid of proficiency-metered skill cards.
- **Personal projects gallery** — cards open polished PrimeNG `p-dialog` modals with
  Markdown-rendered deep-dives, tech stacks, and (for INT.PrintIt) a full order
  **state-machine lifecycle**.
- **Hidden legal sub-pages** — `/projects/:slug/privacy` and `/projects/:slug/gdpr`,
  reachable **only** from a project's card or its detail dialog (never from any nav,
  header, or footer), rendered through a sanitised Markdown viewer.
- **Decoupled content** via a `CmsService` backed by **Payload CMS v3** schemas, with a
  complete **local mock** (`src/assets/cms/<lang>/*.json`) so the app runs autonomously
  offline.
- **Internationalisation (EN / DE)** — a runtime language toggle in the header flips the
  entire site instantly (UI labels *and* all content, including the privacy/GDPR legal
  text), with no page reload. The choice is persisted and defaults to the browser
  language. Powered by a lightweight, dependency-free signal-based `TranslationService`
  so even OnPush components re-render on switch.

## 🧱 Tech stack

| Layer        | Technology                                                   |
| ------------ | ------------------------------------------------------------ |
| Framework    | Angular 18 (standalone components, signals, lazy routes)     |
| Styling      | Tailwind CSS 3 + custom CSS-variable theme tokens            |
| UI library   | PrimeNG 18 (`@primeng/themes` custom `definePreset`) + PrimeIcons |
| Markdown     | ngx-markdown                                                 |
| Content      | Payload CMS v3 (code-first) · local JSON fallback            |
| CI/CD        | GitHub Actions → GitHub Pages (`gh-pages` branch)            |

## 🚀 Getting started

```bash
npm install          # install dependencies
npm start            # dev server at http://localhost:4200
npm run build:prod   # optimized production build → dist/portfolio/browser
```

> Requires Node.js LTS. The app runs fully offline using the bundled mock content —
> no backend required.

## 📁 Project structure

```
.
├─ src/
│  ├─ app/
│  │  ├─ core/                 # models, ThemeService, TranslationService, CmsService
│  │  ├─ theme/                # Galatasaray PrimeNG preset
│  │  ├─ components/           # header, hero, timeline, skills, projects, footer
│  │  ├─ pages/                # home, legal (privacy/gdpr), not-found
│  │  ├─ app.config.ts         # providers (router, http, PrimeNG, markdown, theme, i18n)
│  │  └─ app.routes.ts         # routes incl. hidden legal deep-links
│  ├─ assets/cms/en|de/*.json  # local mock content per language (Payload-shaped)
│  ├─ assets/cms/skills.json   # language-agnostic skills
│  ├─ assets/i18n/en|de.json   # UI string dictionaries
│  ├─ environments/            # CMS toggle + API URL
│  ├─ styles.scss              # Tailwind layers + theme tokens + prose styles
│  └─ index.html               # anti-flash theme bootstrap
├─ public/favicon.svg
├─ cms/                        # Payload CMS v3 code-first schemas (optional)
├─ .github/workflows/deploy.yml
├─ tailwind.config.js
└─ angular.json
```

## 🎨 Theming

Brand colours live in `tailwind.config.js` (`gs.crimson`, `gs.gold`) and semantic
surface tokens (`--canvas`, `--surface`, `--content`, …) in `src/styles.scss`. The
PrimeNG preset in `src/app/theme/galatasaray.preset.ts` re-points PrimeNG's `primary`
ramp to crimson (gold on dark) so every component inherits the brand instead of the
default presets. `ThemeService` toggles the `.dark` class on `<html>`, which drives
both Tailwind and PrimeNG's `darkModeSelector`.

## 🗂️ Content: local mock vs. live Payload CMS

By default (`environment.useRemoteCms = false`) content is read from
`src/assets/cms/*.json`. To source content live:

1. Deploy a Payload CMS v3 instance using the schemas in [`cms/`](./cms/README.md).
2. Set `environment.useRemoteCms = true` and `environment.cmsApiUrl` to
   `https://<your-cms>/api`.

`CmsService` calls `/api/<collection>` and **falls back to the bundled mock** if a
request fails, so the UI always renders.

## ⚙️ Deployment (GitHub Pages)

`.github/workflows/deploy.yml` runs on every push to `main`/`master`:

1. Provisions `ubuntu-latest`, sets up Node LTS, **caches npm**.
2. `npm ci` → `npm run build:prod`.
3. Copies `index.html` → `404.html` so deep links (e.g. the hidden privacy routes)
   work on a static host **without a server-side rewrite engine**.
4. Writes a **`CNAME`** file for the apex domain (from the `CUSTOM_DOMAIN` Actions
   variable) and a `.nojekyll` marker.
5. Publishes `dist/portfolio/browser` to the **`gh-pages`** branch via the built-in
   `GITHUB_TOKEN`.

### Quickstart: deploy to `oezdemirs.de`

```bash
# 1. Push the repo (one-time)
git remote add origin https://github.com/MrDariusAD/portfolio.git
git push -u origin main
```

2. **Settings → Secrets and variables → Actions → Variables** → add
   `CUSTOM_DOMAIN` = `oezdemirs.de`. _(Optional — the repo also ships a committed
   `public/CNAME` fallback with the same value, so the domain is applied even
   without the variable.)_
3. The push runs the workflow and creates the **`gh-pages`** branch. Then
   **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `(root)`**.
4. DNS at your registrar (apex `oezdemirs.de`):

   | Type | Name | Value |
   | ---- | ---- | ----- |
   | A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153`, `…8001::153`, `…8002::153`, `…8003::153` |
   | CNAME | `www` | `MrDariusAD.github.io.` |

5. Once DNS resolves, tick **Enforce HTTPS** in Settings → Pages.

> The production build uses `baseHref: "/"`, correct for the apex domain. The raw
> `MrDariusAD.github.io/portfolio` project URL will look broken (assets 404 under the
> root base href) — `https://oezdemirs.de` is the real target.

### Using a different domain

Change the `CUSTOM_DOMAIN` Actions variable (it takes precedence) or edit
`public/CNAME`, then repeat the DNS step for your domain.

## 📄 License

MIT © Salih-Can Özdemir
