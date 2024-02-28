import { useQuery } from '@tanstack/vue-query'
import useEventsStore from '@/stores/events'
import { getEvents } from '@/utils/request'
import { watch, type Ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import type { TaskModelProps } from '@/interfaces/taskModelProps'

const useEvents = (option: object): any => {
  const store = useEventsStore()
  const { events, loading, err } = storeToRefs(store)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events'], // Nombre de la query
    queryFn: getEvents, // Función que realiza la petición
    staleTime: 5000,
    retry: 3,
    enabled: true, // Habilitar la petición
    refetchOnWindowFocus: false, // No recargar la data al enfocar la ventana
    ...option
  })
  //Observe changes in the data

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
