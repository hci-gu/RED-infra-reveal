import { HeatmapLayer, LayerEvent, Popup } from '@antv/l7-react'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { mutationAtom } from '../../state'
import { getPacketsInFilters } from '../../utils'
import { packetOrigin } from '../../utils/geo'

const Heatmap = () => {
  const [layer, setLayer] = useState()
  const [popupInfo, setPopupInfo] = useState()
  const mutation = useRecoilValue(mutationAtom)

  useEffect(() => {
    if (!layer) return
    let interval = setInterval(() => {
      layer.setData({
        type: 'FeatureCollection',
        features: mutation.packets.map(packetOrigin),
      })
    }, 2500)
    return () => clearInterval(interval)
  }, [layer])

  function showPopup(args) {
    console.log(args)
    if (args.feature && args.feature.properties) {
      setPopupInfo({
        lnglat: args.lngLat,
        numPackets: args.feature.properties.count,
      })
    }
  }

  return (
    <>
      <HeatmapLayer
        select={(a, b, c) => {
          console.log('select', a, b, c)
        }}
        onLayerLoaded={setLayer}
        source={{
          data: {
            type: 'FeatureCollection',
            features: mutation.packets.map(packetOrigin),
          },
          transforms: [
            {
              type: 'hexagon',
              size: 175000,
              field: 'value',
              method: 'sum',
            },
          ],
        }}
        size={{
          field: 'sum',
          values: (sum) => {
            return 500000 + sum * 100000
          },
        }}
        color={{
          field: 'sum',
          values: (sum) => {
            return sum > 50000
              ? '#732200'
              : sum > 5000
              ? '#CC3D00'
              : sum > 1000
              ? '#FF6619'
              : sum > 500
              ? '#FF9466'
              : sum > 50
              ? '#FFC1A6'
              : sum > 10
              ? '#FCE2D7'
              : 'rgb(255,255,255)'
          },
        }}
        shape={{
          values: 'hexagonColumn',
        }}
        style={{
          coverage: 0.8,
          angle: 0,
          opacity: 1.0,
          // intensity: 0.25,
          // radius: 15,
          // opacity: 0.75,
          // rampColors: {
          //   colors: [
          //     '#FF4818',
          //     '#F7B74A',
          //     '#FFF598',
          //     '#91EABC',
          //     '#2EA9A1',
          //     '#206C7C',
          //   ].reverse(),
          //   positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          // },
        }}
      >
        <LayerEvent type="mousemove" handler={showPopup} />
      </HeatmapLayer>
      {popupInfo && (
        <Popup lnglat={popupInfo.lnglat}>
          <span style={{ color: '#000', fontWeight: 600, fontSize: 16 }}>
            Packets: {popupInfo.numPackets}
          </span>
        </Popup>
      )}
    </>
  )
}

export default Heatmap
