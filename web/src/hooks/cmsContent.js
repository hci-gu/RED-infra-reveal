import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useQuery } from 'urql'
import { cmsContentAtom, languageAtom } from '../state'

const LandingPageQuery = `
query content($language: String = "en-us") {
    allPagecontents(lang: $language) {
      edges {
        node {
          _meta {
            id
          }
          title
          description
          sessions_title
          sections {
            section_title
            text
          }
        }
      }
    }
}
`

const GuideQuery = `
query content($language: String = "en-us") {
  allGuide_pages(lang: $language) {
    edges {
      node {
        _meta {
          id
        }
        title
        description
        select_placeholder
        guides {
            link {
              ... on Guide {
                title
                platform
                steps {
                  text
                  image
                }
              }
            }
          }
      }
    }
  }
}

`

export const useLandingPageContent = () => {
  const [, setCmsContent] = useRecoilState(cmsContentAtom)
  const language = useRecoilValue(languageAtom)
  const [result] = useQuery({
    query: LandingPageQuery,
    variables: {
      language,
    },
  })

  if (result.data) console.log(result.data.allPagecontents.edges)
  useEffect(() => {
    if (
      !!result.data &&
      result.data.allPagecontents &&
      result.data.allPagecontents.edges.length
    ) {
      setCmsContent(s => ({ ...s, landing: result.data.allPagecontents.edges[0].node }))
    }
  }, [result, setCmsContent])

  return result.data
}

export const useGuideContent = () => {
  const [, setCmsContent] = useRecoilState(cmsContentAtom)
  const language = useRecoilValue(languageAtom)
  const [result] = useQuery({
    query: GuideQuery,
    variables: {
      language
    }
  })

  useEffect(() => {
    if (
      !!result.data &&
      result.data.allLandingPage &&
      result.data.allLandingPage.length
    ) {
      setCmsContent(s => ({ ...s, landing: result.data.allLandingPage[0] }))
    }
  }, [result, setCmsContent])

  return result.data
}