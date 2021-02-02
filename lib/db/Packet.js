const { Text, DateTime, Float, Relationship } = require('@keystonejs/fields')
const { createItem } = require('@keystonejs/server-side-graphql-client')

let keystone
let listeners = []
const name = 'Packet'
const Packet = {
  fields: {
    session: {
      type: Relationship,
      ref: 'Session',
      isRequired: true,
    },
    timestamp: {
      type: DateTime,
      isRequired: true,
    },
    host: {
      type: Text,
      isRequired: true,
    },
    ip: {
      type: Text,
      isRequired: true,
    },
    protocol: {
      type: Text,
    },
    method: {
      type: Text,
    },
    accept: {
      type: Text,
    },
    lat: {
      type: Float,
    },
    lon: {
      type: Float,
    },
  },
  adminConfig: {
    defaultColumns: 'timestamp, host, method',
    defaultPageSize: 50,
  },
  hooks: {
    afterChange: async ({ operation, updatedItem }) => {
      if (operation === 'create') {
        try {
          await createItem({
            keystone,
            listKey: 'Domain',
            item: { name: updatedItem.host },
          })
        } catch (e) {}
      }
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
    keystone.createList(name, Packet)
  },
  Packet,
  name,
  create: (data) =>
    createItem({
      keystone,
      listKey: name,
      item: data,
    }),
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
}
