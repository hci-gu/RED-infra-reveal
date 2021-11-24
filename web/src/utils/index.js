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

export function getColorFromId(id) {
  var hash = 0
  for (var i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 3) - hash)
  }
  var color = Math.abs(hash).toString(16).substring(0, 6)

  return lightenHexColor('#' + '000000'.substring(0, 6 - color.length) + color)
}

export function lightenHexColor(hex) {
  const color = hex.replace('#', '')
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)

  const newColor =
    '#' + ((0.3 * r) | 0) + ((0.3 * g) | 0) + ((0.3 * b) | 0).toString(16)

  return newColor
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
