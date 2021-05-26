import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import SessionList from '../components/SessionList'
import Globe from '../components/Globe'

const Container = styled.div``

const Header = styled.div`
  margin: auto;
  margin-top: 100px;
  width: 90%;

  > h1 {
    margin: 0;
    padding: 0;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 700;
    font-size: 64px;
    color: #fff;

    > strong {
      color: #a71d31;
      font-size: 78px;
    }
  }
`

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const GlobeContainer = styled.div``

const Landing = () => {
  return (
    <Container>
      <Header>
        <h1>
          <strong>RED</strong> INFRA REVEAL
        </h1>
      </Header>
      <Content>
        <GlobeContainer>
          <Globe />
        </GlobeContainer>
        <SessionList />
      </Content>
    </Container>
  )
}

export default Landing
