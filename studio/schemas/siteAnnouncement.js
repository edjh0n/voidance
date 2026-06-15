export default {
  name: 'siteAnnouncement',
  title: 'Site Announcement',
  type: 'document',
  fields: [
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 2,
    },
    {
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
    },
    {
      name: 'ctaType',
      title: 'CTA Type',
      type: 'string',
      options: {
        list: [
          { title: 'Page', value: 'page' },
          { title: 'URL', value: 'url' },
        ],
        layout: 'radio',
      },
      initialValue: 'page',
    },
    {
      name: 'ctaPage',
      title: 'CTA Page',
      type: 'string',
      options: {
        list: [
          { title: 'Home', value: 'hero' },
          { title: 'Gallery', value: 'gallery' },
          { title: 'Origin', value: 'about' },
          { title: 'Members', value: 'members' },
          { title: 'Discography', value: 'discography' },
          { title: 'Tour', value: 'tour' },
          { title: 'Merch', value: 'merch' },
          { title: 'Contact', value: 'contact' },
        ],
      },
      hidden: ({ document }) => document?.ctaType === 'url',
    },
    {
      name: 'ctaUrl',
      title: 'CTA URL',
      type: 'url',
      hidden: ({ document }) => document?.ctaType !== 'url',
    },
    {
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Urgent', value: 'urgent' },
          { title: 'Merch', value: 'merch' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 100,
    },
  ],
  preview: {
    select: { title: 'title', active: 'active', tone: 'tone' },
    prepare({ title, active, tone }) {
      return {
        title,
        subtitle: `${active ? 'Active' : 'Inactive'} - ${tone || 'default'}`,
      }
    },
  },
}
