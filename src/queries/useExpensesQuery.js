import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getExpenses, addExpense, addManyExpenses, clearAllExpenses, importData } from '../services/expensesLocal'

export const EXPENSES_KEY = ['expenses']

export function useExpensesQuery() {
  return useQuery({ queryKey: EXPENSES_KEY, queryFn: getExpenses })
}

export function useAddExpenseMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addExpense,
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  })
}

export function useAddManyExpensesMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addManyExpenses,
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  })
}

export function useClearExpensesMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clearAllExpenses,
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  })
}

export function useImportExpensesMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: importData,
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  })
}
