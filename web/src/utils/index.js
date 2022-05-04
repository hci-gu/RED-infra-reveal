import { packetIsInFilters } from './geo'

export function debounce(func, wait, immediate) {
  let timeout

  return function executedFunction() {
    const context = this
    const args = arguments

    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randomColor = () => {
  return `#${randomInt(0, 255).toString(16)}${randomInt(0, 255).toString(
    16
  )}${randomInt(0, 255).toString(16)}`
}

let idMap = {}
export function getColorFromId(id) {
  if (!idMap[id]) {
    idMap[id] = randomColor()
  }
  return idMap[id]
}

export function applyFiltersToPackets(packets, filter) {
  return packets
    .slice()
    .reverse()
    .filter((p) => {
      return filter.method.length === 0 || filter.method.indexOf(p.method) != -1
    })
    .filter((p) => {
      return filter.host.length === 0 || filter.host.indexOf(p.host) == -1
    })
}

// return `X Gb, Y Mb, Z Kb` from bytes
export function displayBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1048576) {
    return `${(bytes / 1024).toFixed(2)} Kb`
  } else if (bytes < 1073741824) {
    return `${(bytes / 1048576).toFixed(2)} Mb`
  } else {
    return `${(bytes / 1073741824).toFixed(2)} Gb`
  }
}
