import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { packetCategories } from '../state'
import { Pie } from '@ant-design/charts'

const Container = styled.div``

const Categories = () => {
  const data = useRecoilValue(packetCategories)
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  }

  return (
    <Container>
      <Pie {...config} />
    </Container>
  )
}

export default Categories
