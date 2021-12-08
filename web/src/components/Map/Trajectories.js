import { LineLayer } from '@antv/l7-react'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { mutationAtom } from '../../state/packets'
import { trajectoriesForPackets } from '../../utils/geo'

const Trajectories = () => {
  const [layer, setLayer] = useState()
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
        values: ['#fff'],
      }}
      scale={{
        value: 0.1,
      }}
      size={{
        values: 1,
      }}
      style={{
        opacity: 0.1,
      }}
    />
  )
}

export default Trajectories
