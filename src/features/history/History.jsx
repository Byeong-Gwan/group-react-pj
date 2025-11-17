import { useMemo, useState } from 'react'
import { CATEGORIES } from '../../utils/categories'
import { formatKRW } from '../../utils/format'
import './history.css'
import { useExpensesQuery, useClearExpensesMutation, useImportExpensesMutation } from '../../queries/useExpensesQuery'
import { exportData as exportExpensesData } from '../../services/expensesLocal'
import { thisMonthRange, lastMonthRange } from '../../utils/dateRange'
import { sortBy } from '../../utils/sort'

export default function History() {
  const { data: queryExpenses = [] } = useExpensesQuery()
  const clearMutation = useClearExpensesMutation()
  const importMutation = useImportExpensesMutation()
  const [category, setCategory] = useState('')
  const [range, setRange] = useState('this-month')
  const [sort, setSort] = useState('date-desc')

  const filtered = useMemo(() => {
    let list = [...queryExpenses]

    if (category) list = list.filter((x) => x.category === category)

    const now = new Date()
    if (range === 'this-month') {
      const { start, end } = thisMonthRange(now)
      list = list.filter((x) => { const d = new Date(x.date); return d >= start && d <= end })
    } else if (range === 'last-month') {
      const { start, end } = lastMonthRange(now)
      list = list.filter((x) => { const d = new Date(x.date); return d >= start && d <= end })
    }

    return sortBy(list, (a, b) => {
      if (sort === 'amount-desc') return (b.amount || 0) - (a.amount || 0)
      if (sort === 'amount-asc') return (a.amount || 0) - (b.amount || 0)
      if (sort === 'date-asc') return new Date(a.date) - new Date(b.date)
      return new Date(b.date) - new Date(a.date)
    })
  }, [queryExpenses, category, range, sort])

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const jsonString = String(reader.result || '')
      importMutation.mutate(jsonString)
    }
    reader.readAsText(file)
  }

  function handleExport() {
    const blob = new Blob([exportExpensesData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expenses.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page page-history">
      <div className="panel head"><h2>지출 내역</h2></div>

      <div className="panel toolbar">
        <select value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="">전체 카테고리</option>
          {CATEGORIES.map((c)=>(<option key={c} value={c}>{c}</option>))}
        </select>
        <select value={range} onChange={(e)=>setRange(e.target.value)}>
          <option value="this-month">이번 달</option>
          <option value="last-month">지난 달</option>
          <option value="all">전체</option>
        </select>
        <select value={sort} onChange={(e)=>setSort(e.target.value)}>
          <option value="date-desc">최신순</option>
          <option value="date-asc">오래된순</option>
          <option value="amount-desc">금액 높은순</option>
          <option value="amount-asc">금액 낮은순</option>
        </select>
        <label className="import">
          <span>가져오기</span>
          <input type="file" accept="application/json" onChange={handleImport} />
        </label>
        <button onClick={handleExport} className="btn">내보내기</button>
        <button onClick={() => clearMutation.mutate()} className="btn btn-danger">전체 삭제</button>
      </div>

      <div className="list">
        {filtered.map((x)=> (
          <div key={x.id} className="panel row">
            <div>
              <div className="title">{x.date} · {x.memo}</div>
              <div className="muted">{x.category}{x.isFixed ? ' · 고정비':''}</div>
            </div>
            <div className="amt">{formatKRW(x.amount)}</div>
          </div>
        ))}
        {filtered.length === 0 && <div className="muted">표시할 내역이 없습니다.</div>}
      </div>
    </div>
  )
}
