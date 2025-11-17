import { guessCategory } from './categories'
import { yyyyMmDd } from './format'

// Very simple Korean expense text parser
// Input examples:
// "오늘 점심 8,000원, 저녁 치킨 22,000원, 카페 5,000원"
// "11/16 점심 8000, 스타벅스 5000"
export function parseExpensesFromText(freeformText) {
  const today = new Date()
  const todayStr = yyyyMmDd(today)
  const chunks = (freeformText || '')
    .split(/\n|,|\/|;/)
    .map((s) => s.trim())
    .filter(Boolean)

  const parsedExpenses = []

  for (const textChunk of chunks) {
    const amountMatch = textChunk.match(/([0-9][0-9,]*)\s*(원)?/)
    if (!amountMatch) continue
    const raw = amountMatch[1].replace(/,/g, '')
    const amount = parseInt(raw, 10)
    if (!amount || amount <= 0) continue

    // try to detect date like MM/DD or YYYY-MM-DD in the chunk
    let date = todayStr
    const mmdd = textChunk.match(/(\d{1,2})\s*[\/.]\s*(\d{1,2})/)
    const ymd = textChunk.match(/(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})/)
    if (ymd) {
      const y = Number(ymd[1])
      const m = String(Number(ymd[2])).padStart(2, '0')
      const d = String(Number(ymd[3])).padStart(2, '0')
      date = `${y}-${m}-${d}`
    } else if (mmdd) {
      const y = today.getFullYear()
      const m = String(Number(mmdd[1])).padStart(2, '0')
      const d = String(Number(mmdd[2])).padStart(2, '0')
      date = `${y}-${m}-${d}`
    }

    const memo = textChunk.replace(amountMatch[0], '').trim()
    const category = guessCategory(memo)
    parsedExpenses.push({ id: crypto.randomUUID(), date, amount, memo, category, isFixed: false })
  }

  return parsedExpenses
}
