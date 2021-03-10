const { getItems } = require('@keystonejs/server-side-graphql-client')
const { DateTime } = require('@keystonejs/fields')

let keystone
let listeners = []
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
    keystone.createList(name, Session)
  },
  name,
  Session,
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
  getLatestActive: async () => {
    const activeSessions = await getItems({
      keystone,
      listKey: name,
      returnFields: 'id',
      where: { end: undefined },
    })
    if (activeSessions && activeSessions.length) {
      return activeSessions[0]
    }
  },
}
