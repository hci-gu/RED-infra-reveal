import 'dotenv/config'
import express from 'express'
import { config as keystoneConfig } from '@keystone-6/core'
import { getContext } from '@keystone-6/core/context'
import { lists } from './lib/schema'
import { withAuth, session } from './lib/auth'
import {
  BaseKeystoneTypeInfo,
  DatabaseConfig,
  KeystoneContext,
} from '@keystone-6/core/types'
import * as PrismaModule from '.prisma/client'
import { version } from './package.json'
import socket from './lib/socket'

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DBNAME,
  POSTGRES_DBNAME_TEST,
} = process.env

function getDBConfig(): DatabaseConfig<BaseKeystoneTypeInfo> {
  let url = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}/${POSTGRES_DBNAME}`
  if (process.env.NODE_ENV === 'test') {
    url = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}/${POSTGRES_DBNAME_TEST}`
  }

  return {
    provider: 'postgresql',
    url,
    idField: { kind: 'uuid' },
  }
}

let keystonceInstance: KeystoneContext<BaseKeystoneTypeInfo> | null = null
export const config = keystoneConfig({
  db: {
    ...getDBConfig(),
  },
  ui: {
    isAccessAllowed: (context) => !!context.session?.data,
  },
  lists,
  session,
  server: {
    cors: {
      origin: '*',
    },
    extendExpressApp: (app) => {
      if (!keystonceInstance) {
        keystonceInstance = getContext(config, PrismaModule)
        socket(app, keystonceInstance)
      }
      app.get('/version', (req, res) => {
        res.send(version)
      })

      app.use(express.json())
      app.post('/data/:type', async (req, res) => {
        if (!keystonceInstance) return res.send('ok')
        const { type } = req.params
        const { data } = req.body
        const { db } = keystonceInstance
        console.log(db)
        await db[type].createMany({
          data,
        })
        res.send('ok')
      })
    },
  },
})

export default withAuth(config)
