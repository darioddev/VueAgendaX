//import type { dataDate } from '../interfaces/calendar'
import { transformArrayStringToNumber } from './arrayString'

export const transformDateToDateInfo = (date: Date): string =>
  date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

export const transformStringToDate = (date: string): string =>
  transformDateToDateInfo(transformStringToDateObject(date))

export const transformStringToDateObject = (date: string, delimit = '/'): Date => {
  const dte: Array<number> = transformArrayStringToNumber(date, delimit)
  return new Date(dte[2], dte[1] - 1, dte[0])
}

export const getFormatDateParam = (date: Date) =>
  date
    .toLocaleDateString('es-ES', { month: '2-digit', day: '2-digit', year: 'numeric' })
    .split('/')
    .reverse()
    .join('-')

// Funcion funcional para datetime-local en input , tambien en date y time pero habria que hacer un split y obtener el valor
export const getDateTimeFormat = (
  date: Date,
  hour: number = 0,
  minute: number = import.meta.env.VITE_MINUTES_END_DEFAULT
): string =>
  `${getFormatDateParam(date)}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

export const getTimeFormat = (
  hour: number,
  minute: number = import.meta.env.VITE_MINUTES_END_DEFAULT
): string =>
  `${(hour > 23 ? '00' : hour).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

export const checkDate = (value: string): string | null => {
  const dte: number = new Date(value).getFullYear() || 0
  if (
    dte > Number(import.meta.env.VITE_MAX_YEARS_CALENDAR as number) ||
    dte < Number(import.meta.env.VITE_MIN_YEARS_CALENDAR as number)
  ) {
    return null
  }
  return value
}
/*
export const getDateObject = (date: Date): dataDate => {
  const dte: string = getFormatDateParam(date)
  const [year, month, day] = dte.split('-').map((d) => Number(d))
  return { date: dte, day: day, month: month, year: year }
}
*/
