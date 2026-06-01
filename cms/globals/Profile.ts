import type { GlobalConfig } from 'payload';

/**
 * Profile global — the single about/identity document. Exposed by Payload at
 * `/api/globals/profile`, consumed by `CmsService.getProfile()`.
 */
export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Profile',
  admin: { group: 'Portfolio' },
  access: {
    read: () => true
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'location', type: 'text', required: true },
    { name: 'introduction', type: 'textarea', required: true },
    {
      name: 'socials',
      type: 'array',
      fields: [
        { name: 'id', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'icon', type: 'text', required: true, admin: { description: 'PrimeIcons class, e.g. "pi pi-github".' } },
        { name: 'url', type: 'text', required: true }
      ]
    },
    {
      name: 'certifications',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }]
    },
    {
      name: 'languages',
      type: 'array',
      fields: [
        { name: 'language', type: 'text', required: true },
        { name: 'level', type: 'text', required: true }
      ]
    }
  ]
};
