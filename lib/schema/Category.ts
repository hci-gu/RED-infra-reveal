import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'

import { text } from '@keystone-6/core/fields'

const Category = list({
  fields: {
    name: text({ validation: { isRequired: true } }),
  },
  ui: {
    listView: {
      initialColumns: ['name'],
    },
  },
  access: allowAll,
})

export default Category
