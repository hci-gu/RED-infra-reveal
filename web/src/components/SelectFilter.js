import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { packetsFilters, packetValuesForKey } from '../state/packets'

import { Card, Select } from 'antd'
const { Option } = Select

const SelectFilter = ({ field, exclude = false }) => {
  const [filter, setFilter] = useRecoilState(packetsFilters)
  const values = useRecoilValue(packetValuesForKey(field))

  const onChange = (val) => {
    setFilter({
      ...filter,
      [field]: val,
    })
  }

  return (
    <Card title={`${exclude ? 'Exclude ' : ''}${field}`}>
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        onChange={onChange}
      >
        {values.map((v) => (
          <Option key={v}>{v}</Option>
        ))}
      </Select>
    </Card>
  )
}

export default SelectFilter
