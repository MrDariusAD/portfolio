import type { CollectionConfig } from 'payload';

/**
 * Projects collection — mirrors the Angular `Project` model
 * (src/app/core/models.ts). Privacy-policy and GDPR content live here as
 * Markdown and are surfaced through the hidden `/projects/:slug/privacy|gdpr`
 * routes in the Angular app.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'hasPrivacyPolicy', 'hasGdprInstructions'],
    group: 'Portfolio'
  },
  access: {
    read: () => true
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL-safe identifier, e.g. "int-kmp".' }
    },
    { name: 'icon', type: 'text', admin: { description: 'Emoji/icon shorthand.' } },
    { name: 'shortSummary', type: 'textarea', required: true },
    {
      name: 'fullDescription',
      type: 'textarea',
      required: true,
      admin: { description: 'Markdown — rendered in the project detail dialog.' }
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }]
    },
    {
      name: 'lifecycle',
      type: 'array',
      admin: { description: 'Optional ordered state-machine states.' },
      fields: [{ name: 'value', type: 'text', required: true }]
    },
    {
      type: 'collapsible',
      label: 'Links',
      fields: [
        { name: 'githubUrl', type: 'text' },
        { name: 'linkedInUrl', type: 'text' },
        { name: 'emailUrl', type: 'text' },
        { name: 'discordUrl', type: 'text' }
      ]
    },
    {
      type: 'collapsible',
      label: 'Legal — Privacy',
      fields: [
        { name: 'hasPrivacyPolicy', type: 'checkbox', defaultValue: false },
        {
          name: 'privacyPolicyMarkdown',
          type: 'textarea',
          admin: {
            condition: (data) => Boolean(data?.hasPrivacyPolicy),
            description: 'Markdown rendered at /projects/:slug/privacy'
          }
        }
      ]
    },
    {
      type: 'collapsible',
      label: 'Legal — GDPR',
      fields: [
        { name: 'hasGdprInstructions', type: 'checkbox', defaultValue: false },
        {
          name: 'gdprInstructionsMarkdown',
          type: 'textarea',
          admin: {
            condition: (data) => Boolean(data?.hasGdprInstructions),
            description: 'Markdown rendered at /projects/:slug/gdpr'
          }
        }
      ]
    }
  ]
};
