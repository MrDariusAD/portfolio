# Payload CMS — Content Layer

This folder holds the **code-first [Payload CMS](https://payloadcms.com) v3** schemas
that model the portfolio's content. It is **optional**: the Angular app ships with a
complete local mock (`src/assets/cms/*.json`) and runs fully offline out-of-the-box.

## Collections & globals

| Slug         | Type       | Maps to Angular model        | Mock file                              |
| ------------ | ---------- | ---------------------------- | -------------------------------------- |
| `skills`     | collection | `Skill`                      | `src/assets/cms/skills.json` (shared)  |
| `projects`   | collection | `Project`                    | `src/assets/cms/<lang>/projects.json`  |
| `timeline`   | collection | `TimelineMilestone`          | `src/assets/cms/<lang>/timeline.json`  |
| `profile`    | global     | `Profile`                    | `src/assets/cms/<lang>/profile.json`   |

Content is localised (`en` / `de`); `CmsService` requests `…?locale=<lang>` from the
Payload REST API, matching the runtime language toggle. Skills are language-agnostic.

The interfaces in `src/app/core/models.ts` are the contract; these schemas mirror them
1:1 so the mock JSON and the live REST API are drop-in interchangeable.

## Going live

1. Stand up a Payload instance (`npx create-payload-app`) and drop these files in.
2. Required env: `DATABASE_URI`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`,
   and `CORS_ORIGINS` (include your GitHub Pages / apex-domain origin).
3. In the Angular app, set `environment.useRemoteCms = true` and point
   `environment.cmsApiUrl` at `https://<your-cms>/api`.

`CmsService` calls `/api/<collection>` (and `/api/globals/profile`) and **falls back to
the bundled mock** if a request fails — so the UI always renders.
