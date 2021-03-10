import { atom, selector, selectorFamily } from 'recoil'
import {
  packetOrigin,
  pointAlongTrajectory,
  trajectoryForPacket,
} from './utils/geo'
import moment from 'moment'

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

export const timeAtom = atom({
  key: 'time',
  default: null,
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

    // TODO: filter out unique points, dont draw multiple lines on top of eachother
    return packets
      .filter((p) => pastTenSecondsFilter(p, time))
      .map(trajectoryForPacket)
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

export const packetCategories = selector({
  key: 'packet-categories',
  get: ({ get }) => {
    const packets = get(packetsAtom)

    return [
      {
        type: 'yes',
        value: 27,
      },
      {
        type: 'no',
        value: 100 - 27,
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
