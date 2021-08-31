import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { useQuery, useClient } from 'urql'
import { cmsContentAtom } from '../state'

const API_URL = `${process.env.REACT_APP_SANITY_API_URL}`

const CmsContentQuery = `
query content($id: ID!, $lang: String = "en_GB") {
    allLandingPage(where:{_id: {matches:$id} i18n_lang: { eq: $lang }}) {
      _id
      title
      i18n_lang
    }
}
`

export const useCmsContent = () => {
  const [cmsContent, setCmsContent] = useRecoilState(cmsContentAtom)
  const [result] = useQuery({
    query: CmsContentQuery,
    variables: {
      id: '3674f7ee-021c-4f79-9091-caf74411e6bd',
    },
  })
  console.log(result)

  //   useEffect(() => {
  //     if (!!result.data) {
  //       setCmsContent(result.data)
  //     }
  //   }, [result, setCmsContent])

  return result.data
}
