import axios from 'axios'
import type { TaskModelProps } from '@/interfaces/calendar'

//Peticion get con axios
export const get = async (url: string) : Promise<TaskModelProps | null> => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    return null
  }
}

//Peticion post con axios
export const post = async (url: string, data: object): Promise<TaskModelProps | Error> => {
  try {
    const response = await axios.post(url, data)
    return response.data
  } catch (error) {
    throw new Error('Algo ha ido mal , por favor intentelo de nuevo ')
  }
}

//Peticion put con axios
export const put = async (url: string, data: object) : Promise<TaskModelProps | null> => {
  try {
    const response = await axios.put(url, data)
    return response.data
  } catch (error) {
    return null
  }
}

//Peticion delete con axios
export const remove = async (url: string) : Promise<TaskModelProps | null> => {
  try {
    const response = await axios.delete(url)
    return response.data
  } catch (error) {
    return null
  }
}

//Peticion patch con axios
export const patch = async (url: string, data: object) : Promise<TaskModelProps | null> => {
  try {
    const response = await axios.patch(url, data)
    return response.data
  } catch (error) {
    return null
  }
}

