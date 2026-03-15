import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBudget, useExpenses, useCategoryCaps } from "@/hooks/useBudget";
import { AppShell } from "@/components/shared/AppShell";
import { PremiumGate } from "@/components/shared/PremiumGate";
import { formatCurrency } from "@/lib/utils/currency";
import { defaultCategories } from "@/lib/constants/categories";
import { supabase } from "@/lib/supabase/client";
import {
  Plus,
  Trash2,
  Loader2,
  Check,
  Edit2,
  X,
  Target,
  Brain,
  Sparkles,
} from "lucide-react";
import { useAIBudgetAdvisor } from "@/hooks/useAI";

export default function Budget() {
  const { profile } = useAuth();
  const { budget, reload } = useBudget();
  const { expenses } = useExpenses(budget?.id ?? null);
  const { caps, reload: reloadCaps } = useCategoryCaps(budget?.id ?? null);
  const [editingBudget, setEditingBudget] = useState(false);
  const [showAddCap, setShowAddCap] = useState(false);
  const [showNewBudget, setShowNewBudget] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiIncome, setAiIncome] = useState("");
  const [aiGoal, setAiGoal] = useState("");
  const [aiTimeframe, setAiTimeframe] = useState("monthly");
  const advisor = useAIBudgetAdvisor();
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  if (!profile) return null;
  const isPremium = profile.plan === "premium" || profile.plan === "business";

  const spentMap: Record<string, number> = {};
  expenses.forEach((e) => {
    spentMap[e.category] = (spentMap[e.category] ?? 0) + Number(e.amount);
  });

  async function handleUpdateBudget(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    if (!budget) return;
    const fd = new FormData(e.currentTarget);
    const { error: err } = await supabase
      .from("budgets")
      .update({
        name: fd.get("name") as string,
        total_amount: parseFloat(fd.get("total_amount") as string),
        end_date: fd.get("end_date") as string,
      })
      .eq("id", budget.id);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setEditingBudget(false);
    reload();
  }

  async function handleNewBudget(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // Deactivate current
    if (budget)
      await supabase
        .from("budgets")
        .update({ is_active: false })
        .eq("id", budget.id);
    const { error: err } = await supabase.from("budgets").insert({
      user_id: user?.id,
      name: fd.get("name") as string,
      total_amount: parseFloat(fd.get("total_amount") as string),
      timeframe: fd.get("timeframe") as string,
      start_date: fd.get("start_date") as string,
      end_date: fd.get("end_date") as string,
      is_active: true,
    });
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setShowNewBudget(false);
    reload();
  }

  async function handleAddCap(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("category_caps").insert({
      user_id: user?.id,
      budget_id: budget?.id,
      name: fd.get("name") as string,
      limit_amount: parseFloat(fd.get("limit_amount") as string),
    });
    setSaving(false);
    setShowAddCap(false);
    reloadCaps();
    (e.target as HTMLFormElement).reset();
  }

  async function handleDeleteCap(id: string) {
    await supabase.from("category_caps").delete().eq("id", id);
    reloadCaps();
  }

  return (
    <AppShell title="Budget" profile={profile}>
      <div className="space-y-5">
        {/* Current budget */}
        {budget ? (
          <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone">
                  Active budget
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-ink">
                  {budget.name}
                </h2>
              </div>
              <button
                onClick={() => setEditingBudget((v) => !v)}
                className="flex items-center gap-1.5 rounded-2xl border border-cream-dark px-3 py-2 text-sm text-stone hover:border-forest hover:text-forest transition"
              >
                {editingBudget ? (
                  <>
                    <X size={14} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 size={14} />
                    Edit
                  </>
                )}
              </button>
            </div>

            {editingBudget ? (
              <form onSubmit={handleUpdateBudget} className="space-y-3">
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone">
                      Budget name
                    </label>
                    <input
                      name="name"
                      defaultValue={budget.name}
                      required
                      className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone">
                      Total amount
                    </label>
                    <input
                      name="total_amount"
                      type="number"
                      defaultValue={budget.total_amount}
                      required
                      className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone">
                      End date
                    </label>
                    <input
                      name="end_date"
                      type="date"
                      defaultValue={budget.end_date}
                      required
                      className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}{" "}
                  Save changes
                </button>
              </form>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  [
                    "Total amount",
                    formatCurrency(
                      Number(budget.total_amount),
                      profile.currency,
                    ),
                  ],
                  ["Start date", budget.start_date],
                  ["End date", budget.end_date],
                  ["Timeframe", budget.timeframe],
                  [
                    "Total spent",
                    formatCurrency(
                      expenses.reduce((s, e) => s + Number(e.amount), 0),
                      profile.currency,
                    ),
                  ],
                  [
                    "Remaining",
                    formatCurrency(
                      Math.max(
                        0,
                        Number(budget.total_amount) -
                          expenses.reduce((s, e) => s + Number(e.amount), 0),
                      ),
                      profile.currency,
                    ),
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-cream p-4">
                    <p className="text-xs font-medium text-stone">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-ink capitalize">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[28px] bg-cream py-12 text-center">
            <p className="text-stone mb-4">No active budget.</p>
            <button
              onClick={() => setShowNewBudget(true)}
              className="rounded-2xl bg-ink px-6 py-3 text-sm font-semibold text-white"
            >
              Create budget
            </button>
          </div>
        )}

        {/* New budget form */}
        {(showNewBudget || !budget) && (
          <div className="rounded-[28px] border border-forest/20 bg-white p-6 shadow-soft">
            <h3 className="font-semibold text-ink mb-4">
              {budget ? "Start a new budget" : "Create your first budget"}
            </h3>
            <form onSubmit={handleNewBudget} className="space-y-3">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone">
                    Budget name
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="My Budget"
                    className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone">
                    Total amount
                  </label>
                  <input
                    name="total_amount"
                    type="number"
                    required
                    min="1"
                    placeholder="0"
                    className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone">
                    Timeframe
                  </label>
                  <select
                    name="timeframe"
                    className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone">
                    Start date
                  </label>
                  <input
                    name="start_date"
                    type="date"
                    required
                    defaultValue={today}
                    className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone">
                    End date
                  </label>
                  <input
                    name="end_date"
                    type="date"
                    required
                    className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                {budget && (
                  <button
                    type="button"
                    onClick={() => setShowNewBudget(false)}
                    className="rounded-2xl border border-cream-dark px-5 py-3 text-sm text-stone"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-forest py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}{" "}
                  Create budget
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category caps */}
        {budget && (
          <PremiumGate
            feature="Category caps with alerts"
            isPremium={isPremium}
          >
            <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-ink">Category caps</h3>
                <button
                  onClick={() => setShowAddCap((v) => !v)}
                  className="flex items-center gap-1.5 rounded-2xl bg-forest px-3 py-2 text-xs font-semibold text-white"
                >
                  <Plus size={13} /> Add cap
                </button>
              </div>
              {showAddCap && (
                <form
                  onSubmit={handleAddCap}
                  className="mb-4 grid gap-3 rounded-2xl border border-cream-dark bg-cream p-4 sm:grid-cols-3"
                >
                  <select
                    name="name"
                    required
                    className="rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-forest"
                  >
                    <option value="">Category</option>
                    {defaultCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    name="limit_amount"
                    type="number"
                    min="1"
                    required
                    placeholder="Cap amount"
                    className="rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-forest"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </form>
              )}
              {caps.length === 0 && !showAddCap ? (
                <p className="text-sm text-stone">
                  No caps set. Add one to track category limits.
                </p>
              ) : (
                <div className="space-y-3">
                  {caps.map((cap) => {
                    const spent = spentMap[cap.name] ?? 0;
                    const pct = Math.min(
                      100,
                      Math.round((spent / cap.limit_amount) * 100),
                    );
                    const over = spent > cap.limit_amount;
                    return (
                      <div
                        key={cap.id}
                        className={`rounded-[20px] p-4 ${over ? "bg-red-50 border border-red-200" : "bg-cream"}`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="truncate text-sm font-medium text-ink">
                              {cap.name}
                            </span>
                            {over && (
                              <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                                Over cap!
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={`text-sm font-semibold ${over ? "text-red-600" : "text-stone"}`}
                            >
                              {formatCurrency(spent, profile.currency)} /{" "}
                              {formatCurrency(
                                cap.limit_amount,
                                profile.currency,
                              )}
                            </span>
                            <button
                              onClick={() => handleDeleteCap(cap.id)}
                              className="text-stone hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-white">
                          <div
                            className={`h-2 rounded-full transition-all ${over ? "bg-red-400" : "bg-forest"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        {over && (
                          <p className="mt-2 text-xs font-medium text-red-600">
                            Over by{" "}
                            {formatCurrency(
                              spent - cap.limit_amount,
                              profile.currency,
                            )}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </PremiumGate>
        )}

        {/* AI Budget Advisor */}
        <PremiumGate
          feature="AI Budget Advisor"
          isPremium={isPremium}
          hint="Tell AI your income and it suggests a realistic budget."
        >
          <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600">
                <Target size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  AI Budget Advisor
                </p>
                <p className="text-xs text-stone">
                  Get a personalised budget suggestion
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone">
                    Your {aiTimeframe} income
                  </label>
                  <input
                    value={aiIncome}
                    onChange={(e) => setAiIncome(e.target.value)}
                    type="number"
                    placeholder="0"
                    inputMode="decimal"
                    className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone">
                    Timeframe
                  </label>
                  <select
                    value={aiTimeframe}
                    onChange={(e) => setAiTimeframe(e.target.value)}
                    className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone">
                  Financial goal
                </label>
                <input
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  placeholder='e.g. "Save for a trip to Dubai in 6 months"'
                  className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:bg-white"
                />
              </div>
              <button
                onClick={() =>
                  advisor.getAdvice(
                    parseFloat(aiIncome),
                    aiGoal,
                    profile.currency,
                    aiTimeframe,
                  )
                }
                disabled={advisor.loading || !aiIncome || !aiGoal}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-violet-700 transition"
              >
                {advisor.loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Thinking…
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Get AI advice
                  </>
                )}
              </button>
            </div>
            {advisor.error && (
              <p className="mt-3 text-sm text-red-500">{advisor.error}</p>
            )}
            {advisor.advice && (
              <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={14} className="text-violet-600 shrink-0" />
                  <p className="text-xs font-semibold text-violet-700">
                    AI Recommendation
                  </p>
                </div>
                <p className="text-sm leading-7 text-violet-900 whitespace-pre-wrap">
                  {advisor.advice}
                </p>
              </div>
            )}
          </div>
        </PremiumGate>
      </div>
    </AppShell>
  );
}
