import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase/client";
import { Budget, Expense, CategoryCap, RecurringExpense } from "@/types";
import { useAuth } from "./useAuth";

interface BudgetCtx {
  budget: Budget | null;
  expenses: Expense[];
  caps: CategoryCap[];
  recurring: RecurringExpense[];
  loading: boolean;
  reload: () => void;
}

const Ctx = createContext<BudgetCtx>({
  budget: null,
  expenses: [],
  caps: [],
  recurring: [],
  loading: false,
  reload: () => {},
});

export function BudgetProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [caps, setCaps] = useState<CategoryCap[]>([]);
  const [recurring, setRecurring] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAll(userId: string) {
    setLoading(true);

    // Load budget
    const { data: b } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!b) {
      setLoading(false);
      return;
    }
    setBudget(b as Budget);

    // Load everything else in parallel
    const [expRes, capRes, recRes] = await Promise.all([
      supabase
        .from("expenses")
        .select("*")
        .eq("budget_id", b.id)
        .order("expense_date", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("category_caps")
        .select("*")
        .eq("budget_id", b.id)
        .order("name"),
      supabase
        .from("recurring_expenses")
        .select("*")
        .eq("budget_id", b.id)
        .eq("is_active", true)
        .order("next_due_date"),
    ]);

    setExpenses((expRes.data as Expense[]) ?? []);
    setCaps((capRes.data as CategoryCap[]) ?? []);
    setRecurring((recRes.data as RecurringExpense[]) ?? []);
    setLoading(false);
  }

  async function reload() {
    if (profile?.id) await loadAll(profile.id);
  }

  useEffect(() => {
    if (profile?.id && profile.onboarding_completed) {
      loadAll(profile.id);
    } else {
      setBudget(null);
      setExpenses([]);
      setCaps([]);
      setRecurring([]);
    }
  }, [profile?.id]);

  return (
    <Ctx.Provider
      value={{ budget, expenses, caps, recurring, loading, reload }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useBudgetCtx() {
  return useContext(Ctx);
}
