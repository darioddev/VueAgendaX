import axios from 'axios'
import app from '@/api/api'
import type { TaskModelProps } from '@/interfaces/taskModelProps'

//Peticion get con axios
export const getEvents = async (): Promise<TaskModelProps> => {
  try {
    const response = await app.get('/eventos')
    return response.data
  } catch (error) {
    throw new Error('Hubo un error al obtener los eventos , intentelo de nuevo')
  }
}

export const postEvent = async (event: TaskModelProps): Promise<void> => {
  try {
    await app.post('/eventos', event)
  } catch (error) {
    throw new Error('Hubo un error al crear el evento , intentelo de nuevo')
  }
}

export const removeEvent = async (id: number): Promise<void> => {
  try {
    await app.delete(`/eventos/${id}`)
  } catch (error) {
    throw new Error('No se ha podido eliminar el evento , intentelo de nuevo')
  }
}

export const patchEvent = async (data: TaskModelProps): Promise<TaskModelProps> => {
  try {
    const response = await app.patch(`/eventos/${data?.id}`, data)
    return response.data
  } catch (error) {
    throw new Error('No se ha podido actualizar el evento , intentelo de nuevo')
  }
}

//Peticion put con axios
export const put = async (url: string, data: object): Promise<TaskModelProps | null> => {
  try {
    const response = await axios.put(url, data)
    return response.data
  } catch (error) {
    throw new Error('Algo ha ido mal , por favor intentelo de nuevo ')
  }
}
