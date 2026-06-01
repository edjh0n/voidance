// Gallery item — photos and YouTube videos for Events & Live section
export default {
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['image', 'video'], layout: 'radio' },
      validation: R => R.required(),
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ document }) => document?.type !== 'image',
    },
    {
      name: 'videoId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'The part after ?v= in the YouTube URL. E.g. dQw4w9WgXcQ',
      hidden: ({ document }) => document?.type !== 'video',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'event',
      title: 'Event Name',
      type: 'string',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    },
  ],
  preview: {
    select: { title: 'caption', subtitle: 'event', media: 'photo', type: 'type' },
    prepare({ title, subtitle, media, type }) {
      return { title, subtitle: `${type?.toUpperCase()} — ${subtitle || ''}`, media }
    },
  },
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
}
