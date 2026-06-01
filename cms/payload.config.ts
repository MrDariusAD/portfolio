import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { Skills } from './collections/Skills';
import { Projects } from './collections/Projects';
import { Timeline } from './collections/Timeline';
import { Profile } from './globals/Profile';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload CMS v3 configuration — the headless content backbone for the
 * portfolio. The Angular `CmsService` reads these collections/globals when
 * `environment.useRemoteCms` is enabled; otherwise it falls back to the bundled
 * mock JSON under `src/assets/cms/`, keeping the app fully autonomous.
 *
 * CORS is opened to the GitHub Pages origin so the static SPA can fetch content
 * directly from a deployed Payload instance.
 */
export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    meta: {
      titleSuffix: '· Salih-Can Özdemir Portfolio CMS'
    }
  },
  editor: lexicalEditor(),
  // English/German parity with the Angular runtime i18n. Mark the user-facing
  // text fields (`localized: true`) in the collections to translate per locale;
  // `skills` stays language-agnostic.
  localization: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    fallback: true
  },
  collections: [Skills, Projects, Timeline],
  globals: [Profile],
  cors: (process.env.CORS_ORIGINS || '*').split(','),
  csrf: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://127.0.0.1/portfolio-cms'
  })
});
