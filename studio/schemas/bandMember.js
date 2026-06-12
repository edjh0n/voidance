export default {
  name: 'bandMember',
  title: 'Band Member',
  type: 'document',
  fields: [
    {
      name: 'initials',
      title: 'Initials',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'instrument',
      title: 'Instrument',
      type: 'string',
    },
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 2,
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
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
    select: { title: 'name', subtitle: 'role' },
  },
}
