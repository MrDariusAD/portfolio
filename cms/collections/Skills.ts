import type { CollectionConfig } from 'payload';

/**
 * Skills collection — mirrors the Angular `Skill` model
 * (src/app/core/models.ts) 1:1 so the local mock JSON and the live Payload API
 * are drop-in interchangeable.
 */
export const Skills: CollectionConfig = {
  slug: 'skills',
  labels: { singular: 'Skill', plural: 'Skills' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'proficiency'],
    group: 'Portfolio'
  },
  access: {
    read: () => true // public portfolio content
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Frontend', value: 'Frontend' },
        { label: 'Backend', value: 'Backend' },
        { label: 'DevOps', value: 'DevOps' },
        { label: 'Databases', value: 'Databases' },
        { label: 'Tools & Design', value: 'Tools_Design' }
      ]
    },
    {
      name: 'proficiency',
      type: 'number',
      required: true,
      min: 1,
      max: 100,
      admin: { description: 'Proficiency on a 1–100 scale for UI metric rendering.' }
    },
    {
      name: 'tags',
      type: 'array',
      labels: { singular: 'Tag', plural: 'Tags' },
      fields: [{ name: 'value', type: 'text', required: true }]
    }
  ]
};
