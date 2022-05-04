import { atom, selector } from 'recoil'
import { filteredPackets } from './packets'
import moment from 'moment'

export const cmsContentAtom = atom({
  key: 'cms-content',
  default: {},
})

export const languageAtom = atom({
  key: 'language',
  default: 'en-us',
})

export const globeAtom = atom({
  key: 'globe',
  default: {
    autoRotate: true,
    altitude: 3.5,
  },
})

export const sessionsAtom = atom({
  key: 'sessions',
  default: [],
})
export const activeSessionIdAtom = atom({
  key: 'active-session-id',
  default: null,
})

export const settingsAtom = atom({
  key: 'settings',
  default: {
    darkMode: true,
    flipMap: false,
    focusOnMap: false,
  },
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

export const mapToggles = atom({
  key: 'map-toggles',
  default: {
    heatmap: true,
    trajectories: true,
    packets: true,
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
