import * as turf from '@turf/turf'
import moment from 'moment'

const myPos = [11.91737, 57.69226]
const packetPosition = (p) => (p.clientLat ? [p.clientLon, p.clientLat] : myPos)
const positionsForPacket = (p) =>
  p.method !== 'GET'
    ? [packetPosition(p), [p.lon, p.lat]]
    : [[p.lon, p.lat], packetPosition(p)]

function clamp(number, min, max) {
  return Math.floor(Math.max(min, Math.min(number, max)))
}

export const packetOrigin = (p) => {
  return {
    type: 'Feature',
    geometry: {
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:4326',
        },
      },
      type: 'Point',
      coordinates: [p.lon, p.lat, 0.0],
    },
  }
}

export const pointAlongTrajectory = (p, timestamp) => {
  const trajectory = trajectoryForPacket(p)
  const points = trajectory.geometry.coordinates
  const timeDiff = moment(timestamp).diff(moment(p.timestamp), 'milliseconds')

  const index = clamp(timeDiff / 100, 0, points.length)

  return {
    type: 'Feature',
    properties: {
      host: p.host,
      method: p.method,
      timestamp: p.timestamp,
      client: p.userId,
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
    npoints: 25,
  })
}

const isLatitude = (num) => isFinite(num) && Math.abs(num) <= 90
const isLongitude = (num) => isFinite(num) && Math.abs(num) <= 180

export const isValidCoordinate = (p) => {
  const validDestination = isLatitude(p.lat) && isLongitude(p.lon)

  if (p.clientLat) {
    return (
      validDestination && isLatitude(p.clientLat) && isLongitude(p.clientLon)
    )
  }

  return validDestination
}

export const packetIsInFilters = (p, filters) => {
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
