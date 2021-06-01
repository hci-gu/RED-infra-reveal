import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { useMutation, useQuery } from 'urql'
import { packetsAtom, sessionsAtom, tagsAtom } from '../state'
import { calculateSessionPositions } from '../utils/session'

const SessionQuery = `
{
  allSessions {
    id
    name
    start
    end
    clientPositions {
      lat
      lon
    }
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
      setSessions(result.data.allSessions.map(calculateSessionPositions))
    }
  }, [result, setSessions])

  return sessions
}

export const createSession = () => {}

const PacketQuery = `
query getList($where: PacketWhereInput) {
  allPackets(where: $where) {
    id
    timestamp
    ip
    host
    protocol
    method
    accept
    lat
    lon
    userId
    clientLat
    clientLon
  }
}
`

export const usePackets = (sessionId) => {
  const [packets, setPackets] = useRecoilState(packetsAtom)
  const [result] = useQuery({
    query: PacketQuery,
    variables: {
      where: { session: { id: sessionId } },
    },
  })
  const { data } = result

  useEffect(() => {
    if (!!data) {
      setPackets(data.allPackets)
    }
  }, [data, setPackets])

  return packets
}

const TagsQuery = `
query getList($where: TagWhereInput) {
  allTags(where: $where) {
    id
    name
    domains {
      id
      name
    }
    tagType
  }
}
`

export const useTags = () => {
  const [tags, setTags] = useRecoilState(tagsAtom)
  const [result] = useQuery({
    query: TagsQuery,
    variables: {
      where: {},
    },
  })
  const { data } = result
  useEffect(() => {
    if (!!data) setTags(data.allTags)
  }, [data, setTags])

  return tags
}

const CreateSessionQuery = `
mutation create($data: SessionCreateInput!) {
  createSession(data: $data) {
    id
    name
    start
    end
    clientPositions {
      lat
      lon
    }
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
mutation update($id: ID!, $data: SessionUpdateInput) {
  updateSession(id: $id, data: $data) {
    id
    name
    start
    end
    clientPositions {
      lat
      lon
    }
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
