const { Text, DateTime, Float, Relationship } = require('@keystonejs/fields')
const {
  createItem,
  getItems,
  updateItems,
} = require('@keystonejs/server-side-graphql-client')

let keystone
let listeners = []
const listKey = 'Packet'
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
    contentType: {
      type: Text,
    },
    lat: {
      type: Float,
    },
    lon: {
      type: Float,
    },
    userId: {
      type: Text,
    },
    clientLat: {
      type: Float,
    },
    clientLon: {
      type: Float,
    },
    country: {
      type: Text,
    },
    region: {
      type: Text,
    },
    city: {
      type: Text,
    },
    userAgent: {
      type: Text,
    },
    contentLength: {
      type: Float,
    },
    responseTime: {
      type: Float,
    },
  },
  adminConfig: {
    defaultColumns: 'timestamp, host, method',
    defaultPageSize: 50,
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
    keystone.createList(listKey, Packet)
  },
  Packet,
  name: listKey,
  create: (data) =>
    createItem({
      keystone,
      listKey,
      item: data,
    }).catch((e) => {}),
  getItems: (pageSize = 100) =>
    getItems({
      keystone,
      listKey,
      pageSize,
      first: 10,
      returnFields: `id ip`,
    }),
  update: (items) =>
    updateItems({
      keystone,
      listKey,
      items,
    }).catch((e) => console.log(e, items)),
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
}
