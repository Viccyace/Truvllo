export type Plan = "basic" | "premium" | "business";
export type Timeframe = "weekly" | "monthly";
export type CurrencyCode = "NGN" | "USD" | "EUR" | "GBP" | "KES" | "GHS";
export type Frequency = "daily" | "weekly" | "monthly";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  currency: CurrencyCode;
  plan: Plan;
  onboarding_completed: boolean;
  trial_activated: boolean;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  total_amount: number;
  timeframe: Timeframe;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  budget_id: string;
  amount: number;
  category: string;
  note: string | null;
  expense_date: string;
  created_at: string;
}

export interface CategoryCap {
  id: string;
  user_id: string;
  budget_id: string;
  name: string;
  limit_amount: number;
  created_at: string;
}

export interface RecurringExpense {
  id: string;
  user_id: string;
  budget_id: string;
  title: string;
  amount: number;
  category: string;
  frequency: Frequency;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
}

export interface HabitStreak {
  current_streak: number;
  longest_streak: number;
  logged_today: boolean;
  missed_days: string[];
}
