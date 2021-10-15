import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { packetTags, packetTagsForType } from '../state'
import { Select } from 'antd'
import { Pie } from '@ant-design/charts'
import { Card } from 'antd'
import { useState } from 'react'

const Container = styled.div`
  height: 200px;
`

const values = ['provider', 'function']
const Tags = () => {
  const [type, setType] = useState(values[0])
  const data = useRecoilValue(packetTagsForType(type))
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
        <Select
          style={{ width: '100%' }}
          value={type}
          onChange={(value) => setType(value)}
        >
          {values.map((v) => (
            <Select.Option key={v}>{v}</Select.Option>
          ))}
        </Select>
        <Pie {...config} />
      </Card>
    </Container>
  )
}

export default Tags
