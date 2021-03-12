// import { moment } from '@ungap/global-this'
import { Button } from 'antd'
import moment from 'moment'
import React from 'react'
import { useRecoilState } from 'recoil'
import { LIVE_PACKET_TIMEOUT } from '../constants'
import { packetsAtom } from '../state'

const wigglePacketLocation = (p) => ({
  ...p,
  lat: p.lat + Math.random(),
  lon: p.lon + Math.random(),
})

const DebugButton = () => {
  const [_, setPackets] = useRecoilState(packetsAtom)
  const onClick = () => {
    const packet = {
      accept:
        'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      host: 'www.gu.se',
      id: `${parseInt(Math.random() * 2000)}`,
      ip: '130.241.39.203',
      lat: -122.34500522098567,
      lon: 47.63486403892885,
      method: 'GET',
      protocol: 'https:',
      session: 2,
      timestamp: '2021-03-09T10:38:57.449Z',
      // timestamp: moment().format('YYYY-MM-DDTHH:mm:ss'),
    }

    setPackets((packets) => [...packets, wigglePacketLocation(packet)])
    // setTimeout(() => {
    //   setLivePackets((packets) => packets.filter((p) => p.id !== packet.id))
    // }, LIVE_PACKET_TIMEOUT * 1000)
  }

  return <Button onClick={onClick}>Debug</Button>
}

export default DebugButton
