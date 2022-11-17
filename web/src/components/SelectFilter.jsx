import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { packetsFilters, packetValuesForKey } from '../state/packets'
import { MultiSelect } from '@mantine/core'
import { tagsAtom } from '../state/tags'

export const TagFilter = () => {
  const [filter, setFilter] = useRecoilState(packetsFilters)
  const tags = useRecoilValue(tagsAtom)

  const onChange = (val) => {
    setFilter({
      ...filter,
      tags: val,
    })
  }

  return (
    <MultiSelect
      searchable
      mode="multiple"
      style={{ width: '100%' }}
      onChange={onChange}
      placeholder="Tags"
      data={tags.map((tag) => ({ value: tag, label: tag.name }))}
    />
  )
}

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
    <MultiSelect
      searchable
      mode="multiple"
      style={{ width: '100%' }}
      onChange={onChange}
      placeholder={field}
      data={values.map((value) => ({ value, label: value }))}
    />
  )
}

export default SelectFilter
