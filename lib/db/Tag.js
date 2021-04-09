const { Text, Select, Float, Relationship } = require('@keystonejs/fields')

let keystone
let listeners = []
const listKey = 'Tag'
const Tag = {
  fields: {
    name: {
      type: Text,
      isRequired: true,
    },
    domains: {
      type: Relationship,
      ref: 'MainDomain',
      many: true,
    },
    tagType: { type: Select, options: 'provider, function' },
  },
}

module.exports = {
  init: (instance) => {
    keystone = instance
    keystone.createList(listKey, Tag)
  },
  name: listKey,
  Tag,
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
}
