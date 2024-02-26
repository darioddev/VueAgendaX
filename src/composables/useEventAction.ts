import { ref } from 'vue'
import type { TaskModelProps } from '@/interfaces/taskModelProps'
import useMutationEvent from './useMutate'
import { postEvent, patchEvent, removeEvent } from '@/utils/request' // Importa las funciones para crear y actualizar eventos
import { generateUUID } from '@/utils/uuid'

const useEventAction = () => {
  const errorMessage = ref<string>('')
  const { isSuccess: isSuccessMutation, reset, mutateAsync } = useMutationEvent()

  const createEvent = async (event: TaskModelProps, close: () => void): Promise<void> => {
    try {
      if (!event.title.trim()) event.title = '(Sin título)'
      await mutateAsync(() =>
        postEvent({
          ...event,
          dateCreated: new Date().toISOString(),
          uid: generateUUID()
        })
      )
      await new Promise((resolve) => setTimeout(resolve, 1000))
      reset()
      close()
    } catch (error) {
      if (error instanceof Error) errorMessage.value = error.message
      else errorMessage.value = 'Algo salió mal'
    }
  }

  const updateEvent = async ( event: TaskModelProps, close: (() => void) | null = null, message = '¿Estás seguro de que quieres actualizar este evento?' ): Promise<void> => {
    try {
      if (!event.title.trim()) event.title = '(Sin título)'
      if (confirm(message)) {
        await mutateAsync(() =>
          patchEvent({
            ...event,
            dateModified: new Date().toISOString()
          })
        )
        await new Promise((resolve) => setTimeout(resolve, 1000))
        reset()
        if (close) close()
      }
    } catch (error) {
      alert('Hubo un error al actualizar el evento, intentelo de nuevo')
      if (error instanceof Error) errorMessage.value = error.message
      else errorMessage.value = 'Algo salió mal'
    }
  }

  const deleteEvent = async (id: Number, close?: () => void): Promise<void> => {
    try {
      if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        await mutateAsync(() => removeEvent(id as number))
        if (close) close()
        alert('Evento eliminado correctamente')
      }
    } catch (error) {
      if (error instanceof Error) errorMessage.value = error.message
      else errorMessage.value = 'Algo salió mal'
    }
  }

  const submitEvent = async (event: TaskModelProps, close: () => void): Promise<void> => {
    try {
      if (!event.id) {
        await createEvent(event, close)
      } else {
        await updateEvent(event, close)
      }
    } catch (error) {
      if (error instanceof Error) errorMessage.value = error.message
      else errorMessage.value = 'Algo salió mal'
    }
  }

  return {
    errorMessage,
    submitEvent,
    updateEvent,
    isSuccessMutation,
    deleteEvent
  }
}

export default useEventAction
