import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const ExpenseContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'init':
      return action.payload
    case 'addMany':
      return { ...state, expenses: [...state.expenses, ...action.payload] }
    case 'addOne':
      return { ...state, expenses: [...state.expenses, action.payload] }
    case 'clear':
      return { ...state, expenses: [] }
    case 'import':
      return action.payload
    default:
      return state
  }
}

const initialState = {
  expenses: [],
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('expense_state_v1')
      if (raw) {
        const parsed = JSON.parse(raw)
        // migration: rename 'fixed' -> 'isFixed'
        const migrated = {
          ...parsed,
          expenses: Array.isArray(parsed.expenses)
            ? parsed.expenses.map((exp) => (
                exp && typeof exp === 'object'
                  ? { ...exp, isFixed: exp.isFixed ?? exp.fixed ?? false }
                  : exp
              ))
            : [],
        }
        dispatch({ type: 'init', payload: migrated })
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('expense_state_v1', JSON.stringify(state))
    } catch {}
  }, [state])

  const api = useMemo(() => ({
    expenses: state.expenses,
    addExpense: (expense) => dispatch({ type: 'addOne', payload: expense }),
    addExpenses: (expenseList) => dispatch({ type: 'addMany', payload: expenseList }),
    clearAll: () => dispatch({ type: 'clear' }),
    exportData: () => JSON.stringify(state),
    importData: (jsonString) => {
      try {
        const imported = JSON.parse(jsonString)
        const migrated = {
          ...imported,
          expenses: Array.isArray(imported.expenses)
            ? imported.expenses.map((exp) => (
                exp && typeof exp === 'object'
                  ? { ...exp, isFixed: exp.isFixed ?? exp.fixed ?? false }
                  : exp
              ))
            : [],
        }
        dispatch({ type: 'import', payload: migrated })
      } catch {}
    },
  }), [state])

  return (
    <ExpenseContext.Provider value={api}>{children}</ExpenseContext.Provider>
  )
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext)
  if (!ctx) throw new Error('useExpenses must be used within ExpenseProvider')
  return ctx
}
