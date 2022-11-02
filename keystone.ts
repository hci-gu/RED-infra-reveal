import 'dotenv/config'
import { config as keystoneConfig } from '@keystone-6/core'
import { getContext } from '@keystone-6/core/context'
import { lists } from './lib/schema'
import { withAuth, session } from './lib/auth'
import { BaseKeystoneTypeInfo, DatabaseConfig } from '@keystone-6/core/types'
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
      socket(app, getContext(config, PrismaModule))
      app.get('/version', (req, res) => {
        res.send(version)
      })
    },
  },
})

export default withAuth(config)
