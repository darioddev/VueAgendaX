export interface CalendarProps {
    month?: number
    year?: number
    daysOfWeek?: string[]
    cols?: number
    rows?: number
}

export interface TaskModelProps {
  uid?: string
  title: string
  type: string
  date: Date
  star: dayTime
  end: dayTime
  color: colors
  description?: string
}

export interface taskModalProps {
  showModal?: boolean
  date: Date
  task?: TaskModelProps
}

interface dayTime {
  date: string
  time: string
  allDay?: boolean
}

interface colors {
  background: string
  text: string
}

//
export interface dataDate {
  date: string
  day: number
  month: number
  year: number
}