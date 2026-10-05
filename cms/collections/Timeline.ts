import type { CollectionConfig, Field } from 'payload';

/** Fields shared by a milestone and its nested sub-entries. */
const milestoneFields: Field[] = [
  { name: 'period', type: 'text', required: true, admin: { description: 'e.g. "2025 – Present"' } },
  { name: 'organisation', type: 'text', required: true },
  { name: 'role', type: 'text', required: true },
  { name: 'title', type: 'text', required: true },
  { name: 'summary', type: 'textarea', required: true },
  { name: 'responsibilities', type: 'array', fields: [{ name: 'value', type: 'text', required: true }] },
  { name: 'techStack', type: 'array', fields: [{ name: 'value', type: 'text', required: true }] },
  {
    name: 'current',
    type: 'checkbox',
    defaultValue: false,
    admin: { description: 'Marks the active tenure (highlighted node).' }
  }
];

/**
 * Timeline collection — career milestones for the interactive timeline.
 * Mirrors the Angular `TimelineMilestone` model, including two levels of nested
 * `children`: roles/projects within an employer, and e.g. customer projects
 * within a product (adesso → adessoGPT → Vivawest / BVB / AOK).
 */
export const Timeline: CollectionConfig = {
  slug: 'timeline',
  labels: { singular: 'Milestone', plural: 'Timeline' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['period', 'organisation', 'role', 'current'],
    group: 'Portfolio'
  },
  access: {
    read: () => true
  },
  fields: [
    ...milestoneFields,
    {
      name: 'children',
      type: 'array',
      labels: { singular: 'Sub-entry', plural: 'Sub-entries' },
      admin: { description: 'Nested roles/projects within this employer/tenure.' },
      fields: [
        ...milestoneFields,
        {
          name: 'children',
          type: 'array',
          labels: { singular: 'Sub-project', plural: 'Sub-projects' },
          admin: { description: 'Second level, e.g. customer projects within a product.' },
          fields: milestoneFields
        }
      ]
    }
  ]
};
