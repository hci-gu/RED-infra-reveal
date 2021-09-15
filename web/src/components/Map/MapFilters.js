const { useEffect } = require('react')
import { DrawControl } from '@antv/l7-draw'
import { useRecoilValue } from 'recoil'
import { mutationAtom } from '../../state'

const MapFilters = ({ scene }) => {
  const mutation = useRecoilValue(mutationAtom)

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
      mutation.filters = drawControl.getAllData()
    })
    drawControl.on('draw.update', () => {
      mutation.filters = drawControl.getAllData()
    })
    drawControl.on('draw.delete', () => {
      mutation.filters = null
      drawControl.removeAllData()
    })
    scene.addControl(drawControl)

    return () => scene.removeControl(drawControl)
  }, [])

  return null
}

export default MapFilters
