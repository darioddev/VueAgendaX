import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { TaskModelProps } from '@/interfaces/taskModelProps'

const useEventsStore = defineStore('events', () => {
  const events = reactive<TaskModelProps[]>([])
  const loading = ref<boolean | null>(false)
  const err = ref<boolean>(false)
  return {
    events,
    err,
    loading,
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
    orderBY(order: keyof TaskModelProps, asc: boolean = true): TaskModelProps[] {
      return events.sort((a: TaskModelProps, b: TaskModelProps) => {
        const dateA = (a[order] as string) || ''
        const dateB = (b[order] as string) || ''
        if (asc) {
          return dateA.localeCompare(dateB)
        }
        return dateB.localeCompare(dateA)
      })
    }
  }
})

export default useEventsStore
