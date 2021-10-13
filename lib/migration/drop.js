require('dotenv').config()

const { Keystone } = require('@keystonejs/keystone')
const { KnexAdapter } = require('@keystonejs/adapter-knex')

const initDB = require('../db/index.js')
const { wait } = require('./utils.js')

const { NAME, COOKIE_SECRET } = process.env
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB } = process.env

const run = async () => {
  console.log('THE DB WILL DROP IN 5 seconds unless you abort!!!')
  await wait(5000)

  const keystone = new Keystone({
    adapter: new KnexAdapter({
      dropDatabase: true,
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
  await keystone.connect()

  console.log('dropping database')
  await wait(5000)
  console.log('dropped database, exiting')
  process.exit(0)
}

run()
