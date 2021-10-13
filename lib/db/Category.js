const { Text } = require('@keystonejs/fields')

let keystone
const listKey = 'Category'
const Category = {
  fields: {
    name: {
      type: Text,
      isRequired: true,
    },
  },
}

module.exports = {
  init: (instance) => {
    keystone = instance
    keystone.createList(listKey, Category)
  },
  name: listKey,
  Category,
}
