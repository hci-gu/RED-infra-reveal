import React from 'react'
import styled from 'styled-components'
import SessionList from './SessionList'
import Globe from './Globe'
import BlockContent from '@sanity/block-content-to-react'
import { useRecoilValue } from 'recoil'
import { cmsContentAtom } from '../../state'
import Header from '../../components/Header'

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
  width: 70%;

  > h1 {
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 700;
    font-size: 32px;
  }

  > p {
    font-size: 14px;
  }
`

const About = ({ title, description }) => {
  return (
    <AboutContainer>
      <h1>{title}</h1>
      <BlockContent blocks={description} />
    </AboutContainer>
  )
}

const SectionsContainer = styled.div`
  position: relative;
  margin-top: 50px;
  width: 100%;
  height: 1000px;
  background-color: #0d0d0d;
  z-index: 100;
  border-top: 2px solid #a71d31;
  padding: 32px 64px;

  display: flex;
  flex-direction: column;
`

const Section = styled.div`
  > h1 {
    /* font-family: 'Josefin Sans', sans-serif; */
    font-weight: 700;
    font-size: 48px;
    color: #fff;
  }

  > p {
    width: 40%;
  }
`

const Sections = ({ sections }) => {
  if (!sections || !sections.length) return null
  return (
    <SectionsContainer>
      {sections.map((section) => (
        <Section>
          <h1>{section.title}</h1>
          <BlockContent blocks={section.bodyRaw} />
        </Section>
      ))}
    </SectionsContainer>
  )
}

const Landing = () => {
  const content = useRecoilValue(cmsContentAtom)

  return (
    <Container>
      <Header />
      <Content>
        <GlobeContainer>
          <Globe />
        </GlobeContainer>
        <About
          title={content.mainHeading}
          description={content.descriptionRaw}
        />
        <div style={{ pointerEvents: 'none' }}></div>
        <SessionList title={content.sessionsTitle} />
      </Content>
      <Sections sections={content.sections} />
    </Container>
  )
}

export default Landing
