import { createClient } from '@urql/core'
import { createResource } from 'solid-js'

const client = createClient({
  url: 'https://api.infrareveal.net/api/graphql',
})

const PacketQuery = `
query getPackets($where: PacketWhereInput!) {
  packets(where: $where) {
    id
    timestamp
    ip
    host
    protocol
    method
    accept
    lat
    lon
    country
    region
    city
    userId
    clientLat
    clientLon
    contentLength
    responseTime
  }
}
`

const [packets] = createResource(() =>
  client
    .query(PacketQuery, {
      where: {
        session: { id: { equals: 'd96a1321-54fd-4b5a-b5d1-5b8cf1a6fab1' } },
      },
    })
    .toPromise()
    .then(({ data }) => data.packets)
)

export default packets
