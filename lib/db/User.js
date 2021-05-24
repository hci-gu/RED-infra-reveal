const { Text, Password } = require('@keystonejs/fields')

let keystone
const listKey = 'User'
const User = {
  fields: {
    name: {
      type: Text,
    },
    username: {
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    password: {
      type: Password,
      isRequired: true,
    },
  },
}

module.exports = {
  init: (instance) => {
    keystone = instance
    keystone.createList(listKey, User)
  },
  name: listKey,
  User,
}
