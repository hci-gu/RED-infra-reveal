const { DateTime } = require('@keystonejs/fields')

let keystone
const name = 'Session'
const Session = {
  fields: {
    start: {
      type: DateTime,
      isRequired: true,
    },
    end: {
      type: DateTime,
      isRequired: false,
    },
  },
}

module.exports = {
  init: (instance) => {
    keystone = instance
    keystone.createList(name, Session)
  },
  name,
  Session,
}
