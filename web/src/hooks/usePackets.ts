import { createQuery } from 'solid-urql'

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

const [items, state] = createQuery({
  query: PacketQuery,
  variables: {
    where: {
      session: { id: { equals: 'e08d77a0-01b4-44af-8c98-fa036572d4b4' } },
    },
  },
})

const usePackets = () => {
  console.log(state())

  return items()
}

export default usePackets
