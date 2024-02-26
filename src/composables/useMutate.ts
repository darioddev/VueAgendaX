import type { RequestFunction } from '@/interfaces/types'
import useEvents from './useEvents'
import { useMutation } from '@tanstack/vue-query'


const useMutationEvent = (): any => {
  const { refetch } = useEvents({enabled: false})
  const { isError, error, isSuccess, mutateAsync, reset } = useMutation({
    mutationFn: (request: RequestFunction) => request(),
    onSuccess: async () => {
      await refetch()
    }
  })

  return {
    isError,
    error,
    isSuccess,
    mutateAsync,
    reset
  }
}

export default useMutationEvent
