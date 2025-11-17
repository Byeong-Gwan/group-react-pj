import { useMemo } from 'react'

export function useMonthlySummary(expenses, refDate = new Date()) {
  const s = new Date(refDate.getFullYear(), refDate.getMonth(), 1)
  const e = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0)
  const lastS = new Date(refDate.getFullYear(), refDate.getMonth() - 1, 1)
  const lastE = new Date(refDate.getFullYear(), refDate.getMonth(), 0)

  return useMemo(() => {
    const list = expenses.filter((x) => {
      const d = new Date(x.date)
      return d >= s && d <= e
    })
    const total = list.reduce((a, b) => a + (b.amount || 0), 0)
    const byCat = {}
    list.forEach((x) => { byCat[x.category] = (byCat[x.category] || 0) + (x.amount || 0) })

    const lastTotal = expenses
      .filter((x) => { const d = new Date(x.date); return d >= lastS && d <= lastE })
      .reduce((a, b) => a + (b.amount || 0), 0)

    const deltaPct = lastTotal ? Math.round(((total - lastTotal) / lastTotal) * 100) : 0

    return { total, byCat, deltaPct }
  }, [expenses])
}
