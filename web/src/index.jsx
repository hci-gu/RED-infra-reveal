import React, { useEffect, useState } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { createClient, Provider } from 'urql'

import App from './App'
import { useGuideContent, useLandingPageContent } from './hooks/cmsContent'
import axios from 'axios'
import { Global, MantineProvider } from '@mantine/core'
import { settingsAtom } from './state'

const client = createClient({
  url: `${import.meta.env.VITE_API_URL}`,
})

const FetchGuideContent = () => {
  useGuideContent()
  return null
}

const FetchLandingContent = () => {
  useLandingPageContent()
  return null
}

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
          Authorization: `Token ${import.meta.env.VITE_PRISMIC_TOKEN}`,
        },
      }
    },
  })

  return (
    <Provider value={cmsClient}>
      <Router>
        <Routes>
          <Route path="/proxy-guide" element={<FetchGuideContent />} />
          <Route path="/" element={<FetchLandingContent />} />
        </Routes>
      </Router>
    </Provider>
  )
}

const AppWithTheme = () => {
  const { darkMode } = useRecoilValue(settingsAtom)
  return (
    <MantineProvider
      theme={{
        colorScheme: darkMode ? 'dark' : 'light',
        fontFamily: 'Josefin Sans',
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Global
        styles={(theme) => ({
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },

          body: {
            backgroundColor:
              theme.colorScheme === 'dark' ? '#0d0d0d' : '#FBFBFB',
          },
        })}
      />
      <App />
    </MantineProvider>
  )
}

const root = ReactDOMClient.createRoot(document.getElementById('root'))
root.render(
  <RecoilRoot>
    <Provider value={client}>
      <AppWithTheme />
    </Provider>
    <GetPrismicRef />
  </RecoilRoot>
)
