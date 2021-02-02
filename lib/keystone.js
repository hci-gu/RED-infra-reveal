require('dotenv').config()

const { Keystone } = require('@keystonejs/keystone')
const { KnexAdapter } = require('@keystonejs/adapter-knex')
const { GraphQLApp } = require('@keystonejs/app-graphql')
const initDB = require('./db/index.js')

const { NAME, COOKIE_SECRET } = process.env
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB } = process.env

const keystone = new Keystone({
  adapter: new KnexAdapter({
    knexOptions: {
      client: 'pg',
      connection: {
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB,
      },
    },
  }),
  name: NAME || 'keystone',
  cookieSecret: COOKIE_SECRET,
})
initDB(keystone)

module.exports = {
  keystone,
  runKeystone: async (app, additionalApps = []) => {
    await keystone.connect()
    const { middlewares } = await keystone.prepare({
      apps: [new GraphQLApp(), ...additionalApps],
    })
    app.use(middlewares)
  },
}
