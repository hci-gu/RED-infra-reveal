const { Text } = require('@keystonejs/fields')
const { createItem } = require('@keystonejs/server-side-graphql-client')

let keystone
let listeners = []
const listKey = 'Domain'
const Domain = {
  fields: {
    name: {
      type: Text,
      isUnique: true,
      isRequired: true,
    },
  },
  hooks: {
    afterChange: async ({ operation, updatedItem }) => {
      listeners.forEach((l) => {
        if (l.operation === operation) {
          l.callback(updatedItem)
        }
      })
    },
  },
}

module.exports = {
  init: (instance) => {
    keystone = instance
    keystone.createList(listKey, Domain)
  },
  name: listKey,
  Domain,
  createFromName: (name) =>
    createItem({
      keystone,
      listKey,
      item: { name },
    }).catch((e) => {}),
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
}
