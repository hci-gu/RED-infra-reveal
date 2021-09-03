import React from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import LanguageSelect from '../../components/LanguageSelect'
import { cmsContentAtom } from '../../state'
import Guide from './Guide'

const Container = styled.div`
  margin: 0 auto;
  width: 80%;
  display: flex;
  flex-direction: column;
`

const ProxyGuide = () => {
  const content = useRecoilValue(cmsContentAtom)

  if (!content.guides) return null

  return (
    <>
      <Container>
        {content.guides.map((guide, i) => (
          <Guide {...guide} key={`Guide_${i}`} />
        ))}
      </Container>
      <LanguageSelect />
    </>
  )
}

export default ProxyGuide
