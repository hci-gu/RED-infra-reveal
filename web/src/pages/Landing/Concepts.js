import React, { useState } from 'react'
import styled from 'styled-components'
import { RichText } from 'prismic-reactjs'
import { useSpring, animated } from 'react-spring'
import { useMeasure } from './useMeasure'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { mobile } from '../../utils/layout'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > h1 {
    font-size: 32px;
  }
`
const ConceptContainer = styled.div`
  > h1 {
    font-family: 'Roboto', sans-serif;
  }
`
const ConceptTitle = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;

  > h1 {
    margin: 0;
    margin-left: 10px;
    font-weight: 600;
  }
`
const ConceptDescription = styled(animated.div)`
  padding: 10px 10px;
  padding-bottom: 0px;
  overflow: hidden;

  > div {
    > p,
    > li,
    > ul {
      font-weight: 200;
      font-size: 16px;
      text-align: justify;
    }
  }

  ${mobile()} {
    > div {
      > p,
      > li,
      > ul {
        text-align: left;
      }
    }
  }
`

const Concept = ({ concept }) => {
  const [isOpen, setOpen] = useState(false)
  const [bind, { height: viewHeight }] = useMeasure()
  const { height } = useSpring({
    from: { height: 0 },
    to: { height: isOpen ? viewHeight + 20 : 0 },
  })

  return (
    <ConceptContainer>
      <ConceptTitle onClick={() => setOpen(!isOpen)}>
        {isOpen ? <MinusOutlined /> : <PlusOutlined />}
        <RichText render={concept.concept_title} />
      </ConceptTitle>
      <ConceptDescription style={{ height }}>
        <div {...bind}>
          <RichText render={concept.concept_description} />
        </div>
      </ConceptDescription>
    </ConceptContainer>
  )
}

const Concepts = ({ concepts, title }) => {
  if (!concepts || !concepts.length) return null

  return (
    <Container>
      <RichText render={title} />
      <div>
        {concepts.map((concept, i) => (
          <Concept key={`Concept_${i}`} concept={concept} />
        ))}
      </div>
    </Container>
  )
}

export default Concepts
