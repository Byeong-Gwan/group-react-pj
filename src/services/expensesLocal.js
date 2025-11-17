// LocalStorage-backed expense client for React Query (mock server)
const KEY = 'expense_state_v1'

function migrateState(rawState) {
  const parsed = rawState || { expenses: [] }
  return {
    ...parsed,
    expenses: Array.isArray(parsed.expenses)
      ? parsed.expenses.map((exp) => (
          exp && typeof exp === 'object'
            ? { ...exp, isFixed: exp.isFixed ?? exp.fixed ?? false }
            : exp
        ))
      : [],
  }
}

export function getExpenses() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const migrated = migrateState(JSON.parse(raw))
    return migrated.expenses || []
  } catch {
    return []
  }
}

export function setExpenses(expenseList) {
  const state = { expenses: Array.isArray(expenseList) ? expenseList : [] }
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  return state.expenses
}

export function addExpense(expense) {
  const list = getExpenses()
  list.push(expense)
  setExpenses(list)
  return expense
}

export function addManyExpenses(expenseList) {
  const list = getExpenses()
  setExpenses([...list, ...expenseList])
  return true
}

export function clearAllExpenses() {
  setExpenses([])
  return true
}

export function exportData() {
  const state = { expenses: getExpenses() }
  return JSON.stringify(state)
}

export function importData(jsonString) {
  try {
    const imported = JSON.parse(jsonString || '{}')
    const migrated = migrateState(imported)
    setExpenses(migrated.expenses || [])
    return true
  } catch {
    return false
  }
}
