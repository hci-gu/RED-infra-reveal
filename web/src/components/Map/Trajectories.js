import { LineLayer } from '@antv/l7-react'
import { useRecoilValue } from 'recoil'
import { packetTrajectories } from '../../state'

const Trajectories = () => {
  const features = useRecoilValue(packetTrajectories)

  return (
    <LineLayer
      source={{
        data: {
          type: 'FeatureCollection',
          features,
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
