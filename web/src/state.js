import { atom, selector, selectorFamily } from 'recoil'
import {
  packetOrigin,
  pointAlongTrajectory,
  trajectoryForPacket,
} from './utils/geo'
import moment from 'moment'
import { packetsInTag } from './utils/tag'

export const sessionsAtom = atom({
  key: 'sessions',
  default: [],
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

export const timeAtom = atom({
  key: 'time',
  default: null,
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

export const packetsFeed = selector({
  key: 'packets-feed',
  get: ({ get }) => {
    const packets = get(packetsAtom)
    const filter = get(packetsFilters)
    const [minDate, maxDate] = get(packetsTimeRange)

    return packets
      .slice()
      .reverse()
      .filter((p) => {
        const date = new Date(p.timestamp)
        return date > minDate && date < maxDate
      })
      .filter((p) => {
        return (
          filter.method.length === 0 || filter.method.indexOf(p.method) != -1
        )
      })
      .filter((p) => {
        return filter.host.length === 0 || filter.host.indexOf(p.host) == -1
      })
  },
})

const pastTenSecondsFilter = (p, timestamp) => {
  const timeDiff = moment(timestamp).diff(moment(p.timestamp), 'milliseconds')

  return timeDiff < 15000
}

export const packetOrigins = selector({
  key: 'packet-origins',
  get: ({ get }) => {
    const packets = get(packetsFeed)

    return packets.map(packetOrigin)
  },
})

export const packetTrajectories = selector({
  key: 'packet-trajectories',
  get: ({ get }) => {
    const time = get(timeAtom)
    const packets = get(packetsFeed)

    const trajectoryMap = {}
    const trajectories = packets
      .filter((p) => pastTenSecondsFilter(p, time))
      .map(trajectoryForPacket)

    let uniqueTrajectories = []
    trajectories.forEach((t) => {
      const coords = t.geometry.coordinates
      const key = `${coords[0]}${coords[coords.length - 1]}`
      if (!trajectoryMap[key]) {
        trajectoryMap[key] = true
        uniqueTrajectories.push(t)
      }
    })

    return uniqueTrajectories
  },
})

export const packetsAlongTrajectories = selector({
  key: 'packets-along-trajectories',
  get: ({ get }) => {
    const time = get(timeAtom)
    const packets = get(packetsFeed)

    return packets
      .filter((p) => pastTenSecondsFilter(p, time))
      .map((p) => pointAlongTrajectory(p, time))
  },
})

export const packetTags = selector({
  key: 'packet-tags',
  get: ({ get }) => {
    const packets = get(packetsFeed)
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
      if (acc[curr.host]) {
        acc[curr.host] += 1
      } else {
        acc[curr.host] = 1
      }
      return acc
    }, {})

    const values = tags.map((t) => ({
      value: packetsInTag(t, packetsMap),
      type: t.name,
    }))

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

export const packetsTimeRange = selector({
  key: 'packets-time-range',
  get: ({ get }) => {
    const dates = get(packetValuesForKey('timestamp')).map((t) => new Date(t))
    const { timeRange } = get(packetsFilters)
    const minIndex = Math.round(dates.length * timeRange[0])
    const maxIndex = Math.round(dates.length * timeRange[1])
    const filtered = dates.slice(minIndex, maxIndex)

    const minDate = Math.min(...filtered)
    const maxDate = Math.max(...filtered)

    return [minDate, maxDate]
  },
})

export const packetTimeBuckets = selector({
  key: 'packet-time-buckets',
  get: ({ get }) => {
    const packets = get(packetsAtom)

    const buckets = packets.reduce((acc, curr) => {
      const start = moment(curr.timestamp)
      const remainder = 15 - (start.second() % 15)

      const time = moment(start).add(remainder, 'seconds').format('HH:mm:ss')
      if (!acc[time]) {
        acc[time] = {
          value: 1,
        }
      } else {
        acc[time].value++
      }
      return acc
    }, {})

    return Object.keys(buckets).map((time) => ({
      time,
      value: buckets[time].value,
    }))
  },
})
