const { GraphQLApp } = require('@keystonejs/app-graphql')
const { AdminUIApp } = require('@keystonejs/app-admin-ui')
const { PasswordAuthStrategy } = require('@keystonejs/auth-password')
const { keystone } = require('./keystone')

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: {
    identityField: 'username',
    secretField: 'password',
  },
})

const adminApp = new AdminUIApp({
  name: 'infra-reveal',
  enableDefaultRoute: true,
  // authStrategy,
})

module.exports = {
  keystone,
  adminApp,
  apps: [new GraphQLApp(), adminApp],
}
