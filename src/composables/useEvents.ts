import { useQuery } from '@tanstack/vue-query'
import { useEventsStore } from '@/stores/events'
import type { TaskModelProps } from '@/interfaces/calendar'
import { watch } from 'vue'
import { storeToRefs} from 'pinia'

import app from '@/api/api'

const getEvents = async (): Promise<TaskModelProps[] | null> => {
  try {
    const response = await app.get<TaskModelProps[]>('/eventos')
    return response.data
  } catch (error) {
    return null
  }
}

 const useEvents = () => {
  const store = useEventsStore()
  const { events } = storeToRefs(store)
   
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 1000,
  })

  watch(
    data,
    (newData) => {
      console.log('newData', newData)
      store.setEvents(newData)
      console.log('store.events.value', store.events)
    },
    { immediate: true }
  )

   return {
    events,
    data,
    isLoading,
    isError,
    error
  }
}



export default useEvents