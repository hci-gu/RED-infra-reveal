import { atom, selector, selectorFamily } from 'recoil'
import { packetIsInFilters } from '../utils/geo'

/*
  timestamp
  host
  ip
  protocol
  method
  accept
  location {
    coordinates: [lat, lon]
  }
  country
  city
  timezone
*/
export const packetsAtom = atom({
  key: 'packets',
  default: [],
})

export const packetsFilters = atom({
  key: 'packets-filters',
  default: {
    host: '',
    protocol: [],
    method: [],
    accept: [],
    host: [],
    timeRange: [0, 1],
  },
})

export const mutationAtom = atom({
  key: 'mutation',
  default: {
    allPackets: [],
    time: new Date(),
    packets: [],
    filters: null,
    recentPackets: [],
  },
  dangerouslyAllowMutability: true,
})

export const packetValuesForKey = selectorFamily({
  key: 'packet-values-for-key',
  get: (key) => ({ get }) => {
    const packets = get(packetsAtom)

    return [...new Set(packets.map((packet) => packet[key]))]
  },
})

export const filteredPackets = selector({
  key: 'filtered-packets',
  get: ({ get }) => {
    const mutation = get(mutationAtom)
    const packets = get(packetsAtom)
    const filter = get(packetsFilters)

    const filteredPackets = packets
      .slice()
      .reverse()
      .filter((p) => {
        const date = new Date(p.timestamp)
        return date < mutation.time
      })
      .filter((p) => {
        return (
          filter.method.length === 0 || filter.method.indexOf(p.method) != -1
        )
      })
      .filter((p) => {
        return filter.host.length === 0 || filter.host.indexOf(p.host) == -1
      })
      .filter((p) => {
        if (mutation.filters) {
          return packetIsInFilters(p, mutation.filters)
        }
        return true
      })

    return filteredPackets
  },
})

export const packetContentSize = selector({
  key: 'packet-content-size',
  get: ({ get }) => {
    const packets = get(packetsAtom)
    console.log('contentSize', packets.length)
    console.log(
      'sizes',
      packets.map((p) => p.contentLength)
    )

    return packets.reduce((acc, curr) => {
      if (curr.contentLength) {
        return acc + curr.contentLength
      }
      return acc
    }, 0)
  },
})

export const averageResponseTime = selector({
  key: 'avg-response-time',
  get: ({ get }) => {
    const packets = get(packetsAtom)

    return (
      packets.reduce((acc, curr) => {
        if (curr.responseTime) {
          return acc + curr.responseTime
        }
        return acc
      }, 0) / packets.length
    )
  },
})
