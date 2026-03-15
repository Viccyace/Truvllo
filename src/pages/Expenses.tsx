import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBudget, useExpenses, useRecurring } from "@/hooks/useBudget";
import { AppShell } from "@/components/shared/AppShell";
import { formatCurrency } from "@/lib/utils/currency";
import { defaultCategories } from "@/lib/constants/categories";
import { supabase } from "@/lib/supabase/client";
import { Expense } from "@/types";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Download,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";

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

export default function Expenses() {
  const { profile } = useAuth();
  const { budget } = useBudget();
  const { expenses, reload, setExpenses } = useExpenses(budget?.id ?? null);
  const { items: recurring, reload: reloadRecurring } = useRecurring(
    budget?.id ?? null,
  );
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [logged, setLogged] = useState<string[]>([]);
  const today = new Date().toISOString().split("T")[0];

  if (!profile) return null;
  const isPremium = profile.plan === "premium" || profile.plan === "business";

  const filtered = expenses.filter((e) => {
    const s = search.toLowerCase();
    return (
      (!s ||
        (e.note ?? "").toLowerCase().includes(s) ||
        e.category.toLowerCase().includes(s)) &&
      (!catFilter || e.category === catFilter)
    );
  });

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: err } = await supabase.from("expenses").insert({
      user_id: user?.id,
      budget_id: budget?.id,
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
    setShowAdd(false);
    reload();
    (e.target as HTMLFormElement).reset();
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await supabase
      .from("expenses")
      .update({
        amount: parseFloat(fd.get("amount") as string),
        category: fd.get("category") as string,
        note: (fd.get("note") as string) || null,
        expense_date: fd.get("expense_date") as string,
      })
      .eq("id", id);
    setSaving(false);
    setEditingId(null);
    reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this expense?")) return;
    await supabase.from("expenses").delete().eq("id", id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  async function handleLogRecurring(item: (typeof recurring)[0]) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("expenses").insert({
      user_id: user?.id,
      budget_id: budget?.id,
      amount: item.amount,
      category: item.category,
      note: `Recurring: ${item.title}`,
      expense_date: today,
    });
    setLogged((p) => [...p, item.id]);
    reload();
  }

  async function handleDeleteRecurring(id: string) {
    await supabase
      .from("recurring_expenses")
      .update({ is_active: false })
      .eq("id", id);
    reloadRecurring();
  }

  function exportCSV() {
    const rows = [
      ["Date", "Category", "Amount", "Note"],
      ...expenses.map((e) => [
        e.expense_date,
        e.category,
        String(e.amount),
        e.note ?? "",
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${budget?.name ?? "expenses"}.csv`;
    a.click();
  }

  return (
    <AppShell
      title="Expenses"
      profile={profile}
      subtitle={`${expenses.length} expense${expenses.length !== 1 ? "s" : ""} this cycle`}
    >
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses…"
              className="w-full rounded-2xl border border-cream-dark bg-cream py-3 pl-9 pr-4 text-sm outline-none focus:border-forest focus:bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-3 text-sm font-medium transition ${showFilters ? "border-forest bg-forest/8 text-forest" : "border-cream-dark text-stone hover:border-stone"}`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          {isPremium ? (
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 rounded-2xl border border-cream-dark px-3.5 py-3 text-sm font-medium text-stone hover:border-stone transition"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export</span>
            </button>
          ) : (
            <Link
              to="/upgrade"
              className="flex items-center gap-1.5 rounded-2xl border border-cream-dark px-3.5 py-3 text-sm font-medium text-stone hover:border-forest hover:text-forest transition"
            >
              <Lock size={13} />
              <span className="hidden sm:inline">Export</span>
            </Link>
          )}
          <button
            onClick={() => setShowAdd((v) => !v)}
            className={`flex items-center gap-1.5 rounded-2xl px-4 py-3 text-sm font-semibold transition ${showAdd ? "bg-cream-dark text-ink" : "bg-ink text-white hover:opacity-90"}`}
          >
            {showAdd ? <X size={15} /> : <Plus size={15} />}
            <span>{showAdd ? "Cancel" : "Add"}</span>
          </button>
        </div>

        {/* Filters row */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-cream-dark bg-cream p-3">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="rounded-xl border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-forest"
            >
              <option value="">All categories</option>
              {defaultCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {catFilter && (
              <button
                onClick={() => setCatFilter("")}
                className="flex items-center gap-1 rounded-xl border border-cream-dark bg-white px-3 py-2 text-xs text-stone hover:text-ink"
              >
                <X size={12} />
                Clear
              </button>
            )}
            <span className="ml-auto text-xs text-stone">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Add form */}
        {showAdd && (
          <form
            onSubmit={handleAdd}
            className="space-y-3 rounded-[24px] border border-forest/20 bg-forest/5 p-5"
          >
            <p className="text-sm font-semibold text-forest mb-1">
              New expense
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-stone">
                  Amount
                </label>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="any"
                  required
                  placeholder="0.00"
                  inputMode="decimal"
                  className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 text-sm outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 text-sm outline-none focus:border-forest"
                >
                  <option value="">Select…</option>
                  {defaultCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-stone">
                  Note (optional)
                </label>
                <input
                  name="note"
                  placeholder="e.g. Lunch at KFC"
                  className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 text-sm outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone">
                  Date
                </label>
                <input
                  name="expense_date"
                  type="date"
                  required
                  defaultValue={today}
                  className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 text-sm outline-none focus:border-forest"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest py-3.5 text-sm font-semibold text-white disabled:opacity-60"
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
        )}

        {/* Mobile card list */}
        <div className="space-y-2.5 md:hidden">
          {filtered.length === 0 ? (
            <div className="rounded-[24px] bg-cream py-14 text-center">
              <p className="text-sm font-medium text-stone">No expenses yet</p>
              <p className="mt-1 text-xs text-stone/60">
                Tap <strong>Add</strong> above to log your first one
              </p>
            </div>
          ) : (
            filtered.map((exp) =>
              editingId === exp.id ? (
                <form
                  key={exp.id}
                  onSubmit={(e) => handleEdit(e, exp.id)}
                  className="space-y-2.5 rounded-[20px] border border-forest/20 bg-forest/5 p-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="amount"
                      type="number"
                      defaultValue={exp.amount}
                      required
                      className="rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
                    />
                    <select
                      name="category"
                      defaultValue={exp.category}
                      required
                      className="rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
                    >
                      {defaultCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="note"
                      defaultValue={exp.note ?? ""}
                      placeholder="Note"
                      className="rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
                    />
                    <input
                      name="expense_date"
                      type="date"
                      defaultValue={exp.expense_date}
                      required
                      className="rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-forest py-2.5 text-sm font-semibold text-white"
                    >
                      <Check size={14} />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-cream-dark py-2.5 text-sm text-stone"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  key={exp.id}
                  className="flex items-center justify-between gap-3 rounded-[20px] border border-cream-dark bg-white p-4 shadow-soft"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`shrink-0 rounded-xl px-2.5 py-1 text-xs font-medium ${catColors[exp.category] ?? catColors.Other}`}
                    >
                      {exp.category}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {exp.note ?? "—"}
                      </p>
                      <p className="text-xs text-stone">{exp.expense_date}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="stat-number text-sm font-semibold text-ink">
                      {formatCurrency(Number(exp.amount), profile.currency)}
                    </span>
                    <button
                      onClick={() => setEditingId(exp.id)}
                      className="rounded-lg p-1.5 text-stone hover:bg-cream hover:text-ink"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="rounded-lg p-1.5 text-stone hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ),
            )
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-[24px] border border-cream-dark md:block">
          {filtered.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm font-medium text-stone">No expenses yet</p>
              <p className="mt-1 text-xs text-stone/60">
                Click <strong>Add</strong> to log your first expense
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead className="bg-cream text-xs font-semibold uppercase tracking-wide text-stone">
                <tr>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Note</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((exp) =>
                  editingId === exp.id ? (
                    <tr
                      key={exp.id}
                      className="border-t border-cream-dark bg-cream/50"
                    >
                      <td colSpan={5} className="px-5 py-3">
                        <form
                          onSubmit={(e) => handleEdit(e, exp.id)}
                          className="flex flex-wrap gap-2"
                        >
                          <input
                            name="expense_date"
                            type="date"
                            defaultValue={exp.expense_date}
                            required
                            className="rounded-xl border border-cream-dark px-3 py-2 text-sm outline-none focus:border-forest"
                          />
                          <select
                            name="category"
                            defaultValue={exp.category}
                            required
                            className="rounded-xl border border-cream-dark px-3 py-2 text-sm outline-none focus:border-forest"
                          >
                            {defaultCategories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <input
                            name="note"
                            defaultValue={exp.note ?? ""}
                            placeholder="Note"
                            className="rounded-xl border border-cream-dark px-3 py-2 text-sm outline-none focus:border-forest"
                          />
                          <input
                            name="amount"
                            type="number"
                            defaultValue={exp.amount}
                            required
                            className="w-28 rounded-xl border border-cream-dark px-3 py-2 text-sm outline-none focus:border-forest"
                          />
                          <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-white"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-xl border border-cream-dark px-4 py-2 text-sm text-stone"
                          >
                            Cancel
                          </button>
                        </form>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={exp.id}
                      className="border-t border-cream-dark hover:bg-cream/50 transition"
                    >
                      <td className="px-5 py-4 text-sm text-stone">
                        {exp.expense_date}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-xl px-2.5 py-1 text-xs font-medium ${catColors[exp.category] ?? catColors.Other}`}
                        >
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-stone">
                        {exp.note ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-ink stat-number">
                        {formatCurrency(Number(exp.amount), profile.currency)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingId(exp.id)}
                            className="flex items-center gap-1 rounded-xl border border-cream-dark px-3 py-1.5 text-xs font-medium text-stone hover:bg-cream"
                          >
                            <Pencil size={11} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="flex items-center gap-1 rounded-xl border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={11} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Recurring expenses — premium only */}
        {budget && (
          <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ink">Recurring expenses</h3>
              {isPremium ? (
                <Link
                  to="/budget"
                  className="flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                >
                  Manage <Plus size={12} />
                </Link>
              ) : (
                <Link
                  to="/upgrade"
                  className="flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest/20"
                >
                  <Lock size={11} />
                  Premium
                </Link>
              )}
            </div>
            {!isPremium ? (
              <div className="rounded-2xl border border-cream-dark bg-cream p-5 text-center">
                <p className="text-sm text-stone">
                  Recurring expense tracking is a Premium feature.
                </p>
                <Link
                  to="/upgrade"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-2xl bg-ink px-5 py-2.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  Upgrade to unlock
                </Link>
              </div>
            ) : recurring.length === 0 ? (
              <p className="text-sm text-stone">
                No recurring expenses set up yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recurring.map((item) => {
                  const due = item.next_due_date <= today;
                  const didLog = logged.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between gap-3 rounded-[20px] p-4 ${due && !didLog ? "bg-amber-50 border border-amber-200" : "bg-cream"}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <RefreshCw
                          size={15}
                          className={`shrink-0 ${due && !didLog ? "text-amber-500" : "text-stone"}`}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">
                            {item.title}
                          </p>
                          <p className="text-xs text-stone">
                            {item.category} · {item.frequency} · due{" "}
                            {item.next_due_date}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="stat-number text-sm font-semibold text-ink">
                          {formatCurrency(item.amount, profile.currency)}
                        </span>
                        {due && !didLog && (
                          <button
                            onClick={() => handleLogRecurring(item)}
                            className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            Log now
                          </button>
                        )}
                        {didLog && (
                          <CheckCircle2
                            size={16}
                            className="text-emerald-500"
                          />
                        )}
                        <button
                          onClick={() => handleDeleteRecurring(item.id)}
                          className="text-stone hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
