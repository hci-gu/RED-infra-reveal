import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'

import { text, password, checkbox } from '@keystone-6/core/fields'

const User = list({
  fields: {
    email: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
      isFilterable: true,
    }),
    password: password({ validation: { isRequired: true } }),
    admin: checkbox({ defaultValue: false }),
  },
  ui: {
    labelField: 'email',
    searchFields: ['email'],
    listView: {
      initialColumns: ['id', 'admin'],
    },
  },
  access: allowAll,
})

export default User
