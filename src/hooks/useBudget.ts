import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { Budget, Expense, CategoryCap, RecurringExpense } from "@/types";

// ── In-memory cache so data is instant on navigation ─────────────────────────
const cache: {
  budget: Budget | null;
  expenses: Record<string, Expense[]>;
  caps: Record<string, CategoryCap[]>;
  recurring: Record<string, RecurringExpense[]>;
  userId: string | null;
} = { budget: null, expenses: {}, caps: {}, recurring: {}, userId: null };

export function useBudget() {
  const [budget, setBudget] = useState<Budget | null>(cache.budget);
  const [loading, setLoading] = useState(!cache.budget);

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Reset cache if different user
    if (cache.userId !== user.id) {
      cache.budget = null;
      cache.expenses = {};
      cache.caps = {};
      cache.recurring = {};
      cache.userId = user.id;
    }

    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    cache.budget = data as Budget;
    setBudget(data as Budget);
    setLoading(false);
  }

  useEffect(() => {
    if (cache.budget) {
      setBudget(cache.budget);
      setLoading(false);
      return;
    }
    load();
  }, []);

  return {
    budget,
    loading,
    reload: () => {
      cache.budget = null;
      load();
    },
  };
}

export function useExpenses(budgetId: string | null) {
  const key = budgetId ?? "";
  const [expenses, setExpenses] = useState<Expense[]>(
    cache.expenses[key] ?? [],
  );
  const [loading, setLoading] = useState(!cache.expenses[key]);
  const prevKey = useRef(key);

  async function load(bId: string) {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("budget_id", bId)
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false });
    const list = (data as Expense[]) ?? [];
    cache.expenses[bId] = list;
    setExpenses(list);
    setLoading(false);
  }

  useEffect(() => {
    if (!budgetId) {
      setLoading(false);
      return;
    }

    // If key changed (new budget), reset
    if (prevKey.current !== key) {
      prevKey.current = key;
      setExpenses([]);
      setLoading(true);
    }

    if (cache.expenses[key]) {
      setExpenses(cache.expenses[key]);
      setLoading(false);
      return;
    }
    load(key);
  }, [budgetId]);

  function reload() {
    if (!budgetId) return;
    delete cache.expenses[key];
    load(budgetId);
  }

  return { expenses, loading, reload, setExpenses };
}

export function useCategoryCaps(budgetId: string | null) {
  const key = budgetId ?? "";
  const [caps, setCaps] = useState<CategoryCap[]>(cache.caps[key] ?? []);

  async function load() {
    if (!budgetId) return;
    const { data } = await supabase
      .from("category_caps")
      .select("*")
      .eq("budget_id", budgetId)
      .order("name");
    const list = (data as CategoryCap[]) ?? [];
    cache.caps[key] = list;
    setCaps(list);
  }

  useEffect(() => {
    if (!budgetId) return;
    if (cache.caps[key]) {
      setCaps(cache.caps[key]);
      return;
    }
    load();
  }, [budgetId]);

  return {
    caps,
    reload: () => {
      delete cache.caps[key];
      load();
    },
  };
}

export function useRecurring(budgetId: string | null) {
  const key = budgetId ?? "";
  const [items, setItems] = useState<RecurringExpense[]>(
    cache.recurring[key] ?? [],
  );

  async function load() {
    if (!budgetId) return;
    const { data } = await supabase
      .from("recurring_expenses")
      .select("*")
      .eq("budget_id", budgetId)
      .eq("is_active", true)
      .order("next_due_date");
    const list = (data as RecurringExpense[]) ?? [];
    cache.recurring[key] = list;
    setItems(list);
  }

  useEffect(() => {
    if (!budgetId) return;
    if (cache.recurring[key]) {
      setItems(cache.recurring[key]);
      return;
    }
    load();
  }, [budgetId]);

  return {
    items,
    reload: () => {
      delete cache.recurring[key];
      load();
    },
  };
}
