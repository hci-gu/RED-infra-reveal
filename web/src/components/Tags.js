import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { packetTags } from '../state'
import { Pie } from '@ant-design/charts'
import { Card } from 'antd'

const Container = styled.div`
  height: 200px;
`

const Tags = () => {
  const data = useRecoilValue(packetTags)
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.7,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  }

  return (
    <Container>
      <Card>
        <Pie {...config} />
      </Card>
    </Container>
  )
}

export default Tags
