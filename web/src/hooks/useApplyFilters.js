import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { mutationAtom, packetsFilters } from '../state'
import { applyFiltersToPackets } from '../utils'

const useApplyFilters = () => {
  const filter = useRecoilValue(packetsFilters)
  const mutation = useRecoilValue(mutationAtom)

  useEffect(() => {
    mutation.packets = applyFiltersToPackets(mutation.allPackets, filter)
  }, [filter])
}

export default useApplyFilters
