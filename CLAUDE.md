# CLAUDE.md

Guidance for AI agents (and humans) working in this repository. Read this fully before
making changes — it encodes decisions and conventions that aren't obvious from the code
alone.

---

## 1. What this is

The **personal portfolio website of Salih-Can Özdemir** — a Senior Software Engineer in
Düsseldorf specialising in **Angular** and **.NET**. It's a single-page marketing site:
hero/intro, an interactive career timeline, a filterable skills matrix, a personal-projects
gallery with detail dialogs, and hidden per-project legal pages (privacy / GDPR).

- **Owner / voice:** Salih-Can Özdemir. Surname is **Özdemir** (an older CV PDF said
  "Selvi" — that is outdated; always use **Özdemir**).
- **Name usage:** he goes by **Salih**. Use "Salih" / "Salih Özdemir" everywhere in the
  UI and narrative (header/footer brand, profile name, intro, page title/OG). Use the full
  **"Salih-Can Özdemir"** only in *official* spots: the legal data-controller line in
  privacy/GDPR markdown, the footer **© copyright** notice, and the SEO `<meta name="author">`.
- **GitHub handle:** `MrDariusAD`
- **Production domain:** `https://oezdemirs.de` (GitHub Pages, apex domain).
- **Primary contact / socials** live in `src/assets/cms/<lang>/profile.json` (GitHub,
  LinkedIn, two emails — Proton `salih.oez@proton.me` + Gmail, Discord). Treat that file
  as the source of truth; don't hard-code contact details elsewhere.
- **Git identity:** `Salih-Can Özdemir <mrdariusad@gmail.com>`.

It is a **fully static, autonomous SPA** — it runs with zero backend using bundled mock
content. A headless CMS (Payload) is scaffolded but **optional and not deployed** (see §9).

---

## 2. Tech stack

| Concern | Choice |
| --- | --- |
| Framework | **Angular 18** — standalone components, signals, `OnPush` everywhere, lazy routes |
| Styling | **Tailwind CSS v3** (`darkMode: 'class'`) + CSS-variable theme tokens |
| UI library | **PrimeNG 18** with `@primeng/themes` (`definePreset` on Aura) + PrimeIcons |
| Markdown | **ngx-markdown** (privacy/GDPR + project descriptions) |
| Content | **Payload CMS v3** schemas (optional) with a complete **local JSON mock** |
| i18n | Custom **signal-based `TranslationService`** (no library) — EN/DE runtime toggle |
| CI/CD | **GitHub Actions → GitHub Pages** (`gh-pages` branch) |

Node **LTS** in CI. Build output directory: **`dist/portfolio/browser`**.

---

## 3. Commands

```bash
npm install          # install deps
npm start            # dev server → http://localhost:4200
npm run build        # production build (default config is production)
npm run build:prod   # explicit production build → dist/portfolio/browser
```

There is no test suite configured yet. **Always run `npm run build:prod` after changes** —
it compiles under `strictTemplates`, which is the project's main correctness gate.

---

## 4. Project structure

```
src/
├─ app/
│  ├─ core/
│  │  ├─ models.ts              # Skill, Project, TimelineMilestone, Profile, SocialLink
│  │  ├─ theme.service.ts       # light/dark, .dark on <html>, persisted
│  │  ├─ translation.service.ts # EN/DE i18n, signal-based, t() reads signals
│  │  └─ cms.service.ts         # content gateway (local mock / remote Payload)
│  ├─ theme/galatasaray.preset.ts  # PrimeNG preset (INT DS crimson/gold)
│  ├─ components/
│  │  ├─ header/   hero/   footer/
│  │  ├─ timeline/                 # nested, collapsible, newest-first
│  │  ├─ skills/   (skills.component + skill-card.component)
│  │  └─ projects/ (projects.component + project-card.component)
│  ├─ pages/
│  │  ├─ home/      # composes the whole landing page
│  │  ├─ legal/     # privacy/gdpr markdown viewer (hidden routes)
│  │  └─ not-found/
│  ├─ app.config.ts # providers: router, http, PrimeNG, markdown, theme + i18n initializers
│  └─ app.routes.ts # incl. hidden /projects/:slug/privacy|gdpr
├─ assets/
│  ├─ cms/en|de/{profile,timeline,projects}.json   # localised content
│  ├─ cms/skills.json                              # shared (language-agnostic)
│  └─ i18n/en|de.json                              # UI string dictionaries
├─ environments/environment.ts   # useRemoteCms (false), cmsApiUrl
├─ styles.scss                    # Tailwind layers, theme tokens, PrimeNG overrides
└─ index.html                     # anti-flash theme bootstrap script
public/
├─ favicon.svg
└─ CNAME                          # "oezdemirs.de" — committed apex-domain fallback
cms/                              # Payload CMS v3 schemas (optional, not built into the site)
.github/workflows/deploy.yml      # CI/CD to GitHub Pages
```

---

## 5. Theming — INT Design System (Galatasaray crimson + gold)

The look comes from the **INT Design System** (Material 3 Expressive, seeded from
Galatasaray), maintained as a design-system project in **Claude Design** ("INT Design
System"). The site uses its variant **"A · Treu"** (the DS as shipped). Tokens in
`src/styles.scss` mirror the DS files `tokens/colors.css · motion.css · shape.css …`.

- **Colour roles (light):** primary / ink fill `#7C0320`, primary-container `#9D2235`,
  brand crimson `#A32638`, gold `#FCB614` (a **fill, never text on light**; gold text uses
  `--int-xp-ink` `#8F4D00`), page `#FFF8F7`, cards `#FFF0F0`, text `#251819`.
  Neutrals are warm and rose-tinted, never grey.
- **Dark:** warm near-black `#1C1011`, cards `#251819`, primary `#FFB3B5`, gold ink `#FCB614`.
- **Type:** Inter (UI) + JetBrains Mono (every number: periods, levels, counts) — both
  **self-hosted** via `@fontsource-variable/*` (no Google Fonts → GDPR).
- **Shape:** cards 16–20px, bento tiles 26px, dialog 28px, buttons/chips pills.
- **Icons:** Material Symbols Rounded + Simple Icons brand marks, **inlined as SVG paths**
  (`npm run icons` → `src/app/core/icons.generated.ts`, rendered by `<app-icon>`). Add a
  name to `scripts/gen-icons.mjs` before using it. PrimeIcons stay only for social logos.
  No emoji as icons (DS rule for professional contexts).

How it's wired:
- `src/styles.scss` — `--int-*` tokens for `:root` / `html.dark`, the component classes
  (`.btn`, `.tile`, `.tl-*`, `.proj`, …) and the legacy Tailwind channels
  (`canvas`, `surface`, … used by legal/404).
- `tailwind.config.js` — `gs.crimson.*` / `gs.gold.*` re-pointed to the DS tonal palettes.
- `src/app/theme/galatasaray.preset.ts` — PrimeNG primary = DS crimson, surfaces = DS warm
  neutrals. `darkModeSelector: '.dark'`.

### Motion (IntMotion + Emil Kowalski's rules — keep these)
- Curves: **settle** `cubic-bezier(0.16,1,0.3,1)` for anything entering/landing,
  **travel** `cubic-bezier(0.5,0,0.2,1)` for moving between places, **standard** for colour.
  Never `ease-in`, never `transition: all`, never `scale(0)`. UI motion stays < 300ms.
- **Buttons** use the DS ink-tier physics: gloss edge + shadow at rest, +10% white on hover,
  −16% black + inset shadow on press (90ms in, 240ms release), plus an ink **ripple**
  (`appRipple`). No scale on press.
- One-time motion only: hero stagger (`.rise`), scroll reveal (`appReveal`, once),
  bars/rings draw when the skills first scroll in. **No infinite decorative loops** (the old
  drifting blobs, pulsing pins, waving emoji and shimmer were removed on purpose).
- Hover motion is gated behind `@media (hover: hover) and (pointer: fine)`; every animation
  has a `prefers-reduced-motion` variant (opacity stays, movement goes).

---

## 6. Content model & CmsService

Interfaces in `src/app/core/models.ts` are the contract; the mock JSON and the Payload
schemas (`cms/`) mirror them 1:1.

- **Skill:** `id, name, category('Languages'|'Frontend'|'Backend'|'Cloud'|'Data'|'Tools'|'Design'),
  proficiency(1–100), tags[]`. ("Tools" = IDEs/editors/dev tools like Visual Studio, VS Code,
  Rider, Postman; "Design" = Figma, UI/UX, Jira, Confluence, Miro, Agile.) Language-agnostic → single shared `skills.json`. Tags are
  **hybrid**: one usage-context tag (`Daily driver`/`Lead`/`Production`/`Side projects`/
  `Learning`/`Certified`) plus 1–2 tech tags. Category labels live in i18n `category.*`
  (the `SkillCategory` value is the key suffix, capitalised). Certs and domains (e.g. XMeld)
  are **not** skills — they live in Certifications / the timeline.
- **Project:** `id, slug, title, icon, shortSummary, fullDescription(markdown), techStack[],
  githubUrl?, linkedInUrl?, emailUrl?, discordUrl?, hasPrivacyPolicy + privacyPolicyMarkdown?,
  hasGdprInstructions + gdprInstructionsMarkdown?, lifecycle?[]`.
- **TimelineMilestone:** `id, period, organisation, role, title, summary, responsibilities[],
  techStack[], current?, children?[]` (up to two levels: employer → role/product → customer project).
- **Profile** (global): `name, title, location, introduction, socials[], certifications[],
  languages[]`.

`CmsService`:
- Reads `assets/cms/<lang>/<name>.json` for localised collections/globals; `skills.json`
  is shared. Memoised per cache key.
- `getProfile(lang)`, `getProjects(lang)`, `getTimeline(lang)`, `getSkills()`,
  `getProject(slug, lang)`.
- `environment.useRemoteCms` (default **false**) flips to the Payload REST API
  (`<cmsApiUrl>/<collection>?locale=<lang>`) and **always falls back to the local mock**
  if the request fails.

To **edit content**: change the JSON files and redeploy (a push rebuilds the site). For DE,
edit the `de/` copies too.

To **add a project**: there's a user-level Claude Code skill **`portfolio-entry`** (at
`~/.claude/skills/portfolio-entry/`). Run it *inside the app's own repo* — it analyses that
repo and emits ready-to-paste EN + DE `Project` JSON (summary, first-person description,
techStack, optional lifecycle, and privacy/GDPR markdown when personal data is processed),
matching this portfolio's schema and voice. Append the `en`/`de` objects to the respective
`projects.json` arrays.

There's also a companion user-level skill **`privacy-policy`** (`~/.claude/skills/privacy-policy/`)
— run it inside an app repo to generate a full standalone, GDPR/DSGVO-compliant privacy
policy (EN + DE, `PRIVACY.en.md` / `PRIVACY.de.md`) from what the repo actually processes.
Its condensed form can feed a project's `privacyPolicyMarkdown`.

---

## 7. Conventions & decisions (do not regress these)

These came from explicit owner feedback during development — honour them.

1. **First-person voice.** All narration is first person: "I built…", "Ich baute…".
   **Never** third-person "Salih". The only exception is the data-controller *name* line
   in legal markdown, which keeps the full name "Salih-Can Özdemir".

2. **Project links are strictly conditional.** Render the GitHub/"Code" button **only if
   `githubUrl` exists**, Privacy **only if `hasPrivacyPolicy`**, GDPR **only if
   `hasGdprInstructions`**. Do **not** show personal socials (LinkedIn / email / Discord)
   per project — those belong only in the page header/footer. A project card's footer is
   hidden entirely when it has no links.

3. **Project detail dialog is a chromeless PrimeNG `p-dialog`:**
   - `[showHeader]="false"`, `[contentStyle]` padding `0`, and `.project-dialog` CSS that
     hides `.p-dialog-header`/`.p-dialog-header-icons` and sets `border: none` (no white
     border). We render our own crimson header band with a **single** close button.
   - The layout is `flex max-h-[85vh] flex-col` with a fixed header, **one** scrollable
     body (`overflow-y-auto`), and a fixed action bar → exactly **one** scrollbar.
   - **Open/close animation:** split signals — `visible()` drives the enter/leave
     animation; `current()` holds the project. `close()` sets `visible=false` (plays the
     leave animation); `(onHide)` clears `current()` *after* it finishes, so it animates
     out with content intact (a true reverse of the open). `transitionOptions` = 220ms.
   - Net effect this prevents: double-X, double-scrollbar, white border, and "content
     vanishes then shell disappears" dismissal.

4. **Timeline:** newest-first; supports **two levels of nested `children`**: roles/projects
   within an employer, and customer projects within a product (adesso → adessoGPT → Vivawest
   · BVB · AOK Bayern). Each level renders indented on its own vertical line, collapsible via
   a chevron. Selection is by **id** (`selectedId` signal); the default selection is the
   **longest-running** `current` child (adessoGPT, even when newer projects also run) with
   its parent and its own customer projects auto-expanded. Switching nodes blurs the old detail out (110ms) and settles the
   new one in; children expand via `grid-template-rows: 0fr → 1fr`. Both a current parent and a
   current child may show the "NOW" badge.

5. **Skills:** default view is an Apple-style **bento** (toggle to a grid). Tile *shape*
   follows the level (100 → big/tall/wide in rotation, 90–95 → wide with a ring or square,
   80–89 → square, < 80 → quiet dashed) and is assigned over the **full** list so a tile keeps
   its look while filtering/sorting; every tile carries its skill's mark large and faint in the
   corner. Sort: Mix (a rhythm that spreads big tiles) · Level · A–Z · Category. Sort/filter/view
   changes animate with **FLIP** (WAAPI, travel curve); typing in search does not animate.
   The category filter stays custom chip buttons (not PrimeNG `p-selectButton`); the active
   state is a **clipped copy of the chip row** that travels (same technique as the header nav
   scroll-spy pill).

6. **i18n is custom and signal-based.** `TranslationService.t(key)` reads the `lang` and
   `dict` signals, so any template calling `i18n.t('…')` is reactive — even **OnPush**
   components re-render on language toggle with no extra plumbing. Dictionaries are
   preloaded in `APP_INITIALIZER`. Localised content components (home, legal) re-fetch via
   `toObservable(i18n.lang)` + `switchMap`. Add new UI strings to **both** `en.json` and
   `de.json`; add localised content to **both** `cms/en/` and `cms/de/`.

7. **Hidden legal routes.** `/projects/:slug/privacy` and `/projects/:slug/gdpr` must
   **never** appear in any nav bar, menu, header, or footer. They are reachable **only**
   from a project card and the project dialog's action bar.

8. **Angular style:** standalone components, `ChangeDetectionStrategy.OnPush`, signals
   (`signal`/`computed`/`effect`), `input()`/`output()` functions, `inject()` for DI.
   **Templates live in external `.html` files** (`templateUrl`), one per component — no
   inline `template:` strings. `angular.json` sets `inlineTemplate: false` for new components.

### Angular-18-specific gotchas (already handled — keep in mind)
- Use the **`APP_INITIALIZER`** token, **not** `provideAppInitializer` (that's an Angular
  19 API).
- `p-selectButton` with `[(ngModel)]` needs **`FormsModule`** imported.
- `@primeng/themes` logs a deprecation notice (migrating to `@primeuix/themes`) — harmless
  for now; don't churn on it without testing.

---

## 8. Real biography (for content accuracy)

Use these facts when writing/adjusting content. They come from the owner's CV and the
adesso profile doc (German source). **Always first person.**

- ~**7 years** experience. Domains: municipal/church registry (**XMeld**), **energy /
  smart metering**, and **POS/cash systems** (Kassensysteme).
- **Dual studies:** B.Sc. **Business Informatics** (FOM Kassel, specialisation E-Business
  Management) **+** apprenticeship as **Fachinformatiker für Anwendungsentwicklung**.
- **Certifications:** AZ-900 (Azure Fundamentals), MS-012 (Microsoft AI & Copilot),
  **IREB CPRE-FL**.
- **Languages:** German C2, English C1, Turkish B2.
- **Career timeline (newest first):**
  1. **adesso SE — 2022–Present**, Senior Software Engineer & AI Expert. Children:
     - *adessoGPT* (2025–Present) — generative-AI enablement & DevOps. **Current role.**
       Customer projects (second level, real customer names are public by owner decision):
       *Vivawest Wohnen* CorporateGPT (2026–), *Borussia Dortmund* bvb.de chatbot (2026–),
       *AOK Bayern* LLM concept for e-mail response management (2026).
     - *Gantner DigiRest* (2025–2026, ended) — MaxxLive/MaxxConference (Angular + Telerik/Kendo)
       & MaxxApp (Flutter); payment providers (Adyen).
     - *beyonnex.io / BxTrack* (2022–2025) — energy dispatch; **UI Lead**, migrated
       ASP.NET MVC → Blazor Server (MudBlazor); AWS (RDS/EKS/ECR), Terraform, Kafka.
  2. **ECKD Service GmbH — 2018–2022**, Software Engineer (ITM church-market suite).
     Children: ITM.KirA · XMeld (2021–22, XMeld 3.0/Bruttonachrichten), ITM.Landingpages
     (2020–22), ITM.Gemeindeplaner (2019–21), ITM.KirA (2018–19). Stack: C#/.NET, Angular,
     NServiceBus, MSMQ, RavenDB, Kubernetes/Helm, Azure DevOps.
  3. **FOM Kassel — 2018–2022**, Dual Studies & Apprenticeship (B.Sc. + Fachinformatiker;
     thesis on Big Data in the church registry domain, grade 1.3).

- **Five personal projects** (gallery + dialogs):
  - **INT.KMP** — field-service planner for coffee-machine maintenance. Flutter + self-hosted
    .NET Core + MongoDB; bespoke field-logistics auth/token model. Privacy + GDPR.
  - **INT.Cookling** — AI recipe harvester (Instagram/YouTube → structured recipes). Flutter
    + Firebase + AI parsing pipeline. Privacy.
  - **INT.DieListe** — real-time multi-tenant collaborative list canvas. Clean Angular state;
    node-based Google-Drive-style permission hierarchy.
  - **INT.DriverLog** — mileage/trip auditor for tax/expense logging. Flutter + Firebase
    event streaming; append-only audit ledger. Privacy + GDPR.
  - **INT.PrintIt** — 3D-print marketplace (clients ↔ local hubs). Flutter + Firebase
    state machine: `created → accepted/rejected → scheduled → printing → print failed
    (recovery) → completed → done`; real-time messaging. Privacy + GDPR.

- **Privacy:** the source CV documents (`Lebenslauf_DE.pdf` and the adesso `.docx`) contain
  personal data (phone, home address) and are **git-ignored on purpose** — never commit
  them, and never surface that data on the site.

---

## 9. Deployment (GitHub Pages → oezdemirs.de)

The site is **free static hosting** on GitHub Pages. Payload is **not** deployed.

**`.github/workflows/deploy.yml`** runs on push to `main`/`master`:
1. `ubuntu-latest`, Node LTS, npm cache.
2. `npm ci` → `npm run build:prod`.
3. Copies `index.html` → **`404.html`** so SPA deep links (e.g. the hidden privacy routes)
   work without a server rewrite engine.
4. Writes **`CNAME`** from the `CUSTOM_DOMAIN` Actions variable; the repo also ships a
   committed **`public/CNAME` = `oezdemirs.de`** fallback (copied into the build), so the
   domain applies even if the variable is unset. The variable takes precedence.
5. `.nojekyll`, then publishes `dist/portfolio/browser` to **`gh-pages`** via
   `peaceiris/actions-gh-pages` using `GITHUB_TOKEN`.

**Setup checklist (GitHub side — done by the owner, not from code):**
- Push to `main`.
- **Settings → Actions → General → Workflow permissions → "Read and write"** (otherwise
  the token can't push `gh-pages` and the deploy fails).
- **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `(root)`.**
  - ⚠️ If Pages points at `main`/root instead, GitHub renders **`README.md` as the
    homepage** — that's the symptom of a wrong Pages source, not a build bug.
- Optionally set the `CUSTOM_DOMAIN` Actions variable to `oezdemirs.de`.
- Tick **Enforce HTTPS** once the cert is issued.

**`baseHref` is `/`** (correct for an apex domain). The raw
`MrDariusAD.github.io/portfolio` project URL will look broken (assets 404 under root base
href) — `https://oezdemirs.de` is the real target.

**DNS on Cloudflare** (uses apex CNAME flattening; **grey-cloud / DNS-only** so GitHub
manages TLS):
| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `@` | `MrDariusAD.github.io` | DNS only (grey) |
| CNAME | `www` | `MrDariusAD.github.io` | DNS only (grey) |
- Delete Cloudflare's auto-added placeholder `A`/`AAAA` records first.
- If proxying later (orange), set SSL/TLS to **Full** (never "Flexible" → redirect loop).
- On registrars without ALIAS/flattening, the apex needs A records
  `185.199.108–111.153` (+ AAAA `2606:50c0:8000–8003::153`) instead of the apex CNAME.

**If you ever do deploy Payload** (only needed for a live admin UI): it's a Node server +
MongoDB → host on Render/Railway + MongoDB Atlas (free tiers), set `useRemoteCms = true`
and `cmsApiUrl`, and ensure CORS allows `oezdemirs.de`.

---

## 10. Git hygiene

- Repo lives on branch **`main`**; `.gitattributes` normalises line endings to **LF**
  (consistent with the Linux CI).
- `.gitignore` excludes `node_modules`, `dist`, `.angular/cache`, env files, and the
  **CV source documents** (`Lebenslauf_DE.pdf`, `*.docx`).
- Don't commit build artifacts or the CV files.

---

## 11. Quick "where do I change X?"

| I want to… | Edit |
| --- | --- |
| Change bio / socials / certs | `src/assets/cms/<lang>/profile.json` |
| Add/edit a project (or its privacy/GDPR text) | `src/assets/cms/<lang>/projects.json` |
| Add/edit a timeline entry or sub-entry | `src/assets/cms/<lang>/timeline.json` |
| Add/edit a skill | `src/assets/cms/skills.json` (shared) |
| Add/translate a UI label | `src/assets/i18n/en.json` **and** `de.json` |
| Tweak brand colours | `tailwind.config.js` + `src/styles.scss` + `galatasaray.preset.ts` (keep in sync with the INT Design System in Claude Design) |
| Add an icon (skill / project) | `scripts/gen-icons.mjs` → `npm run icons`; skill → icon map in `src/app/core/skill-icons.ts`; a project's `icon` is its **real app icon** (128px file in `public/projects/`, e.g. `projects/int-brain.png`), or a Material Symbol name if the app has none |
| Change the deploy / domain | `.github/workflows/deploy.yml`, `public/CNAME`, DNS |
```
