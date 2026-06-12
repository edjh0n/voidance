export default {
  name: 'merchSettings',
  title: 'Merch Settings',
  type: 'document',
  fields: [
    {
      name: 'mode',
      title: 'Merch Display Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Live Store', value: 'live' },
          { title: 'Coming Soon', value: 'coming-soon' },
        ],
        layout: 'radio',
      },
      initialValue: 'live',
      validation: R => R.required(),
    },
    {
      name: 'comingSoonTitle',
      title: 'Coming Soon Title',
      type: 'string',
      initialValue: 'Merch Coming Soon',
      hidden: ({ document }) => document?.mode !== 'coming-soon',
    },
    {
      name: 'comingSoonMessage',
      title: 'Coming Soon Message',
      type: 'text',
      rows: 3,
      initialValue: 'Official VOIDANCE merch is being prepared. Check back soon for drops, sizes, and ordering details.',
      hidden: ({ document }) => document?.mode !== 'coming-soon',
    },
  ],
  preview: {
    select: { mode: 'mode', title: 'comingSoonTitle' },
    prepare({ mode, title }) {
      return {
        title: 'Merch Settings',
        subtitle: mode === 'coming-soon' ? title || 'Merch Coming Soon' : 'Live Store',
      }
    },
  },
}
