const { Text, Password } = require('@keystonejs/fields')

let keystone
const listKey = 'User'
const User = {
  fields: {
    username: {
      type: Text,
      isRequired: true,
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
