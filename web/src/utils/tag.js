export const packetsInTag = (tag, packetsMap) => {
  let found = 0
  tag.domains.forEach(({ name }) => {
    if (packetsMap[name]) {
      found += packetsMap[name]
    }
  })
  tag.domainFilters.forEach(({ name }) => {
    Object.keys(packetsMap).forEach((key) => {
      if (key.indexOf(name.replace('*.', '')) !== -1) {
        found += packetsMap[key]
      }
    })
  })

  return found
}
