export default {
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
    },
    {
      title: 'Images',
      name: 'images',
      type: 'array',
      of: [{ type: 'guideImage' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
