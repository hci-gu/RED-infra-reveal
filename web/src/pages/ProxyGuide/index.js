import React from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import Header from '../../components/Header'
import { useFireWallSettings } from '../../hooks/api'
import { cmsContentAtom } from '../../state'
import Guide from './Guide'
import PlatformSelect, { platformAtom } from './PlatformSelect'
import Steps from './Steps'

const Container = styled.div`
  margin: 40px auto;
  width: 80%;
  display: flex;
  flex-direction: column;

  font-family: 'Josefin Sans';
`

const Intro = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > h2 {
    line-height: 100%;
    width: 480px;
    font-weight: 500;
    font-size: 36px;
    text-align: center;
  }

  > p {
    font-weight: 200;
    font-size: 18px;
    text-align: center;
    width: 480px;
  }
`

const Guides = styled.div`
  margin-top: 80px;
`

const comparePlatform = (guide, platform) => {
  const key = guide.platform.split(' ').join('').toLowerCase()
  return key.indexOf(platform) !== -1
}

const ProxyGuide = () => {
  const content = useRecoilValue(cmsContentAtom)
  console.log(content)
  const platform = useRecoilValue(platformAtom)
  useFireWallSettings()

  if (!content.guides) return null

  return (
    <>
      <Header small />
      <Container>
        <Intro>
          <h2>Connecting to the infra reveal proxy</h2>
          <p>
            This guide will show you how to connect to the infra reveal proxy so
            that you can view your traffic in the dashboard. please read through
            the information below before connecting.
            <br></br>
            <br></br>
            Start by selecting the platform you want to use.
          </p>
          <PlatformSelect />
        </Intro>
        {platform && <Steps />}
        {platform && (
          <Guides>
            {content.guides
              .filter((guide) => comparePlatform(guide, platform))
              .map((guide, i) => (
                <Guide {...guide} key={`Guide_${i}`} />
              ))}
          </Guides>
        )}
      </Container>
    </>
  )
}

export default ProxyGuide
