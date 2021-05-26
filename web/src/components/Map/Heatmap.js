import { HeatmapLayer } from '@antv/l7-react'
import { useRecoilValue } from 'recoil'
import { packetOrigins } from '../../state'

const Heatmap = () => {
  const features = useRecoilValue(packetOrigins)

  return (
    <HeatmapLayer
      source={{
        data: {
          type: 'FeatureCollection',
          features,
        },
      }}
      shape={{
        values: 'heatmap3d',
      }}
      style={{
        intensity: 0.25,
        radius: 15,
        opacity: 0.75,
        rampColors: {
          colors: [
            '#FF4818',
            '#F7B74A',
            '#FFF598',
            '#91EABC',
            '#2EA9A1',
            '#206C7C',
          ].reverse(),
          positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        },
      }}
    />
  )
}

export default Heatmap
