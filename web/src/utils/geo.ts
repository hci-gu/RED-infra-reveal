const myPos = [11.91737, 57.69226]
const packetPosition = (p) => (p.clientLat ? [p.clientLon, p.clientLat] : myPos)
export const positionsForPacket = (p) =>
  p.method !== 'GET'
    ? [packetPosition(p), [p.lon, p.lat]]
    : [[p.lon, p.lat], packetPosition(p)]
