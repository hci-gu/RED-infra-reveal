import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'

import {
  text,
  password,
  checkbox,
  timestamp,
  virtual,
  float,
} from '@keystone-6/core/fields'
import { KeystoneContext } from '@keystone-6/core/types'

type OnSession = (a: any) => void
let listeners: {
  operation: 'create' | 'update' | 'delete'
  callback: OnSession
}[] = []
const Session = list({
  fields: {
    name: text({
      validation: { isRequired: true },
      isFilterable: true,
      defaultValue: 'Session',
    }),
    start: timestamp({
      validation: { isRequired: true },
    }),
    end: timestamp({
      validation: { isRequired: false },
    }),
    lat: float(),
    lon: float(),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'start', 'end'],
    },
  },
  access: allowAll,
  hooks: {
    afterOperation: async ({ operation, item }) => {
      listeners.forEach((l) => {
        if (l.operation === operation) {
          l.callback(item)
        }
      })
    },
  },
})

export const addListener = (
  operation: 'create' | 'update' | 'delete',
  listener: OnSession
) => {
  listeners.push({
    operation,
    callback: listener,
  })
}

export const getLatestActive = async (context: KeystoneContext) => {
  const sessions = await context.db.Session.findMany({
    where: {
      end: null,
    },
  })
  if (sessions.length > 0) {
    return sessions[0]
  }
}

export default Session
