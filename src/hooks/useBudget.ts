import { useBudgetCtx } from "./BudgetProvider";
import { supabase } from "@/lib/supabase/client";
import { Expense, CategoryCap, RecurringExpense } from "@/types";

// All hooks now read from BudgetProvider context — instant on navigation
export function useBudget() {
  const { budget, loading, reload } = useBudgetCtx();
  return { budget, loading, reload };
}

export function useExpenses(_budgetId: string | null) {
  const { expenses, reload } = useBudgetCtx();
  function setExpenses(_fn: (prev: Expense[]) => Expense[]) {
    // optimistic update not needed — reload handles it
  }
  return { expenses, loading: false, reload, setExpenses };
}

export function useCategoryCaps(_budgetId: string | null) {
  const { caps, reload } = useBudgetCtx();
  return { caps, reload };
}

export function useRecurring(_budgetId: string | null) {
  const { recurring, reload } = useBudgetCtx();
  return { items: recurring, reload };
}
