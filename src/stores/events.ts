import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TaskModelProps } from '@/interfaces/calendar'

export const useEventsStore = defineStore('events', () => {
  const events = ref<TaskModelProps[]>([])
  return {
    events,
    filterForDate(dte: Date): TaskModelProps[] {
      return this.events.value.filter((event) => event.date === dte)
    },
    filterForType(tpe: string): TaskModelProps[] {
      return this.events.value.filter((event) => event.type === tpe)
    },
    setEvents(newClients: TaskModelProps[] | any ): void {
      events.value = newClients
    }
  }
})
