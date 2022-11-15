import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'

import { text, relationship } from '@keystone-6/core/fields'

const Tag = list({
  fields: {
    name: text({ validation: { isRequired: true } }),
    category: relationship({ ref: 'Category' }),
  },
  ui: {
    listView: {
      initialColumns: ['name'],
    },
  },
  access: allowAll,
})

export default Tag
