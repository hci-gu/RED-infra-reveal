import React from 'react'
import styled from 'styled-components'
import SessionList from '../../components/SessionList'
import Globe from '../../components/Globe'
import { RichText } from 'prismic-reactjs'
import { useRecoilValue } from 'recoil'
import { cmsContentAtom } from '../../state'
import Header from '../../components/Header'
import Sections from './Sections'
import Concepts from './Concepts'

const Container = styled.div`
  background: none;
`

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const Content = styled.div`
  border-top: 2px solid #a71d31;
  position: relative;
  z-index: 100;
  width: 100%;
  background-color: #0d0d0d;
  padding-bottom: 100px;

  display: flex;
  flex-direction: column;

  > div {
    margin: 0 auto;
    width: 60%;
  }
`

const GlobeContainer = styled.div`
  pointer-events: none;
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
        <div />
        <div style={{ pointerEvents: 'none' }}></div>
        {landing && <SessionList title={landing.sessions_title} />}
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
