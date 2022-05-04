import { Space, Title } from '@mantine/core'
import React from 'react'
import styled from 'styled-components'
import { mobile } from '../utils/layout'
import LanguageSelect from './LanguageSelect'

const LogoText = styled.h1`
  margin: 0;
  padding: 0;
  font-family: 'Josefin Sans', sans-serif;
  font-weight: 700;
  font-size: 64px;
  height: 92px;
  ${({ small }) => small && `font-size: 32px;`}

  > strong {
    color: #a71d31;
    font-size: 78px;
    ${({ small }) => small && `font-size: 34px;`}
  }

  ${mobile()} {
    text-align: center;
    height: 36px;
    font-size: 28px;
    margin: 0;

    > strong {
      font-size: 30px;
    }
  }
`

const Container = styled.div`
  z-index: 1;
  margin: auto;
  margin-top: 50px;
  width: 90%;
  display: flex;
  justify-content: space-between;

  ${mobile()} {
    width: 100%;
    padding: 0.5rem;

    display: flex;
    flex-direction: column;
  }
`

export const Logo = ({ small }) => {
  return (
    <Title order={1}>
      <strong style={{ color: '#a71d31' }}>RED</strong> INFRA REVEAL
    </Title>
  )
}

const Header = ({ small = false, hideLogo = false }) => {
  return (
    <Container small={small}>
      {hideLogo ? <div /> : <Logo small={small} />}
      <LanguageSelect />
    </Container>
  )
}

export default Header
