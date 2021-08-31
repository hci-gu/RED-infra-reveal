import React, { useEffect, useState } from 'react'
import { WordCloud } from '@ant-design/charts'
import { useRecoilValue } from 'recoil'
import { mutationAtom } from '../state'

const hostsFromPackets = (packets) => {
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

  return Object.keys(hosts).map((host) => ({
    name: host,
    value: hosts[host].value,
  }))
}

const HostCloud = () => {
  const [graph, setGraph] = useState()
  const mutation = useRecoilValue(mutationAtom)

  useEffect(() => {
    let interval = setInterval(() => {
      graph.changeData(hostsFromPackets(mutation.packets))
    }, 2000)
    return () => clearInterval(interval)
  }, [graph])

  const config = {
    data: hostsFromPackets(mutation.packets),
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
    animation: true,
  }
  return <WordCloud onReady={setGraph} {...config} height={200} />
}
export default HostCloud
