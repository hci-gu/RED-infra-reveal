import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { useMutation, useQuery } from 'urql'
import { packetsAtom, sessionsAtom } from '../state'

const SessionQuery = `
{
  allSessions {
    id
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
      setSessions(result.data.allSessions)
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

const CreateSessionQuery = `
mutation create($data: SessionCreateInput!) {
  createSession(data: $data) {
    id
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
mutation update($id: ID!, $data: SessionUpdateInput) {
  updateSession(id: $id, data: $data) {
    id
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
