import { centerOfPositions } from './geo'

export const calculateSessionPositions = (session) => {
  if (session.clientPositions && session.clientPositions.length) {
    const center = centerOfPositions(session.clientPositions)

    console.log(center)
    return {
      ...session,
      center: {
        lat: center.geometry.coordinates[1],
        lon: center.geometry.coordinates[0],
      },
    }
  }

  return session
}
