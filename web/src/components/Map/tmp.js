import { AMapScene, HeatmapLayer } from '@antv/l7-react'
import React, { useEffect, useState } from 'react'

const Heatmap = () => {
  const [fillData, setFillData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/8990e8b4-c58e-419b-afb9-8ea3daff2dd1.json'
      ).then((d) => d.json())
      console.log(response)
      setFillData(response)
    }

    fetchData()
  }, [])

  if (!fillData) return null

  return (
    <HeatmapLayer
      source={{
        data: fillData,
        transforms: [
          {
            type: 'hexagon',
            size: 200000,
            field: 'capacity',
            method: 'sum',
          },
        ],
      }}
      style={{
        coverage: 0.8,
        angle: 0,
        opacity: 1.0,
      }}
      size={{
        values: 100,
      }}
      shape={{
        values: 'hexagonColumn',
      }}
    />
  )
}

const App = () => {
  return (
    <AMapScene
      map={{
        center: [11.91737, 57.69226],
        pitch: 45,
        // rotation: 180,
        style: 'dark',
        zoom: 2,
        features: ['bg'],
      }}
      option={{
        logoVisible: false,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        // transform: 'scaleY(-1)',
      }}
    >
      <Heatmap />
    </AMapScene>
  )
}

export default App
