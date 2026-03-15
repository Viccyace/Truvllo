import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/shared/AppShell";
import { supabase } from "@/lib/supabase/client";
import { CurrencyCode } from "@/types";
import { formatPrice } from "@/lib/constants/pricing";
import { Check, Loader2, Sparkles, Bell, BellOff } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePush";
import { Link } from "react-router-dom";

const currencies: { code: CurrencyCode; label: string }[] = [
  { code: "NGN", label: "Nigerian Naira (₦)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "KES", label: "Kenyan Shilling (KSh)" },
  { code: "GHS", label: "Ghanaian Cedi (₵)" },
];

export default function Settings() {
  const { profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(profile?.full_name ?? "");
  const [currency, setCurrency] = useState<CurrencyCode>(
    (profile?.currency ?? "NGN") as CurrencyCode,
  );
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  // Handle Paystack redirect back after payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "true") {
      // Clear cached profile to reload with premium plan
      localStorage.removeItem("truvllo_profile");
      window.history.replaceState({}, "", "/settings");
    }
  }, []);
  const push = usePushNotifications();

  if (!profile) return null;
  const isPremium = profile?.plan === "premium" || profile?.plan === "business";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    const { error: err } = await supabase
      .from("profiles")
      .update({ full_name: name, currency })
      .eq("id", profile?.id ?? "");
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (pwForm.next !== pwForm.confirm) {
      setPwError("Passwords do not match");
      return;
    }
    if (pwForm.next.length < 6) {
      setPwError("Password must be at least 6 characters");
      return;
    }
    setPwSaving(true);
    const { error: err } = await supabase.auth.updateUser({
      password: pwForm.next,
    });
    setPwSaving(false);
    if (err) {
      setPwError(err.message);
      return;
    }
    setPwSuccess(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwSuccess(false), 3000);
  }

  return (
    <AppShell title="Settings" profile={profile}>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        {/* Profile form */}
        <div className="space-y-5">
          <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
            <h3 className="font-semibold text-ink mb-5">Profile</h3>
            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}
              {success && (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3">
                  <Check size={15} className="text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-700">Saved!</p>
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone">
                  Email
                </label>
                <input
                  value={profile.email}
                  disabled
                  className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm text-stone outline-none opacity-60"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-2xl bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}{" "}
                Save changes
              </button>
            </form>
          </div>

          {/* Password */}
          <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
            <h3 className="font-semibold text-ink mb-5">Change password</h3>
            <form onSubmit={handlePassword} className="space-y-4">
              {pwError && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {pwError}
                </p>
              )}
              {pwSuccess && (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3">
                  <Check size={15} className="text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-700">
                    Password updated!
                  </p>
                </div>
              )}
              {[
                ["New password", "next", "new-password"],
                ["Confirm password", "confirm", "new-password"],
              ].map(([label, key, ac]) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-medium text-stone">
                    {label}
                  </label>
                  <input
                    type="password"
                    value={pwForm[key as keyof typeof pwForm]}
                    autoComplete={ac}
                    onChange={(e) =>
                      setPwForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={pwSaving}
                className="flex items-center gap-2 rounded-2xl bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {pwSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}{" "}
                Update password
              </button>
            </form>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest/10">
              <Bell size={16} className="text-forest" />
            </div>
            <h3 className="font-semibold text-ink">Daily reminders</h3>
          </div>
          {!push.supported ? (
            <p className="text-sm text-stone">
              Push notifications are not supported in your browser.
            </p>
          ) : push.permission === "denied" ? (
            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">
                Notifications blocked
              </p>
              <p className="mt-1 text-xs text-red-600">
                Enable notifications in your browser settings to use this
                feature.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-stone leading-6">
                Get a daily reminder at 8pm to log your expenses and keep your
                streak alive.
              </p>
              <div className="flex items-center justify-between rounded-2xl bg-cream p-4">
                <div className="flex items-center gap-3">
                  {push.isEnabled ? (
                    <Bell size={16} className="text-forest" />
                  ) : (
                    <BellOff size={16} className="text-stone" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-ink">
                      Daily reminder
                    </p>
                    <p className="text-xs text-stone">
                      {push.isEnabled ? "Enabled — 8:00 PM daily" : "Disabled"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={
                    push.isEnabled
                      ? push.disableNotifications
                      : push.requestPermission
                  }
                  className={`rounded-2xl px-4 py-2 text-xs font-semibold transition ${push.isEnabled ? "bg-cream-dark text-stone hover:bg-red-50 hover:text-red-600" : "bg-forest text-white hover:bg-forest-dark"}`}
                >
                  {push.isEnabled ? "Turn off" : "Turn on"}
                </button>
              </div>
              {push.isEnabled && (
                <button
                  onClick={push.sendTestNotification}
                  className="text-xs text-forest hover:underline"
                >
                  Send a test notification
                </button>
              )}
            </div>
          )}
        </div>

        {/* Plan card */}
        <div className="rounded-[28px] overflow-hidden">
          <div
            className="p-6 text-white"
            style={{ background: "linear-gradient(145deg,#0A0A0A,#1C1C1C)" }}
          >
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                  Current plan
                </p>
                <h2 className="mt-1.5 text-3xl font-semibold capitalize">
                  {profile.plan}
                </h2>
              </div>
              {isPremium && (
                <span className="rounded-full bg-forest px-3 py-1.5 text-xs font-semibold text-white">
                  Active
                </span>
              )}
            </div>

            {!isPremium ? (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-5">
                  <p className="stat-number text-lg font-semibold text-white">
                    {formatPrice(6500, profile.currency)}
                    <span className="text-sm font-normal text-white/40">
                      {" "}
                      / month
                    </span>
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    Billed in {profile.currency}
                  </p>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {[
                    "Category caps & alerts",
                    "Recurring expense tracking",
                    "Advanced charts",
                    "Export to CSV",
                    "Habit streaks",
                    "AI Spending Analyst",
                    "AI Savings Coach",
                    "Natural Language Entry",
                    "AI Budget Advisor",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-white/70"
                    >
                      <Check size={14} className="shrink-0 text-forest-light" />{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/upgrade"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-forest py-3.5 text-sm font-semibold text-white transition hover:bg-forest-dark"
                >
                  <Sparkles size={15} /> Upgrade to Premium
                </Link>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-white/60">
                  You're on {profile.plan}. All features unlocked.
                </p>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="stat-number text-sm font-semibold text-white">
                    {formatPrice(6500, profile.currency)} / month
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
