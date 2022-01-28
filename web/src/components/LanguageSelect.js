import { Select } from 'antd'
import React from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'
import { languageAtom } from '../state'
import { mobile } from '../utils/layout'

const availableLanguages = [
  {
    name: '🇬🇧 English',
    value: 'en-us',
  },
  {
    name: '🇸🇪 Svenska',
    value: 'sv-se',
  },
  {
    name: '🇪🇸 Español',
    value: 'es',
  },
]

const Container = styled.div`
  ${mobile()} {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
`

const LanguageSelect = () => {
  const [language, setLanguage] = useRecoilState(languageAtom)

  return (
    <Container>
      <Select
        style={{ width: 130, fontSize: 15 }}
        size="large"
        defaultValue={language}
        onChange={(val) =>
          setLanguage(
            availableLanguages.find((locale) => locale.value === val).value
          )
        }
      >
        {availableLanguages.map(({ name, value }) => (
          <Select.Option value={value} key={`Locale_${value}`}>
            <span>
              {name.split(' ').map((s, i) => (
                <span style={{ paddingRight: i === 0 ? 10 : 0 }} key={`${s}_i`}>
                  {s}
                </span>
              ))}
            </span>
          </Select.Option>
        ))}
      </Select>
    </Container>
  )
}

export default LanguageSelect
