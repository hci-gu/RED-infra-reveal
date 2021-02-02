const { Text, DateTime, Float, Relationship } = require('@keystonejs/fields')

let keystone
let listeners = []
const name = 'Provider'
const Provider = {
  fields: {
    name: {
      type: Text,
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
    keystone.createList(name, Provider)
  },
  name,
  Provider,
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
}
