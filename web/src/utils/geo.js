import * as turf from '@turf/turf'
import moment from 'moment'

const myPos = [11.91737, 57.69226]
const positionsForPacket = (p, date) =>
  p.method !== 'GET' ? [myPos, [p.lat, p.lon]] : [[p.lat, p.lon], myPos]

function clamp(number, min, max) {
  return Math.floor(Math.max(min, Math.min(number, max)))
}

export const packetOrigin = (p) => {
  return {
    type: 'Feature',
    properties: {
      mag: 1.0,
    },
    geometry: {
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:4326',
        },
      },
      type: 'Point',
      coordinates: [p.lat, p.lon],
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
    geometry: {
      type: 'Point',
      coordinates: points[index],
    },
  }
}

export const trajectoryForPacket = (p) => {
  const [origin, destination] = positionsForPacket(p)
  const route = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [origin, destination],
    },
  }
  var lineDistance = turf.length(route)
  let arc = []
  const steps = 50
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route, i)
    arc.push(segment.geometry.coordinates)
  }
  route.geometry.coordinates = arc

  return route
}
