import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { packetTagsForType } from '../state/tags'
import { Pie } from '@ant-design/charts'
import { Card, Center, Select } from '@mantine/core'
import { useCategories } from '../hooks/api'

const PieContainer = styled.div`
  max-width: 300px;
  height: 300px;
`

const Tags = () => {
  const categories = useCategories()
  const [type, setType] = useState('Provider')
  const data = useRecoilValue(packetTagsForType(type))

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
    <Card shadow="sm">
      <Select
        value={type}
        onChange={(value) => setType(value)}
        data={categories.map(({ name }) => ({
          value: name,
          label: name,
        }))}
      />
      <Center p={0}>
        <PieContainer>
          <Pie {...config} />
        </PieContainer>
      </Center>
    </Card>
  )
}

export default Tags
