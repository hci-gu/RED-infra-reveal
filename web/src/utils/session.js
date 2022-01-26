import { bboxForPositions, centerOfPositions } from './geo'

export const calculateSessionPositions = (session) => {
  if (session.clientPositions && session.clientPositions.length) {
    const center = centerOfPositions(session.clientPositions)
    const bbox = bboxForPositions(session.clientPositions)

    return {
      ...session,
      bbox,
      center: {
        lat: center.geometry.coordinates[1],
        lon: center.geometry.coordinates[0],
      },
    }
  }

  return session
}
