import { createAuth } from '@keystone-6/auth'
import { statelessSessions } from '@keystone-6/core/session'

let sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'The SESSION_SECRET environment variable must be set in production'
    )
  } else {
    sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --'
  }
}

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  sessionData: 'id admin',
  secretField: 'password',
  initFirstItem: {
    fields: ['email', 'password'],
    itemData: { admin: true },
    skipKeystoneWelcome: true,
  },
})

let sessionMaxAge = 60 * 60 * 24 * 30 // 30 days

const session = statelessSessions({
  secure: false,
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
})

export { withAuth, session }
