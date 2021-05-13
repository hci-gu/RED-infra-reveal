const { Text, DateTime, Float, Relationship } = require('@keystonejs/fields')
const { createItem } = require('@keystonejs/server-side-graphql-client')
const { text } = require('body-parser')

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
    lat: {
      type: Float,
    },
    lon: {
      type: Float,
    },
    userId: {
      type: Text,
    },
    userAgent: {
      type: Text,
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
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
}
