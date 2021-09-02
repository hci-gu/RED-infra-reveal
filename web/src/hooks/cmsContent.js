import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useQuery } from 'urql'
import { cmsContentAtom, languageAtom } from '../state'

const CmsContentQuery = `
query content($id: ID!, $language: String = "en") {
  allLandingPage(where:{_id: {matches:$id} i18n_lang: { eq: $language }}) {
    _id
    title
    mainHeading
    descriptionRaw
    sessionsTitle
    sections {
      title
      bodyRaw
    }
  }
}
`

export const useCmsContent = () => {
  const [, setCmsContent] = useRecoilState(cmsContentAtom)
  const language = useRecoilValue(languageAtom)
  const [result] = useQuery({
    query: CmsContentQuery,
    variables: {
      id: 'ca4e0c06-8e2b-4a11-b1fd-206e290f9cfa',
      language,
    },
  })

  useEffect(() => {
    if (
      !!result.data &&
      result.data.allLandingPage &&
      result.data.allLandingPage.length
    ) {
      console.log(result.data.allLandingPage[0])
      setCmsContent(result.data.allLandingPage[0])
    }
  }, [result, setCmsContent])

  return result.data
}
