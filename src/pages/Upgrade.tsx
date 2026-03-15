import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/shared/AppShell";
import { formatPrice } from "@/lib/constants/pricing";
import {
  Check,
  Sparkles,
  Shield,
  Zap,
  BarChart2,
  RefreshCw,
  Download,
  Flame,
  Lock,
  ChevronDown,
  ChevronUp,
  Target,
  Brain,
} from "lucide-react";
import { Navigate } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "6 AI-powered features",
    desc: "Spending analyst, savings coach, natural language entry, budget advisor, and more.",
  },
  {
    icon: Shield,
    title: "Category caps with alerts",
    desc: "Set limits per category. Get warned when approaching the edge.",
  },
  {
    icon: RefreshCw,
    title: "Recurring expense tracking",
    desc: "Set up rent and subscriptions once — reminded every cycle.",
  },
  {
    icon: BarChart2,
    title: "Advanced insights & charts",
    desc: "Pie, bar, and trend charts of your spending.",
  },
  {
    icon: Download,
    title: "Export to CSV",
    desc: "Download your full expense history anytime.",
  },
  {
    icon: Flame,
    title: "Habit streaks & recovery",
    desc: "Track your logging streak and recover missed days.",
  },
  {
    icon: Zap,
    title: "Priority support",
    desc: "Get help faster when you need it.",
  },
  {
    icon: Sparkles,
    title: "Early access to new features",
    desc: "Be first to try everything we ship next.",
  },
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings anytime. You keep access until billing period ends.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We use Paystack — debit card, bank transfer, or USSD. All major banks supported.",
  },
  {
    q: "Will my data be lost if I downgrade?",
    a: "No. All expenses and history are always saved. You just lose Premium features.",
  },
  {
    q: "Is my card information safe?",
    a: "Yes. We never store card details. Paystack is PCI-DSS compliant.",
  },
];

export default function Upgrade() {
  const { profile } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  if (!profile) return null;
  if (profile.plan === "premium" || profile.plan === "business")
    return <Navigate to="/settings" replace />;

  const price = formatPrice(6500, profile.currency);

  async function handleUpgrade() {
    if (!profile) return;
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paystack-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            email: profile.email,
            plan: "premium",
            currency: profile.currency,
            userId: profile.id,
          }),
        },
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // Redirect to Paystack payment page
      window.location.href = data.authorization_url;
    } catch (err: any) {
      alert(`Payment error: ${err.message}`);
      setLoading(false);
    }
  }

  return (
    <AppShell title="Upgrade to Premium" profile={profile}>
      <div className="space-y-6">
        {/* Hero */}
        <div
          className="relative overflow-hidden rounded-[28px] p-8 text-white"
          style={{
            background: "linear-gradient(145deg,#1B4332,#2D6A4F,#40916C)",
          }}
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 left-20 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Premium plan
              </span>
            </div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Take full control of
              <br />
              <em>your finances.</em>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/60">
              Unlock every tool Truvllo has — AI insights, category limits,
              habit tracking, and more.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-end gap-2">
                  <span className="stat-number text-4xl font-semibold">
                    {price}
                  </span>
                  <span className="mb-1 text-sm text-white/40">/ month</span>
                </div>
                <p className="mt-1 text-xs text-white/30">
                  Billed monthly · Cancel anytime
                </p>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-forest-dark transition hover:opacity-90 active:scale-[0.98] disabled:opacity-70 sm:ml-4"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-forest/30 border-t-forest-dark" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Sparkles size={15} className="text-forest" />
                    Upgrade now
                  </>
                )}
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/30">
              <span className="flex items-center gap-1.5">
                <Lock size={11} />
                Secured by Paystack
              </span>
              <span className="flex items-center gap-1.5">
                <Shield size={11} />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={11} />
                Instant activation
              </span>
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4">
            Everything you unlock
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 rounded-[20px] border border-cream-dark bg-white p-4 shadow-soft"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest/10">
                  <Icon size={17} className="text-forest" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-stone">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4">
            Basic vs Premium
          </h3>
          <div className="overflow-hidden rounded-[24px] border border-cream-dark">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-cream-dark bg-cream">
                  <th className="px-5 py-4 text-left font-semibold text-stone">
                    Feature
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-stone">
                    Basic
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-forest">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Daily expense logging", true, true],
                  ["Budget pace", true, true],
                  ["Safe-to-spend forecast", true, true],
                  ["Unlimited budgets", true, true],
                  ["Category caps & alerts", false, true],
                  ["Recurring expenses", false, true],
                  ["Advanced charts", false, true],
                  ["CSV export", false, true],
                  ["6 AI features", false, true],
                  ["Habit streaks", false, true],
                ].map(([label, basic, premium]) => (
                  <tr
                    key={String(label)}
                    className="border-t border-cream-dark hover:bg-cream"
                  >
                    <td className="px-5 py-3.5 font-medium text-ink">
                      {label}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {typeof basic === "boolean" ? (
                        basic ? (
                          <Check
                            size={16}
                            className="mx-auto text-emerald-500"
                          />
                        ) : (
                          <span className="text-stone">—</span>
                        )
                      ) : (
                        <span className="font-semibold text-stone">
                          {basic}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {typeof premium === "boolean" ? (
                        premium ? (
                          <Check size={16} className="mx-auto text-forest" />
                        ) : (
                          <span className="text-stone">—</span>
                        )
                      ) : (
                        <span className="font-semibold text-forest">
                          {premium}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4">
            Common questions
          </h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[20px] border border-cream-dark bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-ink">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="shrink-0 text-stone" />
                  ) : (
                    <ChevronDown size={16} className="shrink-0 text-stone" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="border-t border-cream-dark px-5 py-4">
                    <p className="text-sm leading-6 text-stone">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="rounded-[28px] p-8 text-center text-white"
          style={{ background: "linear-gradient(135deg,#1B4332,#40916C)" }}
        >
          <h3 className="font-display text-2xl font-semibold">
            Ready to upgrade?
          </h3>
          <p className="mt-2 text-sm text-white/70">
            Join users who budget smarter with Truvllo Premium.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-forest-dark transition hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
          >
            <Sparkles size={15} className="text-forest" />
            Upgrade — {price}/mo
          </button>
          <p className="mt-3 text-xs text-white/40">
            No commitment. Cancel anytime.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
