export const packetsInTag = (tag, packetsMap) => {
  let found = 0
  tag.domains.forEach(({ name }) => {
    if (packetsMap[name]) {
      found += packetsMap[name]
    }
  })

  return found
}
