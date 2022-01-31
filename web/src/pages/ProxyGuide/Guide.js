import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, Carousel, Image } from 'antd'

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import BlockContent from '@sanity/block-content-to-react'
import { RichText } from 'prismic-reactjs'

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  width: 1200px;
  height: 800px;

  > div {
    height: 100%;
    color: #fff;
    height: 600px;
    text-align: center;
    font-size: 18px;
  }
  > button {
    position: absolute;
    z-index: 1;

    :nth-child(2) {
      top: 40%;
      right: 50px;
    }
    :nth-child(1) {
      top: 40%;
      left: 50px;
    }
  }
`

const Step = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const GuideStep = ({ img, description }) => {
  return (
    <Step>
      <RichText render={description} />
      <Image src={img} width={600} />
    </Step>
  )
}

const Guide = ({ title, steps }) => {
  const carouselRef = useRef(null)

  return (
    <>
      <RichText render={title} />
      <Container>
        <Button onClick={() => carouselRef.current.prev()}>
          <LeftOutlined />
        </Button>
        <Button onClick={() => carouselRef.current.next()}>
          <RightOutlined />
        </Button>
        <Carousel dots={{ className: 'carousel-dots' }} ref={carouselRef}>
          {steps.map(({ image, text }) =>
            image ? <GuideStep img={image.url} description={text} /> : null
          )}
        </Carousel>
      </Container>
    </>
  )
}

export default Guide
