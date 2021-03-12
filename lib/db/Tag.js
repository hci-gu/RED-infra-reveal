const { Text, Select, Float, Relationship } = require('@keystonejs/fields')

let keystone
let listeners = []
const name = 'Tag'
const Tag = {
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
    domainFilters: {
      type: Relationship,
      ref: 'DomainFilter',
      many: true,
    },
    tagType: { type: Select, options: 'provider, function' },
  },
}

module.exports = {
  init: (instance) => {
    keystone = instance
    keystone.createList(name, Tag)
  },
  name,
  Tag,
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
}
