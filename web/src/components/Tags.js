import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { packetTags, packetTagsForType } from '../state'
import { Select } from 'antd'
import { Pie } from '@ant-design/charts'
import { Card } from 'antd'
import { useState } from 'react'
import { useCategories } from '../hooks/api'

const Container = styled.div`
  height: 200px;
`

const Tags = () => {
  const categories = useCategories()
  const [type, setType] = useState('Provider')
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
          {categories.map(({ name }) => (
            <Select.Option key={name}>{name}</Select.Option>
          ))}
        </Select>
        <Pie {...config} />
      </Card>
    </Container>
  )
}

export default Tags
