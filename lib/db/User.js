const { Text, Password } = require('@keystonejs/fields')

let keystone
const name = 'User'
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
    keystone.createList(name, User)
  },
  name,
  User,
}
