import axios from 'axios'

const { REACT_APP_API_URL } = process.env

export const getSessions = async () => {
  const response = await axios.get(`${REACT_APP_API_URL}/sessions`)

  return response.data
}

export const getPacketsForSession = async (sessionId) => {
  const response = await axios.get(
    `${REACT_APP_API_URL}/session/${sessionId}/packets`
  )
  return response.data
}

export const createSession = async () => {
  const response = await axios.post(`${REACT_APP_API_URL}/session`, {})

  return response.data
}
