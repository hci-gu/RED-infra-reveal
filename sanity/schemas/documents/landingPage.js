export default {
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  i18n: true,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'mainHeading',
      title: 'Main Heading',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    },
    {
      name: 'sessionsTitle',
      title: 'Sessions Title',
      type: 'string',
    },
  ],

  preview: {
    // select: {
    //   title: 'title',
    //   author: 'author.name',
    //   media: 'mainImage',
    // },
    // prepare(selection) {
    //   const { author } = selection
    //   return Object.assign({}, selection, {
    //     subtitle: author && `by ${author}`,
    //   })
    // },
  },
}
