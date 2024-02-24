import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { TaskModelProps } from '@/interfaces/taskModelProps'

const useEventsStore = defineStore('events', () => {
  const events = reactive<TaskModelProps[]>([])

  return {
    events,
    filterForDate(dte: string): Array<TaskModelProps> {
      return events.filter((event) => event.date === dte)
    },
    getEventsByType(tpe: string): Array<TaskModelProps> {
      return events.filter((event) => event.type === tpe)
    },
    setEvents(newEvents: Array<TaskModelProps>): void {
      events.splice(0, events.length, ...newEvents)
    }
  }
})

export default useEventsStore
