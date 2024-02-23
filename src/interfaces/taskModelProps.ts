export interface TaskModelProps {
  id?: number
  uid?: string
  title: string
  type: string
  date: Date
  star: dayTime
  end: dayTime
  color: colors
  description?: string
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
