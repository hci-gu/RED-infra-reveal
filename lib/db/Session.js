const { getItems } = require('@keystonejs/server-side-graphql-client')
const { Text, DateTime, Virtual } = require('@keystonejs/fields')

const PacketsForSessionQuery = `
query getList($where: PacketWhereInput) {
  allPackets(where: $where) {
    userId
    clientLat
    clientLon
  }
}
`

const getUniquePositionFromPackets = (packets) => {
  const positionMap = packets.reduce((acc, curr) => {
    if (curr.clientLat && !acc[curr.userId]) {
      acc[curr.userId] = {
        lat: curr.clientLat,
        lon: curr.clientLon,
      }
    }
    return acc
  }, {})

  return Object.keys(positionMap).map((key) => positionMap[key])
}

let keystone
let listeners = []
const listKey = 'Session'
const Session = {
  fields: {
    name: {
      type: Text,
      defaultValue: () => 'Session',
    },
    start: {
      type: DateTime,
      isRequired: true,
    },
    end: {
      type: DateTime,
      isRequired: false,
    },
    clientPositions: {
      type: Virtual,
      extendGraphQLTypes: [`type Position { lat: Float, lon: Float }`],
      graphQLReturnType: `[Position]`,
      graphQLReturnFragment: `{
        lat
        lon
      }`,
      resolver: async (item, args, context) => {
        const { data, errors } = await context.executeGraphQL({
          query: PacketsForSessionQuery,
          variables: {
            where: { session: { id: item.id } },
          },
        })
        if (!errors) {
          const positions = getUniquePositionFromPackets(data.allPackets)
          return positions
        }
        return []
      },
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
