import type { RequestFunction} from '@/interfaces/types'
import { useMutation  } from '@tanstack/vue-query'


const useMutationEvent = (): any => {
  const { isError, error, isSuccess, mutateAsync, reset } = useMutation({
    mutationFn: (request: RequestFunction) => request()
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