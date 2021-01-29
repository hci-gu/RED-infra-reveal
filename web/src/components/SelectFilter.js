import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { packetsFilters, packetValuesForKey } from '../state'

import { Card, Select } from 'antd'
const { Option } = Select

const Container = styled.div``

const SelectFilter = ({ field }) => {
  const [filter, setFilter] = useRecoilState(packetsFilters)
  const values = useRecoilValue(packetValuesForKey(field))

  const onChange = (val) => {
    setFilter({
      ...filter,
      [field]: val,
    })
  }

  return (
    <Card title={field}>
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
