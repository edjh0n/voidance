// Track — for the music player
export default {
  name: 'track',
  title: 'Track',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'album',
      title: 'Album',
      type: 'string',
      description: 'e.g. N/A · 2026',
    },
    {
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      description: 'Total track length in seconds. E.g. 3:45 = 225',
      validation: R => R.required().positive(),
    },
    {
      name: 'audioFile',
      title: 'Audio File (MP3)',
      type: 'file',
      options: { accept: 'audio/mpeg,audio/mp3,.mp3' },
      description: 'Upload your MP3 file here. It will be hosted on Sanity CDN.',
    },
    {
      name: 'type',
      title: 'Genre Type',
      type: 'string',
      options: { list: ['djent', 'progressive metal', 'prog', 'doom'] },
      initialValue: 'djent',
    },
    {
      name: 'paletteIndex',
      title: 'Album Art Palette',
      type: 'number',
      options: { list: [{ title: 'Blue (0)', value: 0 }, { title: 'Red (1)', value: 1 }, { title: 'Green (2)', value: 2 }] },
      initialValue: 2,
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'album', duration: 'duration' },
    prepare({ title, subtitle, duration }) {
      const m = Math.floor(duration / 60), s = duration % 60
      return { title, subtitle: `${subtitle} — ${m}:${s < 10 ? '0' : ''}${s}` }
    },
  },
}
