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
  const { data } = result

  useEffect(() => {
    if (!!data) {
      setSessions(data.allSessions)
    }
  }, [data, setSessions])

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
  }
}
`

export const useCreateSession = () => {
  const [createSessionResult, createSession] = useMutation(CreateSessionQuery)

  return [createSessionResult, createSession]
}
