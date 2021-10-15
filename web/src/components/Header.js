import React from 'react'
import styled from 'styled-components'
import LanguageSelect from './LanguageSelect'

const Container = styled.div`
  z-index: 1;
  margin: auto;
  margin-top: 50px;
  width: 90%;
  display: flex;
  justify-content: space-between;

  > h1 {
    margin: 0;
    padding: 0;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 700;
    font-size: 64px;
    color: #fff;
    ${({ small }) => small && `font-size: 32px;`}

    > strong {
      color: #a71d31;
      font-size: 78px;
      ${({ small }) => small && `font-size: 34px;`}
    }
  }
`

const Header = ({ small = false }) => {
  return (
    <Container small={small}>
      <h1>
        <strong>RED</strong> INFRA REVEAL
      </h1>
      <LanguageSelect />
    </Container>
  )
}

export default Header
