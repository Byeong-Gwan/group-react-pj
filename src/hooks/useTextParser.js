import { useCallback } from 'react'
import { parseExpensesFromText } from '../utils/parser'

export function useTextParser(onParsed) {
  return useCallback((text) => {
    const items = parseExpensesFromText(text || '')
    onParsed?.(items)
    return items
  }, [onParsed])
}
