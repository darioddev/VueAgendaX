import { ref, watchEffect } from 'vue'

const useDate = (dte: Date) => {
  const date = ref<Date>(dte)
  const monthCurrent = ref<number>(date.value.getMonth() + 1)
  const yearCurrent = ref<number>(date.value.getFullYear())

  const nextMonth = (n: number): void => {
    date.value = new Date(date.value.getFullYear(), date.value.getMonth() + n, 1)
    monthCurrent.value = date.value.getMonth() + 1
    yearCurrent.value = date.value.getFullYear()
  }

  const nextYear = (n: number): void => {
    date.value = new Date(date.value.getFullYear() + n, date.value.getMonth(), 1)
    monthCurrent.value = date.value.getMonth() + 1
    yearCurrent.value = date.value.getFullYear()
  }

  const dayToday = (): void => {
    date.value = new Date()
    monthCurrent.value = date.value.getMonth() + 1
    yearCurrent.value = date.value.getFullYear()
  }

  const setDate = (dte: Date): void => {
    date.value = dte
    monthCurrent.value = date.value.getMonth() + 1
    yearCurrent.value = date.value.getFullYear()
  }

  const setMonth = (month: number): number => (monthCurrent.value = month)
  const setYear = (year: number): number => (yearCurrent.value = year)

  return {
    date,
    monthCurrent,
    yearCurrent,
    nextMonth,
    nextYear,
    dayToday,
    setDate,
    setMonth,
    setYear
  }
}

export default useDate
