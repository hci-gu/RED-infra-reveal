const { getItems } = require('@keystonejs/server-side-graphql-client')
const { DateTime } = require('@keystonejs/fields')

let keystone
let listeners = []
const listKey = 'Session'
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
    keystone.createList(listKey, Session)
  },
  name: listKey,
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
      listKey,
      returnFields: 'id, end',
    })
    if (activeSessions && activeSessions.length) {
      return activeSessions.find((session) => !session.end)
    }
  },
}
