import './board.css'
import { useExpensesQuery } from '../../queries/useExpensesQuery'
import { formatKRW } from '../../utils/format'
import { useState } from 'react'

export default function Board() {
  const { data: expenses = [] } = useExpensesQuery()

  const groups = expenses.reduce((acc, x) => {
    const key = (x.date || '').slice(0, 7)
    if (!key) return acc
    acc[key] = acc[key] || { items: [], total: 0 }
    acc[key].items.push(x)
    acc[key].total += Number(x.amount || 0)
    return acc
  }, {})

  const [sortOrder, setSortOrder] = useState('desc') // 'desc' | 'asc'
  const months = Object.keys(groups).sort((a, b) => {
    const cmp = new Date(a+'-01') - new Date(b+'-01')
    return sortOrder === 'asc' ? cmp : -cmp
  })
  const [openSet, setOpenSet] = useState(() => new Set(months.slice(0,1)))

  function toggle(m) {
    setOpenSet(prev => {
      const next = new Set(prev)
      if (next.has(m)) next.delete(m); else next.add(m)
      return next
    })
  }

  return (
    <div className="page page-board">
      <div className="panel head" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
        <h2>월별 보드</h2>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div className="muted small">총 {months.length}개월</div>
          <select value={sortOrder} onChange={(e)=>setSortOrder(e.target.value)}>
            <option value="desc">내림차순</option>
            <option value="asc">오름차순</option>
          </select>
        </div>
      </div>

      <div className="board-grid">
        {months.map((m) => (
          <div key={m} className={`panel board-card ${openSet.has(m)? 'open':'collapsed'}`}>
            <button className="board-card-head" onClick={()=>toggle(m)} aria-expanded={openSet.has(m)}>
              <div className="board-month">{m}</div>
              <div className="grow" />
              <div className="board-total">{formatKRW(groups[m].total)}</div>
              <span className={`caret ${openSet.has(m)? 'up':'down'}`} aria-hidden />
            </button>
            <div className="list small-list">
              {groups[m].items
                .slice()
                .sort((a,b)=> new Date(b.date) - new Date(a.date))
                .map((x) => (
                <div key={x.id} className="row">
                  <div>
                    <div className="title">{x.date} · {x.memo}</div>
                    <div className="muted">{x.category}{x.isFixed ? ' · 고정비' : ''}</div>
                  </div>
                  <div className="amt">{formatKRW(x.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {months.length === 0 && <div className="muted">표시할 월이 없습니다.</div>}
      </div>
    </div>
  )
}
