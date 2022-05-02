import React from 'react'
import styled from 'styled-components'
import { ReactSVG } from 'react-svg'
import { Button } from 'antd'
import Firewall from './Firewall'
import { DownOutlined } from '@ant-design/icons'
import { useRecoilValue } from 'recoil'
import { platformAtom } from './PlatformSelect'

const Container = styled.div``

const Step = styled.div`
  margin-top: 80px;
  display: flex;
  justify-content: space-between;
  > div {
    width: 500px;
  }
  > div > div {
    display: flex;
    align-items: center;

    > h2 {
      margin: 0;
      margin-left: 1rem;
      font-size: 28px;
    }
  }
  > div {
    > p {
      font-weight: 200;
      font-size: 18px;
    }
  }
`

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  text-align: center;

  > button {
    width: 50%;
  }
`

const DownloadCertButton = () => {
  const platform = useRecoilValue(platformAtom)

  const certName =
    platform === 'firefox'
      ? 'infrareveal-firefox-ca-cert.pem'
      : 'infrareveal-ca-cert.pem'

  return (
    <StepContent>
      <span>{certName}</span>
      <Button
        style={{ fontSize: 16 }}
        size="large"
        onClick={() => {
          location.href = `/cert/${certName}`
        }}
      >
        Download
      </Button>
    </StepContent>
  )
}

const Steps = () => {
  return (
    <Container>
      <Step>
        <div>
          <div>
            <ReactSVG src="/svg/certificate_icon.svg" />
            <h2>1. Download the Certificate</h2>
          </div>
          <p>
            Download the certificate to allow secure traffic to be proxied using
            the button. Once downloaded double click the file to install it.
          </p>
        </div>
        <DownloadCertButton />
      </Step>
      <Step>
        <div>
          <div>
            <ReactSVG src="/svg/firewall_icon.svg" />
            <h2>2. Add yourself to the firewall</h2>
          </div>
          <p>
            Add yourself the allow-list of the firewell, once you are done using
            the tool you can come back here and remove yourself.
          </p>
        </div>
        <div>
          <Firewall />
        </div>
      </Step>
      <Step>
        <div>
          <div>
            <ReactSVG src="/svg/network_icon.svg" />
            <h2>3. Update your network settings</h2>
          </div>
          <p>
            Follow one of the guides below for your operating system to see how
            to connect your dervice to the proxy.
          </p>
        </div>
        <StepContent>
          <span>
            Scroll down and follow the guide for your device <br></br>
            <DownOutlined style={{ fontSize: 36 }} />
          </span>
        </StepContent>
      </Step>
    </Container>
  )
}

export default Steps
