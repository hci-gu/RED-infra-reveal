import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { ReactSVG } from 'react-svg'
import { Button, Carousel, Image } from 'antd'

import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons'

const Container = styled.div`
  margin: 0 auto;
  width: 60%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > div,
  > a {
    margin-top: 50px;
  }

  > a {
    width: 40%;
    > button {
      width: 100%;
    }
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > h1 {
    width: 80%;
    text-align: center;
  }

  > div {
    height: 200px;
  }
  > div > svg {
    height: 100%;
    width: auto;
  }
`

const Guide = styled.div`
  position: relative;
  margin: 0 auto;
  width: 1200px;
  height: 800px;

  > div {
    height: 100%;
    color: #fff;
    height: 600px;
    text-align: center;
  }
  > button {
    position: absolute;
    z-index: 1;

    :nth-child(2) {
      top: 100%;
      right: 50px;
    }
    :nth-child(1) {
      top: 100%;
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

const GuideStep = ({ img, text }) => {
  return (
    <Step>
      <span>{text}</span>
      <Image src={img} width={600} />
    </Step>
  )
}

const MacInstallationGuide = () => {
  const carouselRef = useRef(null)

  return (
    <Guide>
      <Button onClick={() => carouselRef.current.prev()}>
        <LeftOutlined />
      </Button>
      <Button onClick={() => carouselRef.current.next()}>
        <RightOutlined />
      </Button>
      <Carousel dots={{ className: 'carousel-dots' }} ref={carouselRef}>
        <GuideStep
          img="/img/mac-cert-1.jpg"
          text="double click the certificate to open it with keychain"
        />
        <GuideStep
          img="/img/mac-cert-2.jpg"
          text={`Select the certifacte named "NodeMITMProxyCA" and change it to "Always trust"`}
        />
        <GuideStep
          img="/img/mac-cert-3.jpg"
          text="Then open Network settings in System preferences, and select advanced settings"
        />
        <GuideStep
          img="/img/mac-cert-4.jpg"
          text={`Here you can input 161.35.209.9 with port 8888 as your HTTP and HTTPS proxy`}
        />
      </Carousel>
    </Guide>
  )
}

const CertificateDownloader = () => {
  const [clicked, setClicked] = useState(false)

  const onDownloadClick = () => {
    setClicked(true)
  }

  return (
    <Container>
      {clicked ? (
        <Header>
          <MacInstallationGuide />
        </Header>
      ) : (
        <Header>
          <h1>
            To use the proxy you need to download and install a certificate.
          </h1>
          <ReactSVG src="/svg/certificate.svg" />
        </Header>
      )}
      {!clicked && (
        <a href="http://localhost:4000/cert" download target="_self">
          <Button
            onClick={onDownloadClick}
            type="primary"
            size="large"
            shape="round"
            icon={<DownloadOutlined />}
          >
            Download
          </Button>
        </a>
      )}
    </Container>
  )
}

export default CertificateDownloader
