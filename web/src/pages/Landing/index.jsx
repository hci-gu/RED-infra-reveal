import React from 'react'
import styled from 'styled-components'
import SessionList from './SessionList'
import Globe from './Globe'
import { RichText } from 'prismic-reactjs'
import { useRecoilValue } from 'recoil'
import { cmsContentAtom } from '../../state'
import Header from '../../components/Header'
import Sections from './Sections'
import Concepts from './Concepts'
import { mobile } from '../../utils/layout'

const Container = styled.div`
  background: none;
`

const TopSection = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  ${mobile()} {
    grid-template-columns: 1fr;
  }
  overflow: hidden;
`

const Content = styled.div`
  border-top: 2px solid #a71d31;
  position: relative;
  z-index: 100;
  width: 100%;
  min-height: 50vh;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  > div {
    margin: 0 auto;
    width: 60%;
  }
  ${mobile()} {
    > div {
      width: 90%;
    }
  }
`

const GlobeContainer = styled.div`
  pointer-events: none;
  ${mobile()} {
    display: none;
  }
`

const AboutContainer = styled.div`
  z-index: 2;
  width: 90%;
  margin: 0 auto;
  > h1 {
    margin: 0 8px;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 200;
    font-size: 24px;
  }
  > p {
    font-size: 14px;
  }
  ${mobile()} {
    > h1 {
      margin: 0;
      font-size: 16px;
      text-align: center;
    }
  }
`

const About = ({ title, description }) => {
  return (
    <AboutContainer>
      <RichText render={title} />
    </AboutContainer>
  )
}

const Landing = () => {
  const { landing } = useRecoilValue(cmsContentAtom)

  return (
    <Container>
      <Header />
      {landing && (
        <About title={landing.title} description={landing.description} />
      )}
      <TopSection>
        <GlobeContainer>
          <Globe />
        </GlobeContainer>
        <GlobeContainer />
        <GlobeContainer />
        <SessionList title={landing ? landing.sessions_title : ''} />
      </TopSection>
      <Content>
        {landing && <Sections sections={landing.sections} />}
        {landing && (
          <Concepts
            title={landing.concepts_header}
            concepts={landing.concepts}
          />
        )}
      </Content>
    </Container>
  )
}

export default Landing
