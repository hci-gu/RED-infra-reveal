import * as turf from '@turf/turf'

const myPos = [11.91737, 57.69226]
const packetPosition = (p) => (p.clientLat ? [p.clientLon, p.clientLat] : myPos)
const positionsForPacket = (p) =>
  p.method !== 'GET'
    ? [packetPosition(p), [p.lon, p.lat]]
    : [[p.lon, p.lat], packetPosition(p)]

function clamp(number, min, max) {
  return Math.floor(Math.max(min, Math.min(number, max)))
}

export const seed = 1
function seededRand() {
  var x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}
const randomizeLocationWithinRadius = (lng, lat, radius = 0.1) => {
  const angle = seededRand() * 2 * Math.PI
  const radiusOffset = seededRand() * radius
  return [
    lng + radiusOffset * Math.cos(angle),
    lat + radiusOffset * Math.sin(angle),
  ]
}

export const packetOrigin = (p) => {
  return {
    type: 'Feature',
    properties: {
      value: 1000,
    },
    geometry: {
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:4326',
        },
      },
      type: 'Point',
      coordinates: randomizeLocationWithinRadius(p.lon, p.lat),
    },
  }
}

export const pointAlongTrajectory = (p, timestamp) => {
  const trajectory = trajectoryForPacket(p)
  const points = trajectory.geometry.coordinates
  const timeDiff = timestamp - new Date(p.timestamp)
  const index = clamp(timeDiff / 100, 0, points.length)

  let type = 'default'
  if (p.accept && p.accept.indexOf('image') > -1) {
    type = 'image'
  } else if (p.accept && p.accept.indexOf('text/html') > -1) {
    type = 'html'
  }

  return {
    type: 'Feature',
    properties: {
      host: p.host,
      method: p.method,
      timestamp: p.timestamp,
      client: p.userId,
      contentLength: p.contentLength,
      type,
    },
    geometry: {
      type: 'Point',
      coordinates: points[index],
    },
  }
}

export const trajectoryForPacket = (p) => {
  const [origin, destination] = positionsForPacket(p)
  return turf.greatCircle(origin, destination, {
    npoints: 75,
  })
}

const isLatitude = (num) => isFinite(num) && Math.abs(num) <= 90
const isLongitude = (num) => isFinite(num) && Math.abs(num) <= 180

export const isValidCoordinate = (p) => {
  if (!p.lat || !p.lon) return false
  const validDestination = isLatitude(p.lat) && isLongitude(p.lon)

  if (p.clientLat) {
    return (
      validDestination && isLatitude(p.clientLat) && isLongitude(p.clientLon)
    )
  }

  return validDestination
}

export const packetIsInFilters = (p, filters) => {
  if (!filters) return true
  if (!isValidCoordinate(p)) return false
  const points = turf.pointsWithinPolygon(
    turf.points([[p.lon, p.lat]]),
    filters.rect
  )
  return points.features.length > 0
}

export const centerOfPositions = (positions) => {
  var features = turf.points(positions.map((p) => [p.lon, p.lat]))

  return turf.center(features)
}

export const bboxForPositions = (positions) => {
  var features = turf.points(positions.map((p) => [p.lon, p.lat]))

  return turf.bbox(features)
}

export const trajectoriesForPackets = (packets) => {
  const trajectoryMap = {}
  const trajectories = packets.map(trajectoryForPacket)

  let uniqueTrajectories = []
  trajectories.forEach((t) => {
    const coords = t.geometry.coordinates
    const key = `${coords[0]}${coords[coords.length - 1]}`
    if (!trajectoryMap[key]) {
      trajectoryMap[key] = true
      uniqueTrajectories.push(t)
    }
  })
  return uniqueTrajectories
}
