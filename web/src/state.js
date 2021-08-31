import { atom, selector, selectorFamily, constSelector } from 'recoil'
import { packetIsInFilters } from './utils/geo'
import moment from 'moment'
import { packetsInTag } from './utils/tag'

export const cmsContentAtom = atom({
  key: 'cms-content',
  default: {},
})

export const sessionsAtom = atom({
  key: 'sessions',
  default: [],
})
export const activeSessionIdAtom = atom({
  key: 'active-session-id',
  default: null,
})
export const activeSession = selector({
  key: 'active-session',
  get: ({ get }) => {
    const sessions = get(sessionsAtom)
    const id = get(activeSessionIdAtom)

    if (id == 'simulate') {
      return {
        clientPositions: [],
        end: null,
        id: 'simulate',
        name: 'Session',
        start: moment().format('YYYY-MM-DDTHH:mm:ss'),
      }
    }

    if (id && sessions.length) {
      return sessions.find((s) => s.id === id)
    }
    return null
  },
})

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

export const tagsAtom = atom({
  key: 'tags',
  default: [],
})

export const tagsOfType = selectorFamily({
  key: 'tags-of-type',
  get: (key) => ({ get }) => {
    const tags = get(tagsAtom)

    return tags.filter((t) => t.tagType === key)
  },
})

export const mutationAtom = atom({
  key: 'mutation',
  default: {
    allPackets: [],
    time: new Date(),
    packets: [],
    filters: [],
    recentPackets: [],
  },
})

export const timeAtom = atom({
  key: 'time',
  default: new Date(),
})

export const delayedTime = atom({
  key: 'delayed-time',
  default: new Date(),
})

export const mapToggles = atom({
  key: 'map-toggles',
  default: {
    heatmap: true,
    trajectories: true,
    packets: true,
  },
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

export const mapFiltersAtom = atom({
  key: 'map-filters',
  default: null,
})

export const filteredPackets = selector({
  key: 'filtered-packets',
  get: ({ get }) => {
    const mutation = get(mutationAtom)
    const packets = get(packetsAtom)
    const mapFilters = get(mapFiltersAtom)
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
        if (mapFilters) {
          return packetIsInFilters(p, mapFilters)
        }
        return true
      })

    return filteredPackets
  },
})

export const packetClients = selector({
  key: 'packet-clients',
  get: ({ get }) => {
    const packets = get(filteredPackets)
    return Object.keys(
      packets
        .filter((p) => p.userId)
        .reduce((map, packet) => {
          if (!map[packet.userId]) {
            map[packet.userId] = true
          }
          return map
        }, {})
    )
  },
})

export const packetTags = selector({
  key: 'packet-tags',
  get: ({ get }) => {
    const packets = get(filteredPackets)
    const tags = get(tagsOfType('provider'))

    if (!tags.length || !packets.length) {
      return [
        {
          type: 'other',
          value: 100,
        },
      ]
    }

    const packetsMap = packets.reduce((acc, curr) => {
      const parts = curr.host.split('.')
      const domain = [parts[parts.length - 2], parts[parts.length - 1]].join(
        '.'
      )
      if (acc[domain]) {
        acc[domain] += 1
      } else {
        acc[domain] = 1
      }
      return acc
    }, {})

    const values = tags
      .map((t) => ({
        value: packetsInTag(t, packetsMap),
        type: t.name,
      }))
      .filter((t) => t.value > 0)

    return [
      ...values,
      {
        type: 'other',
        value:
          packets.length - values.reduce((acc, curr) => acc + curr.value, 0),
      },
    ]
  },
})

export const packetValuesForKey = selectorFamily({
  key: 'packet-values-for-key',
  get: (key) => ({ get }) => {
    const packets = get(packetsAtom)

    return [...new Set(packets.map((packet) => packet[key]))]
  },
})
