import app from '@/api/api'
import type { TaskModelProps } from '@/interfaces/calendar'
import { useMutation } from '@tanstack/vue-query'

export const postEvent = async (event: TaskModelProps) => {
  try {
    const response = await app.post('/eventos', event)
    return response.data
  } catch (error) {
    throw new Error('Hubo un error al crear el evento , intentelo de nuevo')
  }
}

export const useAddEvent = (): any => {
  const { isError, error, isSuccess, mutateAsync } = useMutation({
    mutationFn: (newTodo: TaskModelProps) => postEvent(newTodo)
  })

  return {
    isError,
    error,
    isSuccess,
    mutateAsync
  }
}
