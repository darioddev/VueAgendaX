import type { TaskModelProps } from '@/interfaces/calendar'
import { useMutation } from '@tanstack/vue-query'

export const useMutationEvent = (): any => {
  const { isError, error, isSuccess, mutateAsync } = useMutation({
    mutationFn: (request: () => Promise<TaskModelProps>) => request()
  })

  return {
    isError,
    error,
    isSuccess,
    mutateAsync
  }
}

export default useMutationEvent