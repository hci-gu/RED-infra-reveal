import { Select } from 'antd'
import React from 'react'
import { atom, useRecoilState } from 'recoil'
import styled from 'styled-components'

export const platformAtom = new atom({
  key: 'guide-platform',
  default: null,
})

const platforms = [
  {
    name: 'Mac / OS X',
    value: 'mac',
  },
  {
    name: 'PC / Windows',
    value: 'windows',
  },
  {
    name: 'Firefox',
    value: 'firefox',
  },
]

const Container = styled.div``

const PlatformSelect = ({ placeholder }) => {
  const [platform, setPlatform] = useRecoilState(platformAtom)

  return (
    <Container>
      <Select
        style={{ width: 200, fontSize: 16 }}
        size="large"
        placeholder={placeholder}
        defaultValue={platform}
        onChange={(val) =>
          setPlatform(
            platforms.find((platform) => platform.value === val).value
          )
        }
      >
        {platforms.map(({ name, value }) => (
          <Select.Option value={value} key={`Platform_${value}`}>
            <span>{name}</span>
          </Select.Option>
        ))}
      </Select>
    </Container>
  )
}

export default PlatformSelect
