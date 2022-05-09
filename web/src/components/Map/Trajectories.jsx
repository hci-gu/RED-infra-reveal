import React, { useEffect, useState } from 'react'
import { LineLayer } from '@antv/l7-react'
import { useRecoilValue } from 'recoil'
import { mutationAtom } from '../../state/packets'
import { trajectoriesForPackets } from '../../utils/geo'
import { settingsAtom } from '../../state'

const Trajectories = () => {
  const [layer, setLayer] = useState()
  const { darkMode } = useRecoilValue(settingsAtom)
  const mutation = useRecoilValue(mutationAtom)

  useEffect(() => {
    let interval = setInterval(() => {
      layer.setData({
        type: 'FeatureCollection',
        features: trajectoriesForPackets(mutation.recentPackets),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [layer])

  return (
    <LineLayer
      onLayerLoaded={setLayer}
      source={{
        data: {
          type: 'FeatureCollection',
          features: trajectoriesForPackets(mutation.recentPackets),
        },
      }}
      shape={{ values: 'line' }}
      color={{
        values: [darkMode ? '#fff' : '#000'],
      }}
      scale={{
        value: 0.1,
      }}
      size={{
        values: 1,
      }}
      style={{
        opacity: darkMode ? 0.1 : 0.2,
      }}
    />
  )
}

export default Trajectories
