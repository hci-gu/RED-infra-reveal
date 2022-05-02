import { RichText } from 'prismic-reactjs'
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
  const { guide } = useRecoilValue(cmsContentAtom)
  const platform = useRecoilValue(platformAtom)
  useFireWallSettings()

  console.log('guide', guide)

  if (!guide) return null

  return (
    <>
      <Header small />
      <Container>
        <Intro>
          <RichText render={guide.title} />
          <RichText render={guide.description} />
          <PlatformSelect placeholder={guide.select_placeholder} />
        </Intro>
        {platform && <Steps />}
        {platform && (
          <Guides>
            {guide.guides
              .map((g) => g.link)
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
