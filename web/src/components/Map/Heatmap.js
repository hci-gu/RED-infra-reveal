import { HeatmapLayer } from '@antv/l7-react'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { mutationAtom } from '../../state'
import { getPacketsInFilters } from '../../utils'
import { packetOrigin } from '../../utils/geo'

const Heatmap = () => {
  const [layer, setLayer] = useState()
  const mutation = useRecoilValue(mutationAtom)

  useEffect(() => {
    let interval = setInterval(() => {
      layer.setData({
        type: 'FeatureCollection',
        features: mutation.packets.map(packetOrigin),
      })
    }, 2500)
    return () => clearInterval(interval)
  }, [layer])

  return (
    <HeatmapLayer
      onLayerLoaded={setLayer}
      source={{
        data: {
          type: 'FeatureCollection',
          features: mutation.packets.map(packetOrigin),
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
