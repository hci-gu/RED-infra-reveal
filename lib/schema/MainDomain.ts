import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'

import { text, relationship } from '@keystone-6/core/fields'

const MainDomain = list({
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    domains: relationship({ ref: 'Domain', many: true }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'domains'],
    },
  },
  access: allowAll,
})

export default MainDomain
