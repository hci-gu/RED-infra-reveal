const fs = require('fs')
const { keystone } = require('../keystone')
const { getItems } = require('@keystonejs/server-side-graphql-client')
const { GraphQLApp } = require('@keystonejs/app-graphql')
const { promiseSeries } = require('./utils')

const lists = [
  {
    listKey: 'Session',
    queryKey: 'allSessions',
    query: `
    {
      allSessions(skip: 0) {
        id
        name
        start
        end
      }
    }
    `,
  },
  {
    listKey: 'Domain',
    queryKey: 'allDomains',
    query: `
    {
      allDomains(skip: 0) {
        name
      }
    }
    `,
  },
  {
    listKey: 'MainDomain',
    queryKey: 'allMainDomains',
    query: `
    {
      allMainDomains(skip: 0) {
        name
        domains {
          name
        }
      }
    }
    `,
  },
  {
    listKey: 'Category',
    queryKey: 'allCategories',
    query: `
    {
      allCategories(skip: 0) {
        name
      }
    }
    `,
  },
  {
    listKey: 'Tag',
    queryKey: 'allTags',
    query: `
    {
      allTags(skip: 0) {
        name
        domains {
          name
        }
        tagType {
          name
        }
      }
    }
    `,
  },
]

const backupList = async ({ listKey, query, queryKey }) => {
  const { data, errors } = await keystone.executeGraphQL({
    query,
  })

  return {
    listKey,
    items: data[queryKey],
  }
}

const run = async () => {
  await keystone.connect()
  await keystone.prepare({
    apps: [new GraphQLApp()],
  })
  console.log('run')
  const listsWithItems = await promiseSeries(lists, backupList)
  console.log(listsWithItems)

  fs.writeFileSync('./tmp.json', JSON.stringify(listsWithItems, null, 2))
  process.exit(0)
}

run()
