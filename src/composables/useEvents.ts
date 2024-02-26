import { useQuery } from '@tanstack/vue-query'
import useEventsStore from '@/stores/events'
import { getEvents } from '@/utils/request'
import { watch, type Ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import type { TaskModelProps } from '@/interfaces/taskModelProps'

const useEvents = (): any => {
  const store = useEventsStore()
  const { events, loading, err } = storeToRefs(store)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 5000
  })
  watch(
    data as Ref,
    (newData: Array<TaskModelProps>) => {
      if (newData) {
        store.setEvents(newData)
      }
    },
    { immediate: true }
  )
  watchEffect(() => {
    if (isError.value) {
      err.value = true
    }
    loading.value = isLoading.value
    store.setRefetchEvents(refetch)
  })

  return {
    events,
    data,
    isLoading,
    isError,
    error,
    refetch
  }
}

export default useEvents
