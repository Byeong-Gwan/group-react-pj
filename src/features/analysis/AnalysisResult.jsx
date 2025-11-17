import { formatKRW } from '../../utils/format'
import './analysis.css'
import { useAddManyExpensesMutation } from '../../queries/useExpensesQuery'
import { useNavigate } from 'react-router-dom'

export default function AnalysisResult({ items = [], onBack }) {
  const addManyMutation = useAddManyExpensesMutation()
  const navigate = useNavigate()

  const total = items.reduce((a,b)=>a+(b.amount||0),0)
  const byCat = {}
  items.forEach((x)=>{ byCat[x.category] = (byCat[x.category]||0) + (x.amount||0) })
  const cats = Object.entries(byCat).sort((a,b)=>b[1]-a[1])

  function quickFeedback() {
    if (!items.length) return '분석 결과가 없습니다.'
    if (cats.length) {
      const [top] = cats[0]
      return `이번 입력에서 '${top}' 지출이 높습니다. 주별 예산을 정해보면 도움이 됩니다.`
    }
    return '지출 패턴을 꾸준히 기록하면 더 정확한 팁을 제공할 수 있어요.'
  }

  function handleSave() {
    // Save via React Query and keep context compatible
    if (items?.length) addManyMutation.mutate(items)
    if (onBack) onBack('saved')
    else navigate('/add')
  }

  return (
    <div className="page page-analysis">
      <div className="panel head">
        <h2>AI 분석 결과</h2>
        <div className="muted small">총 {items.length}건 · 합계 {formatKRW(total)}</div>
      </div>

      <div className="list">
        {items.map((x)=> (
          <div key={x.id} className="panel row">
            <div>
              <div className="title">{x.date} · {x.memo}</div>
              <div className="muted">카테고리: {x.category}{x.isFixed ? ' · 고정비':''}</div>
            </div>
            <div className="amt">{formatKRW(x.amount)}</div>
          </div>
        ))}
        {items.length === 0 && <div className="muted">항목이 비어 있습니다.</div>}
      </div>

      <div className="panel">
        <h3>간단 피드백</h3>
        <div className="muted" style={{ marginTop:6 }}>{quickFeedback()}</div>
      </div>

      <div className="actions">
        <button onClick={()=>onBack?.()} className="btn btn-muted">뒤로</button>
        <button onClick={handleSave} className="btn btn-primary">저장하기</button>
      </div>
    </div>
  )
}
