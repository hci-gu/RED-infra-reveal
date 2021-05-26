import { LayerEvent, PointLayer } from '@antv/l7-react'
import { useRecoilValue } from 'recoil'
import { packetsAlongTrajectories } from '../../state'
import { getColorFromId } from '../../utils'

const Points = ({ setPopupInfo }) => {
  const features = useRecoilValue(packetsAlongTrajectories)

  const showPopup = (args) => {
    setPopupInfo({
      lnglat: args.lngLat,
      feature: args.feature.properties,
    })
  }

  return (
    <>
      <PointLayer
        source={{
          data: {
            type: 'FeatureCollection',
            features: features.filter((f) => !!f.properties),
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
