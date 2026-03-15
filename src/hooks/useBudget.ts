import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Budget, Expense, CategoryCap, RecurringExpense } from '@/types';

export function useBudget() {
  const [budget, setBudget]   = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from('budgets').select('*').eq('user_id', user.id)
      .eq('is_active', true).order('created_at', { ascending: false }).limit(1).single();
    setBudget(data as Budget);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);
  return { budget, loading, reload: load };
}

export function useExpenses(budgetId: string | null) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading]   = useState(true);

  async function load() {
    if (!budgetId) { setLoading(false); return; }
    const { data } = await supabase
      .from('expenses').select('*').eq('budget_id', budgetId)
      .order('expense_date', { ascending: false }).order('created_at', { ascending: false });
    setExpenses((data as Expense[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [budgetId]);
  return { expenses, loading, reload: load, setExpenses };
}

export function useCategoryCaps(budgetId: string | null) {
  const [caps, setCaps]       = useState<CategoryCap[]>([]);
  async function load() {
    if (!budgetId) return;
    const { data } = await supabase.from('category_caps').select('*').eq('budget_id', budgetId).order('name');
    setCaps((data as CategoryCap[]) ?? []);
  }
  useEffect(() => { load(); }, [budgetId]);
  return { caps, reload: load };
}

export function useRecurring(budgetId: string | null) {
  const [items, setItems] = useState<RecurringExpense[]>([]);
  async function load() {
    if (!budgetId) return;
    const { data } = await supabase.from('recurring_expenses').select('*')
      .eq('budget_id', budgetId).eq('is_active', true).order('next_due_date');
    setItems((data as RecurringExpense[]) ?? []);
  }
  useEffect(() => { load(); }, [budgetId]);
  return { items, reload: load };
}
