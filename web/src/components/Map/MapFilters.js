const { useEffect } = require('react')
import { DrawControl } from '@antv/l7-draw'
import { useRecoilState } from 'recoil'
import { mapFiltersAtom } from '../../state'

const MapFilters = ({ scene }) => {
  const [mapFilters, setMapFilters] = useRecoilState(mapFiltersAtom)

  useEffect(() => {
    const drawControl = new DrawControl(scene, {
      position: 'topright',
      layout: 'horizontal',
      controls: {
        rect: true,
        delete: true,
      },
    })
    drawControl.on('draw.create', () => setMapFilters(drawControl.getAllData()))
    drawControl.on('draw.update', () => setMapFilters(drawControl.getAllData()))
    drawControl.on('draw.delete', (obj) => {
      drawControl.removeAllData()
      setMapFilters(null)
    })
    scene.addControl(drawControl)
  }, [])

  return null
}

export default MapFilters
