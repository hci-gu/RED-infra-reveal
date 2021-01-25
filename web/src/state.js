import { atom, selector } from 'recoil'
import packetsJSON from './packets.json'

export const packetsAtom = atom({
  key: 'packets',
  default: [],
})

export const packetsFeed = selector({
  key: 'packets-feed',
  get: ({ get }) => {
    const packets = get(packetsAtom)

    return packets.slice().reverse()
  },
})
