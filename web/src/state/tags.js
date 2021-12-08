import { atom, selectorFamily } from 'recoil'
import { packetsInTag } from '../utils/tag'
import { filteredPackets } from './packets'

export const categoriesAtom = atom({
  key: 'categories',
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

    return tags.filter((t) => t.tagType && t.tagType.name === key)
  },
})

export const packetTagsForType = selectorFamily({
  key: 'packe-tags-for-type',
  get: (type) => ({ get }) => {
    const packets = get(filteredPackets)
    const tags = get(tagsOfType(type))

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
