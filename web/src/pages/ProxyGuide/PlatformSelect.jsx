import { Select } from '@mantine/core'
import React from 'react'
import { atom, useRecoilState } from 'recoil'
import styled from 'styled-components'

export const platformAtom = new atom({
  key: 'guide-platform',
  default: null,
})

const platforms = [
  {
    label: 'Mac / OS X',
    value: 'mac',
  },
  {
    label: 'PC / Windows',
    value: 'windows',
  },
  {
    label: 'Firefox',
    value: 'firefox',
  },
]

const Container = styled.div``

const PlatformSelect = ({ placeholder }) => {
  const [platform, setPlatform] = useRecoilState(platformAtom)

  return (
    <Container>
      <Select
        placeholder={placeholder}
        value={platform}
        onChange={(val) =>
          setPlatform(
            platforms.find((platform) => platform.value === val).value
          )
        }
        data={platforms}
      />
    </Container>
  )
}

export default PlatformSelect
