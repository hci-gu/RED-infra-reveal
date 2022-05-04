import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { packetsFilters, packetValuesForKey } from '../state/packets'
import { MultiSelect } from '@mantine/core'

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
    <MultiSelect
      mode="multiple"
      style={{ width: '100%' }}
      onChange={onChange}
      placeholder={field}
      data={values.map((value) => ({ value, label: value }))}
    />
  )
}

export default SelectFilter
