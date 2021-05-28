import React from 'react'
import styled from 'styled-components'
import SessionList from '../components/SessionList'
import Globe from '../components/Globe'

const Container = styled.div``

const Header = styled.div`
  margin: auto;
  margin-top: 50px;
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

const GlobeContainer = styled.div`
  pointer-events: none;
`

const AboutContainer = styled.div`
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

const About = () => {
  return (
    <AboutContainer>
      <h1>
        RECONFIGURATIONS OF EDUCATIONAL IN/EQUALITY IN A DIGITAL WORLD (RED)
      </h1>
      <p>
        Digital data flows are of increasing global relevance, with data privacy
        a fundamental human right. But data’s role in sharpening and/or
        mitigating inequality and fostering global justice is still
        understudied. How is schooling being reconfigured through new
        educational technologies in different regions of the world? In what ways
        are these changes exacerbating, reproducing or creating new forms of
        inequality and/or promoting equality?
      </p>
      <span>
        You can read more about the project <a>here</a>
      </span>
    </AboutContainer>
  )
}

const SectionsContainer = styled.div`
  margin-top: 150px;
  width: 100%;
  height: 1000px;
  background-color: black;
  z-index: 100 !important;
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

const Sections = () => {
  return (
    <SectionsContainer>
      <Section>
        <h1>How does it work?</h1>
        <p>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <a href="/certificate">Setup the proxy</a>
      </Section>
    </SectionsContainer>
  )
}

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
        <About />
        <div style={{ pointerEvents: 'none' }}></div>
        <SessionList />
      </Content>
      <Sections></Sections>
    </Container>
  )
}

export default Landing
