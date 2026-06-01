// Media video — for the Media section (06 //) featured layout
export default {
  name: 'mediaVideo',
  title: 'Media Video',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'meta',
      title: 'Meta',
      type: 'string',
      description: 'e.g. Album Name · Year · Duration',
    },
    {
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'The part after ?v= in the YouTube URL. E.g. dQw4w9WgXcQ',
    },
    {
      name: 'featured',
      title: 'Featured (large slot)',
      type: 'boolean',
      description: 'Turn on for the large left slot. Only one video should be featured.',
      initialValue: false,
    },
    {
      name: 'hue',
      title: 'Thumbnail Colour Hue',
      type: 'number',
      description: '0–360. Used for placeholder thumbnail when no YouTube ID is set.',
      initialValue: 200,
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'meta', featured: 'featured' },
    prepare({ title, subtitle, featured }) {
      return { title, subtitle: `${featured ? '⭐ Featured — ' : ''}${subtitle || ''}` }
    },
  },
}
