export default {
  name: 'discographyRelease',
  title: 'Discography Release',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'paletteIndex',
      title: 'Album Art Palette',
      type: 'number',
      options: { list: [{ title: 'Blue (0)', value: 0 }, { title: 'Red (1)', value: 1 }, { title: 'Green (2)', value: 2 }] },
      initialValue: 2,
    },
    {
      name: 'tracks',
      title: 'Tracks',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string', validation: R => R.required() },
          { name: 'type', title: 'Type / Genre', type: 'string' },
          { name: 'duration', title: 'Duration (seconds)', type: 'number' },
        ],
        preview: { select: { title: 'title', subtitle: 'type' } },
      }],
    },
    {
      name: 'noteLabel',
      title: 'Note Label',
      type: 'string',
      initialValue: '// NEXT',
    },
    {
      name: 'note',
      title: 'Note',
      type: 'text',
      rows: 3,
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'The site displays the first featured release.',
      initialValue: true,
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 100,
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'year' },
  },
}
