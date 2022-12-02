import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useMutation, useQuery } from 'urql'
import { sessionsAtom } from '../state'
import { packetsAtom } from '../state/packets'
import { categoriesAtom, tagsAtom } from '../state/tags'
import { calculateSessionPositions } from '../utils/session'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

const SessionQuery = `
{
  sessions {
    id
    name
    start
    end
  }
}
`

export const useSessions = () => {
  const [sessions, setSessions] = useRecoilState(sessionsAtom)
  const [result] = useQuery({
    query: SessionQuery,
  })

  useEffect(() => {
    if (!!result.data) {
      setSessions(result.data.sessions.map(calculateSessionPositions).reverse())
    }
  }, [result, setSessions])

  return sessions
}

export const createSession = () => {}

const PacketQuery = `
query getPackets($where: PacketWhereInput!) {
  packets(where: $where) {
    id
    timestamp
    ip
    host
    protocol
    method
    accept
    lat
    lon
    country
    region
    city
    userId
    clientLat
    clientLon
    contentLength
    responseTime
  }
}
`

export const usePackets = (sessionId) => {
  if (sessionId === 'simulate') {
    return []
  }
  const [packets, setPackets] = useRecoilState(packetsAtom)
  const [result] = useQuery({
    query: PacketQuery,
    variables: {
      where: { session: { id: { equals: sessionId } } },
    },
  })
  const { data } = result

  useEffect(() => {
    if (!!data) {
      setPackets(data.packets)
    }
  }, [data, setPackets])

  return packets
}

const TagsQuery = `
query getTags {
  tags {
    id
    name
    category {
      name
    }
    domains
  }
}
`

export const useTags = () => {
  const [tags, setTags] = useRecoilState(tagsAtom)
  const [result] = useQuery({
    query: TagsQuery,
  })
  const { data } = result
  useEffect(() => {
    if (!!data) setTags(data.tags)
  }, [data, setTags])

  return tags
}

const CategoriesQuery = `
query getCategories {
  categories {
    id
    name
  }
}
`

export const useCategories = () => {
  const [categories, setCategories] = useRecoilState(categoriesAtom)
  const [result] = useQuery({
    query: CategoriesQuery,
  })
  const { data } = result
  useEffect(() => {
    if (!!data) setCategories(data.categories)
  }, [data, setCategories])

  return categories
}

const CreateSessionQuery = `
mutation create($data: SessionCreateInput!) {
  createSession(data: $data) {
    id
    name
    start
    end
  }
}
`

export const useCreateSession = () => {
  const [result, createSession] = useMutation(CreateSessionQuery)
  const [sessions, setSessions] = useRecoilState(sessionsAtom)

  useEffect(() => {
    if (!!result.data) {
      setSessions([...sessions, result.data.createSession])
    }
  }, [result])

  return [result, createSession]
}

const UpdateSessionQuery = `
mutation update($id: ID!, $data: SessionUpdateInput!) {
  updateSession(where: { id: $id }, data: $data) {
    id
    name
    start
    end
  }
}
`

export const useUpdateSession = () => {
  const [result, updateSession] = useMutation(UpdateSessionQuery)
  const [sessions, setSessions] = useRecoilState(sessionsAtom)

  useEffect(() => {
    if (!!result.data) {
      setSessions([...sessions])
    }
  }, [result])

  return [result, updateSession]
}

export const useFireWallSettings = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    const run = async () => {
      const response = await api.get(`/firewall/is-added`)
      setIsAdded(response.data)
      setIsLoading(false)
    }
    run()
  }, [])

  const toggle = async () => {
    if (isLoading) return
    const message = isAdded
      ? 'Are you sure you want to remove yourself?'
      : 'By adding yourself and updating your network settings you accept that all traffic will pass trough the infra reveal service.'
    if (!confirm(message)) {
      return
    }
    setIsLoading(true)
    if (isAdded) {
      await api.delete(`/firewall/allow-list`)
    } else {
      await api.post(`/firewall/allow-list`, {})
    }
    setIsAdded(!isAdded)
    setIsLoading(false)
  }

  return [isLoading, isAdded, toggle]
}
