import { startOfMonth, endOfMonth } from 'date-fns'

export function thisMonthRange(referenceDate = new Date()) {
  const start = startOfMonth(referenceDate)
  const end = endOfMonth(referenceDate)
  return { start, end }
}

export function lastMonthRange(referenceDate = new Date()) {
  const lastMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 15)
  const start = startOfMonth(lastMonth)
  const end = endOfMonth(lastMonth)
  return { start, end }
}
