import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { TaskModelProps } from '@/interfaces/taskModelProps'

const useEventsStore = defineStore('events', () => {
  const events = reactive<TaskModelProps[]>([])
  const loading = ref<boolean | null>(false)
  const err = ref<boolean>(false)
  const refetchEvents = ref<() => void>((): void => {})
  
  return {
    events,
    err,
    loading,
    refetchEvents,
    filterForDate(dte: string): Array<TaskModelProps> {
      return events.filter((event) => event.date === dte)
    },
    getEventById(id: number): TaskModelProps | {} {
      return events.find((event) => event.id === id) || {}
    },
    getEventsByType(tpe: string): Array<TaskModelProps> {
      return events.filter((event) => event.type === tpe)
    },
    setEvents(newEvents: Array<TaskModelProps>): void {
      events.splice(0, events.length, ...newEvents)
    },
    setRefetchEvents(refetch: () => void): void {
      refetchEvents.value = refetch
    }
  }
})

export default useEventsStore
