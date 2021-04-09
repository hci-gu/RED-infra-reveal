const { Text, Relationship } = require('@keystonejs/fields')
const {
  createItem,
  getItems,
  updateItem,
  runCustomQuery,
} = require('@keystonejs/server-side-graphql-client')

let keystone
let listeners = []
const listKey = 'MainDomain'
const MainDomain = {
  fields: {
    name: {
      type: Text,
      isUnique: true,
      isRequired: true,
    },
    domains: {
      type: Relationship,
      ref: 'Domain',
      many: true,
    },
  },
}

module.exports = {
  init: (instance) => {
    keystone = instance
    keystone.createList(listKey, MainDomain)
  },
  name: listKey,
  MainDomain,
  update: async (id, domainId) => {
    await updateItem({
      keystone,
      listKey,
      item: {
        id,
        data: {
          domains: { connect: { id: domainId } },
        },
      },
    }).catch((e) => {})
  },
  get: async (name) => {
    const maindomains = await getItems({
      keystone,
      listKey,
      returnFields: 'id, name, domains',
      where: { name },
    })
    return maindomains[0]
  },
  create: ({ name, domainId }) =>
    createItem({
      keystone,
      listKey,
      item: {
        name,
        domains: {
          connect: [{ id: domainId }],
        },
      },
    }).catch((e) => {}),
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
}
