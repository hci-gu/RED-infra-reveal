import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'

import { text, relationship, timestamp, float } from '@keystone-6/core/fields'
import { KeystoneContext } from '@keystone-6/core/types'

type OnPacket = (a: any) => void
let listeners: {
  operation: 'create' | 'update' | 'delete'
  callback: OnPacket
}[] = []
const Packet = list({
  fields: {
    session: relationship({
      ref: 'Session',
    }),
    timestamp: timestamp({
      validation: { isRequired: true },
      defaultValue: { kind: 'now' },
    }),
    host: text({ validation: { isRequired: true } }),
    ip: text({ validation: { isRequired: true } }),
    protocol: text(),
    method: text(),
    accept: text(),
    contentType: text(),
    userId: text(),
    lat: float(),
    lon: float(),
    clientLat: float(),
    clientLon: float(),
    country: text(),
    region: text(),
    city: text(),
    userAgent: text(),
    contentLength: float(),
    responseTime: float(),
  },
  ui: {
    listView: {
      initialColumns: ['timestamp', 'host', 'method'],
    },
  },
  access: allowAll,
  hooks: {
    afterOperation: async ({ operation, item, context }) => {
      listeners.forEach((l) => {
        if (l.operation === operation) {
          l.callback(item)
        }
      })
      if (operation == 'create') {
        try {
          // look up Domain and increment "hits" field
          const domain = await context.db.Domain.findOne({
            where: { name: item.host },
          })
          if (!domain) {
            throw new Error('Domain not found')
          }
          await context.db.Domain.updateOne({
            where: { name: item.host },
            data: { hits: (domain.hits as any) + 1 },
          })
        } catch (e) {
          context.db.Domain.createOne({
            data: {
              name: item.host,
            },
          }).catch((e) => {})
        }
      }
    },
  },
})

export const create = (context: KeystoneContext, data: any) =>
  context.db.Packet.createOne({
    data,
  }).catch((e) => {})

export const addListener = (
  operation: 'create' | 'update' | 'delete',
  listener: OnPacket
) => {
  listeners.push({
    operation,
    callback: listener,
  })
}

export default Packet
