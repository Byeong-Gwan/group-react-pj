import { formatKRW } from '../../utils/format'
import { useMonthlySummary } from '../../hooks/useMonthlySummary'
import './dashboard.css'
import { useExpensesQuery } from '../../queries/useExpensesQuery'

export default function Dashboard() {
  const { data: expenseList = [] } = useExpensesQuery()
  const { total, byCat, deltaPct } = useMonthlySummary(expenseList)
  const cats = Object.entries(byCat).sort((a,b) => b[1]-a[1])

  return (
    <div className="page page-dashboard">
      <h2>이번 달 요약</h2>
      <div className="stat-cards">
        <div className="panel stat-card">
          <div className="stat-label">총 지출</div>
          <div className="stat-value">{formatKRW(total)}</div>
        </div>
        <div className="panel stat-card">
          <div className="stat-label">지난달 대비</div>
          <div className={`stat-delta ${deltaPct>=0? 'up':'down'}`}>
            {deltaPct>=0? '▲':'▼'} {Math.abs(deltaPct)}%
          </div>
        </div>
      </div>

      <h3>카테고리별 지출</h3>
      <div className="cat-grid">
        {cats.map(([cat, amt]) => (
          <div key={cat} className="panel">
            <div className="cat-name">{cat}</div>
            <div className="cat-amt">{formatKRW(amt)}</div>
          </div>
        ))}
        {cats.length === 0 && <div className="muted">이번 달 지출이 없습니다.</div>}
      </div>

      <div className="panel tips">
        <h3>빠른 팁</h3>
        <ul>
          <li>식비·카페 지출이 높다면 일주일 목표 횟수를 정해보세요.</li>
          <li>구독을 점검하고 사용하지 않는 항목을 정리하세요.</li>
          <li>배달비 절감을 위해 픽업이나 합배송을 고려하세요.</li>
        </ul>
      </div>
    </div>
  )
}
