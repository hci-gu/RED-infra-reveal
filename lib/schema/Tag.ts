import { graphql, list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'

import { text, relationship, virtual } from '@keystone-6/core/fields'

const Tag = list({
  fields: {
    name: text({ validation: { isRequired: true } }),
    category: relationship({ ref: 'Category' }),
    domains: virtual({
      field: graphql.field({
        type: graphql.list(graphql.String),
        async resolve(item: any, _, context) {
          const domains = await context.db.Domain.findMany({
            where: { tags: { some: { id: { equals: item.id } } } },
          })
          return domains.map((d: any) => d.name)
        },
      }),
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name'],
    },
  },
  access: allowAll,
})

export default Tag
