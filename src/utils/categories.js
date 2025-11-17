export const CATEGORIES = [
  '식비',
  '교통',
  '주거',
  '쇼핑',
  '취미',
  '구독',
  '외식',
  '카페',
  '기타',
]

export function guessCategory(text = '') {
  const t = text.toLowerCase()
  if (/(점심|밥|라면|김밥|식당|식비|편의점|마트|장보기)/.test(t)) return '식비'
  if (/(버스|지하철|택시|교통|주차|고속도로)/.test(t)) return '교통'
  if (/(월세|전기|가스|관리비|통신|인터넷|주거|렌트)/.test(t)) return '주거'
  if (/(쇼핑|쿠팡|마켓|무신사|의류|화장품|가전)/.test(t)) return '쇼핑'
  if (/(취미|영화|게임|넷플릭스|유튜브|음악)/.test(t)) return '취미'
  if (/(구독|멤버십|정기결제|subscription)/.test(t)) return '구독'
  if (/(치킨|피자|햄버거|외식|배달|배달비)/.test(t)) return '외식'
  if (/(카페|커피|스타벅스|투썸|폴바셋)/.test(t)) return '카페'
  return '기타'
}
