import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CurrencyCode } from "@/types";
import { ArrowRight, Check } from "lucide-react";

const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "NGN", label: "Nigerian Naira", symbol: "₦" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "KES", label: "Kenyan Shilling", symbol: "KSh" },
  { code: "GHS", label: "Ghanaian Cedi", symbol: "₵" },
];

const categories = [
  "Food",
  "Transport",
  "Housing",
  "Health",
  "Education",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Savings",
  "Other",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");
  const [budgetName, setBudgetName] = useState("My Budget");
  const [amount, setAmount] = useState("");
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFinish() {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter a valid budget amount");
      return;
    }
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const today = new Date();
    const end = new Date(today);
    if (timeframe === "monthly") end.setMonth(end.getMonth() + 1);
    else end.setDate(end.getDate() + 7);

    const startDate = today.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    // Update profile currency
    await supabase
      .from("profiles")
      .update({ currency, onboarding_completed: true })
      .eq("id", user.id);

    // Create first budget
    const { error: budgetErr } = await supabase.from("budgets").insert({
      user_id: user.id,
      name: budgetName,
      total_amount: parseFloat(amount),
      timeframe,
      start_date: startDate,
      end_date: endDate,
      is_active: true,
    });

    if (budgetErr) {
      setError(budgetErr.message);
      setLoading(false);
      return;
    }
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-all ${s <= step ? "bg-forest" : "bg-white/10"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Welcome
              {profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
              ! 👋
            </h1>
            <p className="mt-3 text-white/50">
              Let's set up your account in 3 quick steps.
            </p>
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-white/70">
                What's your currency?
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      currency === c.code
                        ? "border-forest bg-forest/20 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <span className="text-lg font-bold">{c.symbol}</span>
                    <div>
                      <p className="text-sm font-semibold">{c.code}</p>
                      <p className="text-xs text-white/40">{c.label}</p>
                    </div>
                    {currency === c.code && (
                      <Check size={14} className="ml-auto text-forest-light" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-forest py-4 font-semibold text-white transition hover:bg-forest-dark"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Set your budget
            </h1>
            <p className="mt-3 text-white/50">
              How much do you want to spend this{" "}
              {timeframe === "monthly" ? "month" : "week"}?
            </p>
            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Budget name
                </label>
                <input
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none focus:border-forest"
                  placeholder="e.g. Monthly Budget"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Timeframe
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["monthly", "weekly"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`rounded-2xl border py-3.5 text-sm font-semibold capitalize transition ${
                        timeframe === t
                          ? "border-forest bg-forest/20 text-white"
                          : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Total amount
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="1"
                  inputMode="decimal"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-2xl font-semibold text-white outline-none focus:border-forest stat-number"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-2xl border border-white/10 px-6 py-4 text-sm font-semibold text-white/50 hover:border-white/20"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!amount) {
                    setError("Enter an amount");
                    return;
                  }
                  setError("");
                  setStep(3);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-forest py-4 font-semibold text-white hover:bg-forest-dark"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              You're all set! 🎉
            </h1>
            <p className="mt-3 text-white/50">
              Here's a summary of your setup.
            </p>
            <div className="mt-8 space-y-3">
              {[
                [
                  "Currency",
                  currencies.find((c) => c.code === currency)?.label ??
                    currency,
                ],
                ["Budget name", budgetName],
                [
                  "Amount",
                  `${currencies.find((c) => c.code === currency)?.symbol}${parseFloat(amount).toLocaleString()}`,
                ],
                [
                  "Timeframe",
                  timeframe.charAt(0).toUpperCase() + timeframe.slice(1),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <span className="text-sm text-white/50">{label}</span>
                  <span className="text-sm font-semibold text-white">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="rounded-2xl border border-white/10 px-6 py-4 text-sm font-semibold text-white/50 hover:border-white/20"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-forest py-4 font-semibold text-white hover:bg-forest-dark disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />{" "}
                    Setting up…
                  </>
                ) : (
                  <>
                    Start budgeting <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
