export interface TaskModelProps {
  id?: number
  uid?: string
  title: string
  type: string
  date: string
  star: dayTime
  end: dayTime
  color: colors
  dateCreated?: string
  dateModified?: string
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
