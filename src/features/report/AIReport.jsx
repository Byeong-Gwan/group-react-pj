import { useMemo } from 'react'
import { useExpensesQuery } from '../../queries/useExpensesQuery'
import { formatKRW } from '../../utils/format'
import './report.css'

function monthKey(d) {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}

export default function AIReport() {
  const { data: expenses = [] } = useExpensesQuery()

  const { months, byMonth, byCatAvg } = useMemo(() => {
    const map = new Map()
    const catMap = new Map()
    expenses.forEach((x) => {
      const k = monthKey(x.date)
      const prev = map.get(k) || 0
      map.set(k, prev + (x.amount || 0))

      const c = x.category || '기타'
      const cPrev = catMap.get(c) || {}
      cPrev[k] = (cPrev[k] || 0) + (x.amount || 0)
      catMap.set(c, cPrev)
    })
    const months = Array.from(map.keys()).sort()
    const byMonth = months.map((m) => ({ month: m, total: map.get(m) }))

    const byCatAvg = Array.from(catMap.entries()).map(([cat, m]) => {
      const vals = months.map((mm) => m[mm] || 0)
      const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
      return { cat, avg }
    }).sort((a,b)=>b.avg-a.avg)

    return { months, byMonth, byCatAvg }
  }, [expenses])

  const maxTotal = byMonth.length ? Math.max(...byMonth.map(b=>b.total)) : 1

  function getReportParts() {
    if (!expenses.length) return { intro: '아직 데이터가 없습니다. 지출을 추가해보세요.', tips: [] }
    const top = byCatAvg.slice(0, 4)
    const intro = top.length ? `주요 지출 비중: ${top.map(t=>`${t.cat} ${Math.round(t.avg)}원`).join(', ')}` : ''

    const tipsByCat = {
      '쇼핑': '쇼핑은 장바구니 숙성(24시간) 후 구매하고, 월 한도(카테고리별 예산)를 설정하세요.',
      '식비': '식비는 주간 장보기 리스트를 고정하고, 외식/배달 빈도를 제한하세요.',
      '카페': '카페 지출은 주간 목표 횟수를 정하고 테이크아웃/멤버십을 활용하세요.',
      '구독': '구독 항목을 점검하여 사용률 낮은 서비스는 일시중지/해지하세요.',
      '교통': '교통은 정기권/정액권 비교 후 가장 경제적인 수단으로 전환하세요.',
      '통신': '통신 요금제는 사용량 기반으로 재조정하고, 가족결합/알뜰요금제 검토하세요.',
      '주거': '주거비는 관리비 항목 점검(공용 전기/수도)과 에너지 절약 체크리스트를 적용하세요.',
      '배달비': '배달은 합배송/픽업으로 대체하고, 쿠폰이 없으면 직접 수령을 고려하세요.',
    }

    // 상위 카테고리 순서대로 맞춤 팁 생성
    const dynamicTips = []
    const used = new Set()
    for (const { cat } of top) {
      const tip = tipsByCat[cat]
      if (tip && !used.has(tip)) {
        dynamicTips.push(tip)
        used.add(tip)
      }
    }

    // 보완용 일반 팁(부족 시 채움)
    const fallback = [
      '비정기 지출은 월 평균으로 나눠 예산에 반영하세요(엔벨로핑).',
      '큰 금액 지출은 사전 견적 비교(최소 2곳) 후 진행하세요.',
      '카드 실적/혜택을 1~2장으로 통합해 중복 지출을 줄이세요.',
    ]
    for (const f of fallback) {
      if (dynamicTips.length >= 3) break
      if (!used.has(f)) { dynamicTips.push(f); used.add(f) }
    }

    return { intro, tips: dynamicTips.slice(0, 3) }
  }

  return (
    <div className="page page-report">
      <div className="panel"><h2>AI 소비 리포트</h2></div>

      <section className="panel">
        <h3>최근 월별 총 지출</h3>
        <div className="month-list">
          {byMonth.map((x)=> (
            <div key={x.month} className="month-row">
              <div className="month-label">{x.month}</div>
              <div className="bar">
                <div className="bar-fill" style={{ width: Math.min(100, Math.round((x.total/maxTotal)*100))+'%' }} />
              </div>
              <div className="amt">{formatKRW(x.total)}</div>
            </div>
          ))}
          {byMonth.length === 0 && <div className="muted">표시할 데이터가 없습니다.</div>}
        </div>
      </section>

      <section className="panel">
        <h3>카테고리별 월평균</h3>
        <div className="cat-avg">
          {byCatAvg.map((x)=> (
            <div key={x.cat} className="cat-avg-row">
              <div>{x.cat}</div>
              <div className="amt">{formatKRW(x.avg)}</div>
            </div>
          ))}
          {byCatAvg.length === 0 && <div className="muted">표시할 데이터가 없습니다.</div>}
        </div>
      </section>

      <section className="panel">
        <h3>AI 텍스트 리포트</h3>
        {(() => { const { intro, tips } = getReportParts(); return (
          <>
            {intro && <pre className="report-pre">{intro}</pre>}
            {tips.length > 0 && (
              <>
                <div className="muted" style={{ marginTop:8 }}>절약 포인트</div>
                <ol style={{ marginTop: 6, paddingLeft: 20 }}>
                  {tips.map((t, i) => <li key={i}>{t}</li>)}
                </ol>
              </>
            )}
          </>
        ) })()}
        <div className="muted" style={{ marginTop:8 }}>미니 목표 예시</div>
        <ul>
          <li>다음 달 목표 예산: 최근 평균 총 지출 대비 90%</li>
          <li>감축 권장 영역: 카페비, 배달비</li>
        </ul>
      </section>
    </div>
  )
}
