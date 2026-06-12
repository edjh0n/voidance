export default {
  name: 'merchProduct',
  title: 'Merch Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: R => R.required(),
    },
    {
      name: 'sub',
      title: 'Subtitle',
      type: 'string',
      description: 'Short material or variant line, e.g. Black - 100% Cotton',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short product description shown on the merch card.',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['apparel', 'accessories', 'stickers', 'physical'], layout: 'radio' },
      validation: R => R.required(),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Display price, e.g. PHP 650',
      validation: R => R.required(),
    },
    {
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['S', 'M', 'L', 'XL', '2XL'], layout: 'tags' },
      description: 'Available apparel sizes. Leave empty for one-size or non-apparel items.',
    },
    {
      name: 'badge',
      title: 'Badge',
      type: 'string',
      options: { list: ['new', 'limited'], layout: 'radio' },
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'number',
      initialValue: 0,
      validation: R => R.required().min(0),
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Show this product on the live site.',
      initialValue: true,
    },
    {
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'art',
      title: 'Fallback Art Key',
      type: 'string',
      description: 'Optional placeholder key: tee, hoodie, longsleeve, cap, pins, wristband, stickers, eclipse, crest, cd, poster',
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      initialValue: 100,
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'price', media: 'image', stock: 'stock' },
    prepare({ title, subtitle, media, stock }) {
      return { title, subtitle: `${subtitle || ''} - ${stock ?? 0} in stock`, media }
    },
  },
}
