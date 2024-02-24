import { useQuery } from '@tanstack/vue-query'
import useEventsStore from '@/stores/events'
import { getEvents } from '@/utils/request'
import { watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { TaskModelProps } from '@/interfaces/taskModelProps'


const useEvents = () => {
  const store = useEventsStore()
  const { events } = storeToRefs(store)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 1000,
    //Refresco cada 5 segundos
    refetchInterval: 5000
  })

  watch(data as Ref,
    (newData: Array<TaskModelProps>) => {
      if (newData) {
        store.setEvents(newData)
      }
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
