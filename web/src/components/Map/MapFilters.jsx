import React, { useEffect } from 'react'
import { DrawControl } from '@antv/l7-draw'
import { useRecoilState } from 'recoil'
import { mapFiltersAtom } from '../../state/packets'
import { debounce } from '../../utils'

const MapFilters = ({ scene }) => {
  const [, setMapFilters] = useRecoilState(mapFiltersAtom)
  const update = debounce(setMapFilters, 1000)

  useEffect(() => {
    const drawControl = new DrawControl(scene, {
      position: 'topright',
      layout: 'horizontal',
      controls: {
        rect: true,
        delete: true,
      },
    })
    drawControl.on('draw.create', () => {
      setMapFilters(drawControl.getAllData())
    })
    drawControl.on('draw.update', () => {
      update(drawControl.getAllData())
    })
    drawControl.on('draw.delete', () => {
      drawControl.removeAllData()
      update(null)
    })
    scene.addControl(drawControl)

    return () => scene.removeControl(drawControl)
  }, [])

  return null
}

export default MapFilters
