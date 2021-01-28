import { atom, selector } from 'recoil'
import packetsJSON from './packets.json'

export const sessionsAtom = atom({
  key: 'sessions',
  default: [],
})

export const packetsAtom = atom({
  key: 'packets',
  default: packetsJSON,
})

export const packetsFeed = selector({
  key: 'packets-feed',
  get: ({ get }) => {
    const packets = get(packetsAtom)

    return packets.slice().reverse()
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
