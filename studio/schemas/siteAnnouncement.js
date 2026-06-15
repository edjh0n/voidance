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
      description: 'Shows immediately when enabled unless the announcement has expired.',
    },
    {
      name: 'announcementType',
      title: 'Announcement Type',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Gig', value: 'gig' },
          { title: 'Merch Drop', value: 'merch' },
          { title: 'Single Release', value: 'single' },
          { title: 'Album Release', value: 'album' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
      description: 'Gig, merch, single, and album announcements can auto-display from date fields.',
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
      name: 'eventDate',
      title: 'Event Date',
      type: 'date',
      hidden: ({ document }) => document?.announcementType !== 'gig',
      description: 'For gig announcements only. Used for automatic display timing.',
    },
    {
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      hidden: ({ document }) => !['single', 'album', 'merch'].includes(document?.announcementType),
      description: 'For single, album, and merch announcements. Used for scheduled release timing.',
    },
    {
      name: 'autoShowDaysBefore',
      title: 'Auto Show Days Before',
      type: 'number',
      initialValue: 7,
      hidden: ({ document }) => !['gig', 'single', 'album', 'merch'].includes(document?.announcementType),
      validation: R => R.min(0).integer(),
      description: 'If Active is off, show this announcement this many days before its event/release date. Recommended: 7 for gigs, 14 for releases.',
    },
    {
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'High', value: 'high' },
          { title: 'Urgent', value: 'urgent' },
        ],
        layout: 'radio',
      },
      initialValue: 'normal',
      description: 'Urgent announcements can override upcoming gig countdowns, but not LIVE NOW.',
    },
    {
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'Optional. Hides the announcement after this date and time, even if Active is on.',
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
          { title: 'Release', value: 'release' },
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
    select: { title: 'title', active: 'active', tone: 'tone', announcementType: 'announcementType' },
    prepare({ title, active, tone, announcementType }) {
      return {
        title,
        subtitle: `${active ? 'Active' : 'Inactive'} - ${announcementType || 'general'} - ${tone || 'default'}`,
      }
    },
  },
}
