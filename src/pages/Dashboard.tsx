import { useAuth } from "@/hooks/useAuth";
import { useBudget, useExpenses } from "@/hooks/useBudget";
import { AppShell } from "@/components/shared/AppShell";
import { formatCurrency } from "@/lib/utils/currency";
import {
  getExpectedSpend,
  getSafeToSpend,
  getPaceStatus,
  getHabitStreak,
} from "@/lib/utils/budget";
import { supabase } from "@/lib/supabase/client";
import { defaultCategories } from "@/lib/constants/categories";
import { useState, useTransition, useRef } from "react";
import { Link } from "react-router-dom";
import {
  TrendingDown,
  Wallet,
  PiggyBank,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Flame,
  Trophy,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";

const catColors: Record<string, string> = {
  Food: "bg-orange-100 text-orange-700",
  Transport: "bg-sky-100 text-sky-700",
  Shopping: "bg-pink-100 text-pink-700",
  Housing: "bg-violet-100 text-violet-700",
  Health: "bg-green-100 text-green-700",
  Education: "bg-blue-100 text-blue-700",
  Entertainment: "bg-yellow-100 text-yellow-700",
  Savings: "bg-emerald-100 text-emerald-700",
  Utilities: "bg-amber-100 text-amber-700",
  Other: "bg-slate-100 text-slate-600",
};

const statusConfig: Record<
  string,
  { bg: string; text: string; icon: React.ElementType; bar: string }
> = {
  "Ahead of plan": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: TrendingDown,
    bar: "bg-forest-gradient",
  },
  "On track": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: CheckCircle2,
    bar: "bg-forest-gradient",
  },
  "Slightly over pace": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: TrendingUp,
    bar: "bg-gradient-to-r from-amber-400 to-orange-400",
  },
  "Over budget risk": {
    bg: "bg-red-50",
    text: "text-red-600",
    icon: AlertTriangle,
    bar: "bg-gradient-to-r from-red-400 to-rose-500",
  },
};

export default function Dashboard() {
  const { profile } = useAuth();
  const { budget, reload: reloadBudget } = useBudget();
  const { expenses, reload: reloadExpenses } = useExpenses(budget?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().split("T")[0];

  if (!profile) return null;

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalBudget = Number(budget?.total_amount ?? 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const expectedSpend = budget
    ? getExpectedSpend(totalBudget, budget.start_date, budget.end_date)
    : 0;
  const safeToday = budget
    ? getSafeToSpend(totalBudget, totalSpent, budget.end_date)
    : 0;
  const paceStatus = getPaceStatus(totalSpent, expectedSpend);
  const streak = budget
    ? getHabitStreak(expenses, budget.start_date, budget.end_date)
    : null;
  const spentPct =
    totalBudget > 0
      ? Math.min(100, Math.round((totalSpent / totalBudget) * 100))
      : 0;
  const expPct =
    totalBudget > 0
      ? Math.min(100, Math.round((expectedSpend / totalBudget) * 100))
      : 0;
  const cfg = statusConfig[paceStatus] ?? statusConfig["On track"];
  const StatusIcon = cfg.icon;
  const recent = expenses.slice(0, 5);
  const isPremium = profile.plan === "premium" || profile.plan === "business";

  async function handleQuickAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!budget) return;
    setSaving(true);
    setError("");
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    const { error: err } = await supabase.from("expenses").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      budget_id: budget.id,
      amount: parseFloat(fd.get("amount") as string),
      category: fd.get("category") as string,
      note: (fd.get("note") as string) || null,
      expense_date: fd.get("expense_date") as string,
    });
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess(true);
    formRef.current?.reset();
    reloadExpenses();
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <AppShell title="Dashboard" profile={profile}>
      {!budget ? (
        <div className="rounded-[24px] bg-cream py-16 text-center">
          <p className="text-stone">No active budget found.</p>
          <Link
            to="/budget"
            className="mt-4 inline-block rounded-2xl bg-ink px-6 py-3 text-sm font-semibold text-white"
          >
            Create a budget
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              {
                label: "Total budget",
                value: formatCurrency(totalBudget, profile.currency),
                sub: `${budget.timeframe}`,
                Icon: Wallet,
                accent: false,
              },
              {
                label: "Total spent",
                value: formatCurrency(totalSpent, profile.currency),
                sub: `${spentPct}% used`,
                Icon: TrendingDown,
                accent: false,
              },
              {
                label: "Remaining",
                value: formatCurrency(remaining, profile.currency),
                sub: `${100 - spentPct}% left`,
                Icon: PiggyBank,
                accent: false,
              },
              {
                label: "Safe today",
                value: formatCurrency(safeToday, profile.currency),
                sub: "Spend freely",
                Icon: ShieldCheck,
                accent: true,
              },
            ].map(({ label, value, sub, Icon, accent }) => (
              <div
                key={label}
                className={`relative overflow-hidden rounded-[20px] p-4 transition hover:-translate-y-0.5 ${accent ? "text-white shadow-glow" : "bg-white border border-cream-dark hover:shadow-card"}`}
                style={
                  accent
                    ? {
                        background:
                          "linear-gradient(135deg,#1B4332,#2D6A4F,#40916C)",
                      }
                    : {}
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wide ${accent ? "text-white/60" : "text-stone"}`}
                    >
                      {label}
                    </p>
                    <p
                      className={`stat-number mt-2 truncate text-2xl font-semibold ${accent ? "text-white" : "text-ink"}`}
                    >
                      {value}
                    </p>
                    <p
                      className={`mt-1 text-xs ${accent ? "text-white/50" : "text-stone"}`}
                    >
                      {sub}
                    </p>
                  </div>
                  <div
                    className={`shrink-0 rounded-xl p-2.5 ${accent ? "bg-white/20" : "bg-cream"}`}
                  >
                    <Icon
                      size={18}
                      className={accent ? "text-white" : "text-forest"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pace card + Recent expenses */}
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Pace card */}
            <div
              className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft"
              style={{ borderLeft: "3px solid #2D6A4F" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone">
                    Budget pace
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StatusIcon size={20} className={cfg.text} />
                    <h3 className="text-xl font-semibold text-ink">
                      {paceStatus}
                    </h3>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
                >
                  {spentPct}% used
                </span>
              </div>
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs text-stone">
                  <span>Actual</span>
                  <span>{spentPct}%</span>
                </div>
                <div className="relative h-3 rounded-full bg-cream-dark">
                  <div
                    className="absolute top-0 h-3 w-0.5 rounded-full bg-stone/40"
                    style={{ left: `${expPct}%` }}
                    title="Expected"
                  />
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${cfg.bar}`}
                    style={{ width: `${spentPct}%` }}
                  />
                </div>
                <p className="text-xs text-stone">Expected marker: {expPct}%</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: "Expected by today",
                    val: formatCurrency(expectedSpend, profile.currency),
                  },
                  {
                    label: "Actual spent",
                    val: formatCurrency(totalSpent, profile.currency),
                  },
                ].map(({ label, val }) => (
                  <div key={label} className="rounded-2xl bg-cream p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone">
                      {label}
                    </p>
                    <p className="stat-number mt-1.5 truncate text-lg font-semibold text-ink">
                      {val}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent expenses */}
            <div className="flex flex-col rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-ink">Recent expenses</h3>
                <Link
                  to="/expenses"
                  className="flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {recent.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cream mb-3">
                    <TrendingDown size={20} className="text-stone" />
                  </div>
                  <p className="text-sm text-stone">No expenses yet</p>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {recent.map((e) => (
                    <li
                      key={e.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`shrink-0 rounded-xl px-2.5 py-1 text-xs font-medium ${catColors[e.category] ?? catColors.Other}`}
                        >
                          {e.category}
                        </span>
                        <span className="truncate text-sm text-stone">
                          {e.note ?? e.expense_date}
                        </span>
                      </div>
                      <span className="stat-number shrink-0 text-sm font-semibold text-ink">
                        {formatCurrency(Number(e.amount), profile.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Quick add */}
          <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-ink">
                  Log an expense
                </h3>
                <p className="mt-0.5 text-sm text-stone">
                  Quick entry — takes 10 seconds
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-forest/10">
                <Plus size={18} className="text-forest" />
              </div>
            </div>
            {error && (
              <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}
            {success && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <p className="text-sm font-medium text-emerald-700">
                  Expense saved!
                </p>
              </div>
            )}
            <form ref={formRef} onSubmit={handleQuickAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="any"
                  required
                  inputMode="decimal"
                  placeholder="Amount"
                  className="rounded-2xl border border-cream-dark bg-cream px-4 py-3.5 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                />
                <select
                  name="category"
                  required
                  className="rounded-2xl border border-cream-dark bg-cream px-4 py-3.5 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                >
                  <option value="">Category</option>
                  {defaultCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="note"
                  placeholder="Note (optional)"
                  maxLength={100}
                  className="rounded-2xl border border-cream-dark bg-cream px-4 py-3.5 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                />
                <input
                  name="expense_date"
                  type="date"
                  required
                  defaultValue={today}
                  className="rounded-2xl border border-cream-dark bg-cream px-4 py-3.5 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save expense"
                )}
              </button>
            </form>
          </div>

          {/* Habit streak — premium */}
          {isPremium && streak && (
            <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
              <h3 className="font-semibold text-ink mb-4">Habit streak</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div
                  className={`rounded-[20px] p-4 ${streak.logged_today ? "bg-emerald-50" : "bg-cream"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Flame
                      size={16}
                      className={
                        streak.current_streak > 0
                          ? "text-orange-500"
                          : "text-stone"
                      }
                    />
                    <span className="text-xs text-stone">Current</span>
                  </div>
                  <p className="stat-number text-3xl font-semibold text-ink">
                    {streak.current_streak}
                    <span className="text-sm font-normal text-stone">
                      {" "}
                      days
                    </span>
                  </p>
                </div>
                <div className="rounded-[20px] bg-cream p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy size={16} className="text-amber" />
                    <span className="text-xs text-stone">Longest</span>
                  </div>
                  <p className="stat-number text-3xl font-semibold text-ink">
                    {streak.longest_streak}
                    <span className="text-sm font-normal text-stone">
                      {" "}
                      days
                    </span>
                  </p>
                </div>
                <div
                  className={`col-span-2 rounded-[20px] p-4 ${streak.logged_today ? "bg-emerald-50" : "bg-amber-50"}`}
                >
                  {streak.logged_today ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <p className="text-sm font-medium text-emerald-700">
                        Streak maintained today!
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-500" />
                      <p className="text-sm font-medium text-amber-700">
                        Log an expense to keep your streak.
                      </p>
                    </div>
                  )}
                  {streak.missed_days.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {streak.missed_days.slice(0, 5).map((d) => (
                        <Link
                          key={d}
                          to={`/expenses?recover=${d}`}
                          className="rounded-xl bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-200"
                        >
                          {d}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
