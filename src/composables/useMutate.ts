import type { RequestFunction } from '@/interfaces/types'
import { useMutation } from '@tanstack/vue-query'
import useEventsStore from '@/stores/events'

const { refetchEvents } = useEventsStore()

const useMutationEvent = (): any => {
  const { isError, error, isSuccess, mutateAsync, reset } = useMutation({
    mutationFn: (request: RequestFunction) => request(),
    onSuccess: async () => {
      await refetchEvents()
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
