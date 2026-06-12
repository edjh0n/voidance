export default {
  name: 'originPage',
  title: 'Origin Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'ORIGIN',
      validation: R => R.required(),
    },
    {
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
      validation: R => R.required().min(1),
    },
    {
      name: 'facts',
      title: 'Facts',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Label', type: 'string', validation: R => R.required() },
          { name: 'value', title: 'Value', type: 'string', validation: R => R.required() },
        ],
        preview: { select: { title: 'label', subtitle: 'value' } },
      }],
    },
    {
      name: 'timeline',
      title: 'Timeline',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'year', title: 'Year / Label', type: 'string', validation: R => R.required() },
          { name: 'text', title: 'Text', type: 'text', rows: 2, validation: R => R.required() },
          { name: 'muted', title: 'Muted / Upcoming', type: 'boolean', initialValue: false },
        ],
        preview: { select: { title: 'year', subtitle: 'text' } },
      }],
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}
