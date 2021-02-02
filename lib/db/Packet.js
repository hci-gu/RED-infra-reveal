const { Text, DateTime, Float, Relationship } = require('@keystonejs/fields')
const { createItem } = require('@keystonejs/server-side-graphql-client')

let keystone
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
      isRequired: true,
    },
    method: {
      type: Text,
      isRequired: true,
    },
    accept: {
      type: Text,
      isRequired: true,
    },
    lat: {
      type: Float,
      isRequired: true,
    },
    lon: {
      type: Float,
      isRequired: true,
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
}
