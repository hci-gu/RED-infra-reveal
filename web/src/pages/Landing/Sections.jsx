import React from 'react'
import styled from 'styled-components'
import { RichText } from 'prismic-reactjs'
import { Text } from '@mantine/core'
import { mobile } from '../../utils/layout'

const SectionsContainer = styled.div`
  padding-top: 24px;
  padding-bottom: 75px;
  min-height: 1000px;

  display: flex;
  flex-direction: column;
`

const Section = styled.div`
  margin: 16px auto;

  a {
    color: #1c7ed6;
  }

  > h1 {
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 42px;
    color: #fff;
  }

  > p,
  > li,
  > ul {
    font-weight: 200;
    font-size: 16px;
    text-align: justify;
  }

  ${mobile()} {
    > h1 {
      font-size: 32px;
      text-align: center;
    }

    > p,
    > li,
    > ul {
      text-align: left;
    }
  }
`

const Sections = ({ sections }) => {
  if (!sections || !sections.length) return null
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

export default Sections
