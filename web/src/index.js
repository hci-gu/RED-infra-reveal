import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { createClient, Provider } from 'urql'
import App from './App'
import 'antd/dist/antd.less'
import { useGuideContent, useLandingPageContent } from './hooks/cmsContent'
import axios from 'axios'

const client = createClient({
  url: `${process.env.REACT_APP_API_URL}/admin/api`,
})

const GetPrismicRef = () => {
  const [prismicRef, setPrismicRef] = useState()

  useEffect(() => {
    const run = async () => {
      const response = await axios.get(
        'https://infra-reveal.cdn.prismic.io/api/v2'
      )
      setPrismicRef(response.data.refs[0].ref)
    }
    run()
  }, [setPrismicRef])

  if (!prismicRef) {
    return null
  }

  const cmsClient = createClient({
    url: 'https://infra-reveal.cdn.prismic.io/graphql',
    preferGetMethod: true,
    fetchOptions: () => {
      return {
        headers: {
          'Prismic-Ref': prismicRef,
          Authorization: `Token ${process.env.REACT_APP_PRISMIC_TOKEN}`,
        },
      }
    },
  })

  return (
    <Provider value={cmsClient}>
      <Router>
        <Route
          path="/proxy-guide"
          component={() => {
            useGuideContent()
            return null
          }}
        />
        <Route
          path="/"
          component={() => {
            useLandingPageContent()
            return null
          }}
        />
      </Router>
    </Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Provider value={client}>
        <App />
      </Provider>
      <GetPrismicRef />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
