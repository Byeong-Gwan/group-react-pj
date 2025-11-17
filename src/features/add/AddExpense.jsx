import { useMemo, useState } from 'react'
import { CATEGORIES, guessCategory } from '../../utils/categories'
import { useTextParser } from '../../hooks/useTextParser'
import { yyyyMmDd } from '../../utils/format'
import './add.css'
import { useNavigate } from 'react-router-dom'
import { useAddExpenseMutation } from '../../queries/useExpensesQuery'

export default function AddExpense({ onAnalyze }) {
  const navigate = useNavigate()
  const addExpenseMutation = useAddExpenseMutation()
  const [date, setDate] = useState(yyyyMmDd(new Date()))
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [category, setCategory] = useState('')
  const [isFixed, setIsFixed] = useState(false)
  const [naturalText, setNaturalText] = useState('')
  const parseText = useTextParser((items) => {
    navigate('/analysis', { state: { analysisItems: items } })
  })

  const canSubmit = useMemo(() => {
    return date && Number(amount) > 0 && memo
  }, [date, amount, memo])

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    const chosenCategory = category || guessCategory(memo)
    const newExpense = {
      id: crypto.randomUUID(),
      date,
      amount: Number(amount),
      memo,
      category: chosenCategory,
      isFixed,
    }
    // React Query(로컬 mock)로 저장
    addExpenseMutation.mutate(newExpense)
    setAmount('')
    setMemo('')
  }

  return (
    <div className="page page-add">
      <section className="panel add-card">
        <h2>폼 입력</h2>
        <form onSubmit={handleSubmit} className="add-form">
          <label className="field">
            <span>날짜</span>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          </label>
          <label className="field">
            <span>금액</span>
            <input inputMode="numeric" placeholder="예: 9000" value={amount} onChange={(e)=>setAmount(e.target.value.replace(/[^0-9]/g,''))} />
          </label>
          <label className="field">
            <span>메모</span>
            <input placeholder="예: 점심 김밥천국" value={memo} onChange={(e)=>setMemo(e.target.value)} />
          </label>
          <label className="field">
            <span>카테고리</span>
            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option value="">자동 분류</option>
              {CATEGORIES.map((c)=> <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <div className="form-actions">
            <label className="check">
              <input type="checkbox" checked={isFixed} onChange={(e)=>setIsFixed(e.target.checked)} />
              <span>고정비</span>
            </label>
            <button disabled={!canSubmit} className="btn btn-primary">저장</button>
          </div>
        </form>
      </section>

      <section className="panel add-card">
        <h2>자연어 입력</h2>
        <div className="nl-wrap">
          <textarea rows={4} placeholder="예: 오늘 점심 8,000원, 저녁 치킨 22,000원, 카페 5,000원" value={naturalText} onChange={(e)=>setNaturalText(e.target.value)} />
          <button onClick={()=>parseText(naturalText)} className="btn btn-primary">AI로 분석하기</button>
        </div>
      </section>
    </div>
  )
}
