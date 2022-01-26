import React from 'react'
import styled from 'styled-components'
import SessionList from '../components/SessionList'
import Globe from '../components/Globe'
import { RichText } from 'prismic-reactjs'
import { useRecoilValue } from 'recoil'
import { cmsContentAtom } from '../state'
import Header, { Logo } from '../components/Header'

const Container = styled.div`
  background: none;
`

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

const SectionsContainer = styled.div`
  position: relative;
  margin-top: 50px;
  width: 100%;
  min-height: 1000px;
  background-color: #0d0d0d;
  z-index: 100;
  border-top: 2px solid #a71d31;

  display: flex;
  flex-direction: column;
`

const Section = styled.div`
  margin: 16px auto;
  width: 70%;

  > h1 {
    font-weight: 700;
    font-size: 48px;
    color: #fff;
  }

  > p {
    font-size: 14px;
  }
`

const Sections = ({ sections }) => {
  if (!sections || !sections.length) return null
  console.log(sections)
  return (
    <SectionsContainer>
      {sections.map((section, i) => (
        <Section key={`Section_${i}`}>
          <RichText render={section.section_title} />
          <RichText render={section.text} />
        </Section>
      ))}
    </SectionsContainer>
  )
}

const Landing = () => {
  const { landing } = useRecoilValue(cmsContentAtom)
  if (!landing) {
    return <div>Loading...</div>
  }

  return (
    <Container>
      <Header />
      <About title={landing.title} description={landing.description} />
      <Content>
        <GlobeContainer>
          <Globe />
        </GlobeContainer>
        <div></div>
        {/* <About title={landing.title} description={landing.description} /> */}
        <div style={{ pointerEvents: 'none' }}></div>
        <SessionList title={landing.sessions_title} />
      </Content>
      <Sections sections={landing.sections} />
    </Container>
  )
}

export default Landing
