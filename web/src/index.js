import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { createClient, Provider } from 'urql'
import App from './App'
import 'antd/dist/antd.less'
import { useCmsContent } from './hooks/cmsContent'

const client = createClient({
  url: `${process.env.REACT_APP_API_URL}/admin/api`,
})
const cmsClient = createClient({
  url: process.env.REACT_APP_SANITY_API_URL,
  fetchOptions: () => {
    return {
      headers: {
        authorization: `Bearer ${process.env.REACT_APP_SANITY_TOKEN}`,
      },
    }
  },
})

const FetchData = () => {
  useCmsContent()
  return null
}

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Provider value={client}>
        <App />
      </Provider>
      <Provider value={cmsClient}>
        <FetchData type="cms" />
      </Provider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
