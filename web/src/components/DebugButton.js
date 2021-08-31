// import { moment } from '@ungap/global-this'
import { Button } from 'antd'
import moment from 'moment'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { mutationAtom, packetsAtom, packetsFilters } from '../state'

const locations = [
  { lat: 47.6348, lon: -122.345 },
  { lat: 52.3824, lon: 4.8995 },
  { lat: 37.751, lon: -97.822 },
  { lat: 22.5333, lon: 114.1333 },
]
const randLocation = () =>
  locations[Math.floor(Math.random() * locations.length)]
const randSession = () => Math.floor(Math.random() * 10)

const createPacket = () => ({
  accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  host: 'www.gu.se',
  id: `${parseInt(Math.random() * 200000)}`,
  ip: '130.241.39.203',
  ...randLocation(),
  method: Math.random() < 0.8 ? 'GET' : 'POST',
  protocol: 'https:',
  session: randSession(),
  timestamp: moment().format('YYYY-MM-DDTHH:mm:ss.SS'),
})

const DebugButton = () => {
  const [, setPackets] = useRecoilState(packetsAtom)
  const filter = useRecoilValue(packetsFilters)
  const mutation = useRecoilValue(mutationAtom)
  const onClick = () => {
    const packets = Array.from({ length: 25 }).map((_, i) => createPacket())

    setPackets((s) => [...s, ...packets])
    // setTimeout(() => {
    //   setLivePackets((packets) => packets.filter((p) => p.id !== packet.id))
    // }, LIVE_PACKET_TIMEOUT * 1000)
  }

  return <Button onClick={onClick}>Debug</Button>
}

export default DebugButton
