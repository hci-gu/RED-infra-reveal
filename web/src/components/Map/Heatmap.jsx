import React, { useEffect, useState } from 'react'
import { HeatmapLayer, LayerEvent, Popup } from '@antv/l7-react'
import { Card, Grid, Space } from '@mantine/core'
import { useRecoilValue } from 'recoil'
import { mutationAtom } from '../../state/packets'
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
    }, 1000)
    return () => clearInterval(interval)
  }, [layer])

  function showPopup(args) {
    if (args.feature && args.feature.properties) {
      const geo = args.feature.properties.rawData[0].geo
      setPopupInfo({
        lnglat: args.lngLat,
        numPackets: args.feature.properties.count,
        geo,
      })
    }
  }

  return (
    <>
      <HeatmapLayer
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
        }}
      >
        <LayerEvent type="mousemove" handler={showPopup} />
      </HeatmapLayer>
      {popupInfo && (
        <Popup lnglat={popupInfo.lnglat} option={{ closeButton: false }}>
          <Card>
            <Grid>
              <Grid.Col>Packets: {popupInfo.numPackets}</Grid.Col>
              {popupInfo.geo.city && (
                <Grid.Col>City: {popupInfo.geo.city}</Grid.Col>
              )}
              {!popupInfo.geo.city && (
                <Grid.Col>Country: {popupInfo.geo.country}</Grid.Col>
              )}
            </Grid>
          </Card>
        </Popup>
      )}
    </>
  )
}

export default Heatmap
