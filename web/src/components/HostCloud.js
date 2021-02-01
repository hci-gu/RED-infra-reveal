import React from 'react'
import { WordCloud } from '@ant-design/charts'
import { useRecoilValue } from 'recoil'
import { packetsFeed } from '../state'

const HostCloud = () => {
  const packets = useRecoilValue(packetsFeed)
  const hosts = packets.reduce((acc, curr) => {
    if (!acc[curr.host]) {
      acc[curr.host] = {
        value: 1,
      }
    } else {
      acc[curr.host].value++
    }
    return acc
  }, {})

  const config = {
    data: Object.keys(hosts).map((host) => ({
      name: host,
      value: hosts[host].value,
    })),
    wordField: 'name',
    weightField: 'value',
    colorField: 'name',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [6, 40],
      rotation: 0,
    },
    random: () => 0.5,
    padding: 0,
  }
  return <WordCloud {...config} height={200} />
}
export default HostCloud
