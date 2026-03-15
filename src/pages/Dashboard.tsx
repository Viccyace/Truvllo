import { useAuth } from "@/hooks/useAuth";
import { useBudget, useExpenses } from "@/hooks/useBudget";
import {
  useAIAnalyst,
  useAISavingsCoach,
  useAIParseExpense,
  useAICategorise,
  useAIOverspend,
} from "@/hooks/useAI";
import { AppShell } from "@/components/shared/AppShell";
import { PremiumGate } from "@/components/shared/PremiumGate";
import { formatCurrency } from "@/lib/utils/currency";
import {
  getExpectedSpend,
  getSafeToSpend,
  getPaceStatus,
  getHabitStreak,
} from "@/lib/utils/budget";
import { defaultCategories } from "@/lib/constants/categories";
import { supabase } from "@/lib/supabase/client";
import { useState, useRef } from "react";
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
  Brain,
  Sparkles,
  Lightbulb,
  Mic,
  RefreshCw,
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
  const analyst = useAIAnalyst();
  const coach = useAISavingsCoach();
  const parser = useAIParseExpense();
  const categorise = useAICategorise();
  const overspend = useAIOverspend();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [nlText, setNlText] = useState("");

  const [nlSaving, setNlSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().split("T")[0];

  if (!profile) return null;
  const isPremium = profile.plan === "premium" || profile.plan === "business";
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalBudget = Number(budget?.total_amount ?? 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const expected = budget
    ? getExpectedSpend(totalBudget, budget.start_date, budget.end_date)
    : 0;
  const safeToday = budget
    ? getSafeToSpend(totalBudget, totalSpent, budget.end_date)
    : 0;
  const paceStatus = getPaceStatus(totalSpent, expected);
  const streak = budget
    ? getHabitStreak(expenses, budget.start_date, budget.end_date)
    : null;
  const spentPct =
    totalBudget > 0
      ? Math.min(100, Math.round((totalSpent / totalBudget) * 100))
      : 0;
  const expPct =
    totalBudget > 0
      ? Math.min(100, Math.round((expected / totalBudget) * 100))
      : 0;
  const cfg = statusConfig[paceStatus] ?? statusConfig["On track"];
  const StatusIcon = cfg.icon;
  const recent = expenses.slice(0, 5);
  const isOverPace =
    paceStatus === "Over budget risk" || paceStatus === "Slightly over pace";

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

  async function handleNLParse() {
    if (!nlText.trim()) return;
    await parser.parse(nlText);
  }

  async function handleNLSave() {
    if (!parser.parsed || !budget) return;
    setNlSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("expenses").insert({
      user_id: user?.id,
      budget_id: budget.id,
      amount: parser.parsed.amount,
      category: parser.parsed.category,
      note: parser.parsed.note,
      expense_date: parser.parsed.expense_date,
    });
    setNlSaving(false);
    setNlText("");
    parser.setParsed(null);
    reloadExpenses();
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
                sub: budget.timeframe,
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
                      className={`stat-number mt-2 truncate text-xl font-semibold sm:text-2xl ${accent ? "text-white" : "text-ink"}`}
                    >
                      {value}
                    </p>
                    <p
                      className={`mt-1 text-xs capitalize ${accent ? "text-white/50" : "text-stone"}`}
                    >
                      {sub}
                    </p>
                  </div>
                  <div
                    className={`shrink-0 rounded-xl p-2 ${accent ? "bg-white/20" : "bg-cream"}`}
                  >
                    <Icon
                      size={16}
                      className={accent ? "text-white" : "text-forest"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pace card */}
          <div
            className="rounded-[28px] border border-cream-dark bg-white p-5 shadow-soft"
            style={{ borderLeft: "3px solid #2D6A4F" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone">
                  Budget pace
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusIcon size={18} className={cfg.text} />
                  <h3 className="text-lg font-semibold text-ink">
                    {paceStatus}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
                >
                  {spentPct}% used
                </span>
                {isPremium && isOverPace && (
                  <button
                    onClick={() =>
                      overspend.explain(
                        expenses,
                        budget,
                        profile.currency,
                        totalSpent,
                        expected,
                      )
                    }
                    disabled={overspend.loading}
                    className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
                  >
                    {overspend.loading ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Brain size={11} />
                    )}
                    Why?
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-stone">
                <span>Actual</span>
                <span>{spentPct}%</span>
              </div>
              <div className="relative h-2.5 rounded-full bg-cream-dark">
                <div
                  className="absolute top-0 h-2.5 w-0.5 rounded-full bg-stone/40"
                  style={{ left: `${expPct}%` }}
                />
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${cfg.bar}`}
                  style={{ width: `${spentPct}%` }}
                />
              </div>
              <p className="text-xs text-stone">Expected marker: {expPct}%</p>
            </div>
            {/* AI Overspend explanation */}
            {overspend.explanation && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={14} className="text-amber-600 shrink-0" />
                  <p className="text-xs font-semibold text-amber-700">
                    AI Analysis
                  </p>
                </div>
                <p className="text-sm leading-6 text-amber-900">
                  {overspend.explanation}
                </p>
              </div>
            )}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: "Expected by today",
                  val: formatCurrency(expected, profile.currency),
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

          {/* AI Spending Analyst — Premium */}
          <PremiumGate
            feature="AI Spending Analyst"
            isPremium={isPremium}
            hint="Get a plain-English breakdown of where your money is going."
          >
            <div className="rounded-[28px] border border-cream-dark bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-gradient">
                    <Brain size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      AI Spending Analyst
                    </p>
                    <p className="text-xs text-stone">Powered by Claude</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    analyst.analyse(expenses, budget, profile.currency)
                  }
                  disabled={analyst.loading || expenses.length === 0}
                  className="flex items-center gap-1.5 rounded-2xl bg-forest px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50 hover:bg-forest-dark transition"
                >
                  {analyst.loading ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Analysing…
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      Analyse
                    </>
                  )}
                </button>
              </div>
              {analyst.error && (
                <p className="text-sm text-red-500">{analyst.error}</p>
              )}
              {analyst.result ? (
                <div className="rounded-2xl bg-forest/5 p-4 border border-forest/10">
                  <p className="text-sm leading-7 text-ink">{analyst.result}</p>
                </div>
              ) : (
                <p className="text-sm text-stone">
                  {expenses.length === 0
                    ? "Log some expenses first, then run the analyst."
                    : "Click Analyse to get AI insights on your spending."}
                </p>
              )}
            </div>
          </PremiumGate>

          {/* AI Savings Coach — Premium */}
          <PremiumGate
            feature="AI Savings Coach"
            isPremium={isPremium}
            hint="Get a personalised savings tip based on your spending."
          >
            <div className="rounded-[28px] border border-cream-dark bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600">
                    <Lightbulb size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      AI Savings Coach
                    </p>
                    <p className="text-xs text-stone">Weekly tip</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    coach.getTip(expenses, budget, profile.currency)
                  }
                  disabled={coach.loading || expenses.length === 0}
                  className="flex items-center gap-1.5 rounded-2xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50 hover:bg-amber-600 transition"
                >
                  {coach.loading ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Thinking…
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      Get tip
                    </>
                  )}
                </button>
              </div>
              {coach.error && (
                <p className="text-sm text-red-500">{coach.error}</p>
              )}
              {coach.tip ? (
                <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100">
                  <p className="text-sm leading-7 text-amber-900">
                    {coach.tip}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-stone">
                  {expenses.length === 0
                    ? "Log some expenses first."
                    : "Get a personalised savings tip based on your actual spending."}
                </p>
              )}
            </div>
          </PremiumGate>

          {/* Natural Language Expense Entry — Premium */}
          <PremiumGate
            feature="Natural Language Entry"
            isPremium={isPremium}
            hint='Type "spent 3500 on lunch" — AI parses it instantly.'
          >
            <div className="rounded-[28px] border border-cream-dark bg-white p-5 shadow-soft">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600">
                  <Mic size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Natural Language Entry
                  </p>
                  <p className="text-xs text-stone">
                    Just describe what you spent
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  value={nlText}
                  onChange={(e) => {
                    setNlText(e.target.value);
                    parser.setParsed(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleNLParse()}
                  placeholder='e.g. "spent 4500 on groceries yesterday"'
                  className="flex-1 rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                />
                <button
                  onClick={handleNLParse}
                  disabled={parser.loading || !nlText.trim()}
                  className="flex items-center gap-1.5 rounded-2xl bg-sky-500 px-4 py-3 text-xs font-semibold text-white disabled:opacity-50 hover:bg-sky-600 transition"
                >
                  {parser.loading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Brain size={13} />
                  )}
                  Parse
                </button>
              </div>
              {parser.error && (
                <p className="mt-2 text-xs text-red-500">{parser.error}</p>
              )}
              {parser.parsed && !parser.error && (
                <div className="mt-3 rounded-2xl border border-forest/20 bg-forest/5 p-4">
                  <p className="text-xs font-semibold text-forest mb-2.5">
                    Parsed — looks right?
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                    {[
                      [
                        "Amount",
                        formatCurrency(parser.parsed.amount, profile.currency),
                      ],
                      ["Category", parser.parsed.category],
                      ["Note", parser.parsed.note],
                      ["Date", parser.parsed.expense_date],
                    ].map(([l, v]) => (
                      <div key={l} className="rounded-xl bg-white px-3 py-2.5">
                        <p className="text-xs text-stone">{l}</p>
                        <p className="font-semibold text-ink truncate">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={handleNLSave}
                      disabled={nlSaving}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-forest py-2.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {nlSaving ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} />
                          Save expense
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        parser.setParsed(null);
                        setNlText("");
                      }}
                      className="rounded-xl border border-cream-dark px-4 py-2.5 text-xs text-stone hover:bg-cream"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </PremiumGate>

          {/* Quick add + Recent expenses */}
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Quick add */}
            <div className="rounded-[28px] border border-cream-dark bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-ink">Log an expense</h3>
                  <p className="mt-0.5 text-xs text-stone">Quick entry</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-forest/10">
                  <Plus size={16} className="text-forest" />
                </div>
              </div>
              {error && (
                <p className="mb-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}
              {success && (
                <div className="mb-3 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-700">Saved!</p>
                </div>
              )}
              <form
                ref={formRef}
                onSubmit={handleQuickAdd}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    name="amount"
                    type="number"
                    min="0.01"
                    step="any"
                    required
                    inputMode="decimal"
                    placeholder="Amount"
                    className="rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  />
                  <select
                    name="category"
                    required
                    className="rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  >
                    <option value="">Category</option>
                    {defaultCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    name="note"
                    placeholder="Note (optional)"
                    className="rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  />
                  <input
                    name="expense_date"
                    type="date"
                    required
                    defaultValue={today}
                    className="rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save expense"
                  )}
                </button>
              </form>
            </div>

            {/* Recent expenses */}
            <div className="flex flex-col rounded-[28px] border border-cream-dark bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-ink">Recent</h3>
                <Link
                  to="/expenses"
                  className="flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                >
                  All <ArrowRight size={12} />
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
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`shrink-0 rounded-xl px-2 py-0.5 text-xs font-medium ${catColors[e.category] ?? catColors.Other}`}
                        >
                          {e.category}
                        </span>
                        <span className="truncate text-xs text-stone">
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

          {/* Habit streak */}
          {isPremium && streak && (
            <div className="rounded-[28px] border border-cream-dark bg-white p-5 shadow-soft">
              <h3 className="font-semibold text-ink mb-4">Habit streak</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div
                  className={`rounded-[20px] p-4 ${streak.logged_today ? "bg-emerald-50" : "bg-cream"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Flame
                      size={15}
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
                    <Trophy size={15} className="text-amber" />
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
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <p className="text-sm font-medium text-emerald-700">
                        Streak maintained today!
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={15} className="text-amber-500" />
                      <p className="text-sm font-medium text-amber-700">
                        Log an expense to keep your streak.
                      </p>
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
