import React, { useState } from 'react'
import styled from 'styled-components'
import { RichText } from 'prismic-reactjs'
import { Pagination, Image } from '@mantine/core'

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  width: 1200px;
  height: 800px;

  > div {
    height: 100%;
    color: #fff;
    text-align: center;
    font-size: 18px;
  }
`

const Step = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > p {
    height: 125px;
  }
`

const GuideStep = ({ img, description, children }) => {
  return (
    <Step>
      <p>
        <RichText render={description} />
      </p>
      <Image src={img} radius="md" height={400} fit="contain" />
      <br></br>
      {children}
    </Step>
  )
}

const Guide = ({ title, steps }) => {
  const [page, setPage] = useState(1)
  return (
    <>
      <RichText render={title} />
      <Container>
        {steps[page - 1] && (
          <GuideStep
            img={steps[page - 1].image && steps[page - 1].image.url}
            description={steps[page - 1].text}
          >
            <Pagination total={steps.length} onChange={setPage} />
          </GuideStep>
        )}
      </Container>
    </>
  )
}

export default Guide
