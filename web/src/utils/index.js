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

  return '#' + '000000'.substring(0, 6 - color.length) + color
}
