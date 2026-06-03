// Tour date
export default {
  name: 'tourDate',
  title: 'Tour Date',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'Display date e.g. APRIL 18',
      validation: R => R.required(),
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'e.g. 2026',
      validation: R => R.required(),
    },
    {
      name: 'venue',
      title: 'Venue',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. Cebu City, Philippines',
      validation: R => R.required(),
    },
    {
      name: 'status',
      title: 'Ticket Status',
      type: 'string',
      options: { list: ['available', 'limited', 'sold-out'], layout: 'radio' },
      initialValue: 'available',
    },
  ],
  preview: {
    select: { title: 'venue', date: 'date', year: 'year', status: 'status' },
    prepare({ title, date, year, status }) {
      return { title, subtitle: `${date} ${year} — ${status}` }
    },
  },
}
