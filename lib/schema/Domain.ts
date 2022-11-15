import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'

import { text, relationship, integer } from '@keystone-6/core/fields'
import { parseDomain, ParseResultType } from 'parse-domain'

const fixEdgeCases = (domain: string, topLevelDomains: string[]) => {
  if (domain.indexOf('.') !== -1) {
    const parts = domain.split('.')
    return `${parts[parts.length - 1]}.${topLevelDomains.join('.')}`
  }
  if (topLevelDomains.indexOf('googleapis') !== -1) {
    return topLevelDomains.join('.')
  }

  return `${domain}.${topLevelDomains.join('.')}`
}

const Domain = list({
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    hits: integer({ defaultValue: 1 }),
    tags: relationship({ ref: 'Tag', many: true }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'tags'],
    },
  },
  access: allowAll,
  hooks: {
    afterOperation: async ({ operation, item, context }) => {
      if (operation == 'create') {
        const result = parseDomain(item.name as string)
        if (result.type === ParseResultType.Listed) {
          const { subDomains, domain, topLevelDomains } = result
          let host: string
          if (!subDomains.length && domain) {
            host = fixEdgeCases(domain, topLevelDomains)
          } else {
            host = `${domain}.${topLevelDomains.join('.')}`
          }
          try {
            await context.db.MainDomain.updateOne({
              where: { name: host },
              data: {
                name: host,
                domains: { connect: { id: item.id } },
              },
            })
          } catch (e) {
            await context.db.MainDomain.createOne({
              data: {
                name: host,
                domains: { connect: { id: item.id } },
              },
            }).catch((_) => {})
          }
        }
      }
    },
  },
})

export default Domain
