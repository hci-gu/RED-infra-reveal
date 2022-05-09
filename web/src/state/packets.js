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

export const timeAtom = atom({
  key: 'time',
  default: Date.now(),
})
export const isPlayingAtom = atom({
  key: 'is-playing',
  default: false,
})

export const mutationAtom = atom({
  key: 'mutation',
  default: {
    allPackets: [],
    time: new Date(),
    packets: [],
    recentPackets: [],
  },
  dangerouslyAllowMutability: true,
})

export const mapFiltersAtom = atom({
  key: 'map-filters',
  default: null,
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
    const mapFilters = get(mapFiltersAtom)

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
        if (mapFilters) {
          return packetIsInFilters(p, mapFilters)
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

    return packets.reduce((acc, curr) => {
      if (curr.contentLength) {
        return acc + curr.contentLength
      }
      return acc
    }, 0)
  },
})
