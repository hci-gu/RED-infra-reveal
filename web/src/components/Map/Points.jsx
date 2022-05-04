import React, { useEffect, useState } from 'react'
import { LayerEvent, PointLayer } from '@antv/l7-react'
import { useRecoilValue } from 'recoil'
import { mutationAtom } from '../../state/packets'
import { getColorFromId } from '../../utils'
import { pointAlongTrajectory } from '../../utils/geo'

const Points = ({ setPopupInfo }) => {
  const [layer, setLayer] = useState()
  const mutation = useRecoilValue(mutationAtom)

  const showPopup = (args) => {
    setPopupInfo({
      lnglat: args.lngLat,
      feature: args.feature.properties,
    })
  }

  useEffect(() => {
    let interval = setInterval(() => {
      layer.setData({
        type: 'FeatureCollection',
        features: mutation.recentPackets.map((p) =>
          pointAlongTrajectory(p, mutation.time)
        ),
      })
    }, 50)
    return () => clearInterval(interval)
  }, [layer])

  return (
    <>
      <PointLayer
        onLayerLoaded={setLayer}
        source={{
          data: {
            type: 'FeatureCollection',
            features: mutation.recentPackets.map((p) =>
              pointAlongTrajectory(p, mutation.time)
            ),
          },
        }}
        shape={{
          values: 'dot',
        }}
        color={{
          field: 'client',
          values: (arg) => {
            if (arg) {
              return getColorFromId(arg)
            }
            return '#F7B74A'
          },
        }}
        size={{
          values: 2,
        }}
        style={{
          values: {
            opacity: 0.75,
          },
        }}
      >
        <LayerEvent type="mousedown" handler={showPopup}></LayerEvent>
      </PointLayer>
    </>
  )
}

export default Points
