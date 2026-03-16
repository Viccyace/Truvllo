import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Zap,
  Sparkles,
  Shield,
  RefreshCw,
  Download,
  Flame,
  Target,
  AlertTriangle,
  MessageSquare,
  Star,
  Check,
  Play,
  X,
} from "lucide-react";

const features = [
  {
    icon: Wallet2,
    title: "Budget-first setup",
    copy: "Set a weekly or monthly budget in your currency. Edit anytime as life changes.",
    gradient: "from-forest-dark to-forest",
  },
  {
    icon: Brain,
    title: "AI Spending Analyst",
    copy: "Get a plain-English breakdown of where your money is going and what to do about it.",
    gradient: "from-forest to-forest-light",
  },
  {
    icon: Zap,
    title: "Budget pace engine",
    copy: "See if you are ahead, on track, or overspending — before the month ends.",
    gradient: "from-amber-700 to-amber",
  },
  {
    icon: RefreshCw,
    title: "Recurring expenses",
    copy: "Set up rent and subscriptions once. Get prompted to log them automatically each cycle.",
    gradient: "from-forest-dark to-forest",
  },
  {
    icon: Shield,
    title: "Category caps",
    copy: "Set spending limits per category and get instant alerts when you are approaching the cap.",
    gradient: "from-forest to-forest-light",
  },
  {
    icon: Download,
    title: "Export & reports",
    copy: "Download your full expense history as CSV anytime.",
    gradient: "from-amber-700 to-amber",
  },
];

function Wallet2({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
      <path
        d="M16 12a1 1 0 100-2 1 1 0 000 2z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

const aiFeatures = [
  {
    icon: Brain,
    title: "AI Spending Analyst",
    desc: "Plain-English breakdown of your spending patterns.",
    tag: "Insights",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Entry",
    desc: 'Type "spent 3500 on lunch" — AI parses it instantly.',
    tag: "Expenses",
  },
  {
    icon: Zap,
    title: "Smart Categorisation",
    desc: "Type a merchant name and AI suggests the right category.",
    tag: "Expenses",
  },
  {
    icon: Sparkles,
    title: "AI Savings Coach",
    desc: "Personalised weekly tip based on your actual spending data.",
    tag: "Dashboard",
  },
  {
    icon: Target,
    title: "AI Budget Advisor",
    desc: "Tell AI your income and it suggests a realistic budget.",
    tag: "Budget",
  },
  {
    icon: AlertTriangle,
    title: "Overspending Explainer",
    desc: "When over pace, AI explains why and suggests specific cuts.",
    tag: "Dashboard",
  },
];

const testimonials = [
  {
    name: "Adaeze Okafor",
    role: "Freelance Designer, Lagos",
    initials: "AO",
    color: "bg-forest",
    text: "I used to run out of money before month-end. Truvllo showed me I was spending ₦40,000 on food monthly. Cut it down in two weeks.",
  },
  {
    name: "Emeka Nwosu",
    role: "Software Engineer, Abuja",
    initials: "EN",
    color: "bg-forest-dark",
    text: "The AI analyst told me my transport costs spike every Friday. I switched to carpooling and saved ₦12,000 last month.",
  },
  {
    name: "Fatima Aliyu",
    role: "Teacher, Kano",
    initials: "FA",
    color: "bg-amber-700",
    text: "Truvllo is the only app that tells me what I can spend TODAY. That one number changed everything.",
  },
  {
    name: "Chidi Obi",
    role: "Business owner, Port Harcourt",
    initials: "CO",
    color: "bg-forest",
    text: "Category caps stopped me from overspending on entertainment three months in a row.",
  },
  {
    name: "Ngozi Eze",
    role: "Nurse, Enugu",
    initials: "NE",
    color: "bg-forest-dark",
    text: "My husband and I argued about money every month. Now I just show him the dashboard. Numbers don't lie.",
  },
  {
    name: "Tunde Adeyemi",
    role: "Graduate student, Ibadan",
    initials: "TA",
    color: "bg-amber-700",
    text: "As a student on a tight budget, the safe-to-spend number is the only thing I check every morning.",
  },
];

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-cream-dark bg-ink">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          <img src="/logo-light.svg" className="h-8 w-auto" alt="Truvllo" />
          <nav className="hidden items-center gap-1 md:flex">
            {[
              ["Features", "#features"],
              ["AI", "#ai"],
              ["Pricing", "/pricing"],
              ["Blog", "/blog"],
            ].map(([label, href]) =>
              href.startsWith("#") ? (
                <a
                  key={label}
                  href={href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition"
                >
                  {label}
                </Link>
              ),
            )}
            <a
              href="#ai"
              className="flex items-center gap-1.5 rounded-full border border-forest-light/40 bg-forest/20 px-4 py-2 text-sm font-medium text-forest-light hover:bg-forest/30 transition"
            >
              <Brain size={13} /> AI Features
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-semibold text-white/60 hover:text-white sm:block transition"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-dark active:scale-[0.98]"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-ink pt-20 pb-0 text-white md:pt-28">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(250,248,243,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(250,248,243,.5) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-forest/20 blur-3xl opacity-60" />
          <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-forest-light/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex justify-center md:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-forest-light/30 bg-forest/20 px-4 py-2 text-sm font-medium text-white/90">
                <Brain size={14} className="text-forest-light" />
                AI-powered budget intelligence
                <span className="h-1.5 w-1.5 rounded-full bg-forest-light pulse-dot" />
              </span>
            </div>

            <div className="mt-8 grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">
                  Spend with{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #40916C, #95D5B2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    clarity
                  </span>
                  ,<br />
                  not guesswork.
                </h1>
                <p className="mt-6 max-w-md text-lg leading-8 text-white/65">
                  Set a budget, log expenses in seconds, and let AI tell you
                  exactly where your money is going — before it's too late.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "AI Spending Analyst",
                    "Smart Categorisation",
                    "AI Savings Coach",
                  ].map((f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/70"
                    >
                      <Zap size={10} className="text-forest-light" /> {f}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/signup"
                    className="group flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-semibold text-white transition hover:bg-forest-dark active:scale-[0.98]"
                  >
                    Start for free{" "}
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                  <button
                    onClick={() => setShowDemo(true)}
                    className="flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white/90 transition hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
                  >
                    <Play size={15} className="text-forest-light" /> See demo
                  </button>
                </div>
                <div className="mt-10 flex items-center gap-4 text-sm text-white/40">
                  <div className="flex -space-x-2">
                    {[
                      "#2D6A4F",
                      "#1B4332",
                      "#40916C",
                      "#D4A017",
                      "#0A0A0A",
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-ink"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <span>Join users worldwide tracking smarter</span>
                </div>
              </div>

              {/* Dashboard mock */}
              <div className="relative">
                <div className="absolute -left-4 top-36 z-20 hidden max-w-[175px] rounded-2xl border border-white/10 bg-ink/90 p-3 shadow-xl backdrop-blur md:block animate-float">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Brain size={13} className="text-forest-light shrink-0" />
                    <span className="text-xs font-semibold text-white">
                      AI Insight
                    </span>
                  </div>
                  <p className="text-xs leading-4 text-white/70">
                    You spend 40% more on food on weekends. Try meal prepping.
                  </p>
                </div>

                <div
                  className="rounded-[32px] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur"
                  style={{
                    background: "rgba(10,10,10,0.75)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/40">
                        Monthly budget
                      </p>
                      <p className="stat-number mt-1.5 text-4xl font-semibold text-white">
                        ₦150,000
                      </p>
                    </div>
                    <span className="rounded-full bg-forest/30 px-3 py-1.5 text-xs font-semibold text-forest-light">
                      On track
                    </span>
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[38%] rounded-full bg-forest-gradient" />
                  </div>
                  <p className="mt-2 text-xs text-white/40">
                    38% used · 18 days remaining
                  </p>
                  <div className="mt-5 space-y-2.5">
                    {[
                      ["Safe to spend today", "₦3,200", "text-forest-light"],
                      ["Expected by today", "₦57,000", "text-white"],
                      ["Actual spent", "₦56,200", "text-white"],
                    ].map(([l, v, c]) => (
                      <div
                        key={l}
                        className="flex items-center justify-between rounded-2xl bg-white/6 px-4 py-3"
                      >
                        <span className="text-sm text-white/50">{l}</span>
                        <span
                          className={`stat-number text-sm font-semibold ${c}`}
                        >
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-forest-light/20 bg-forest/15 px-3 py-2.5">
                    <Brain size={13} className="text-forest-light shrink-0" />
                    <p className="text-xs text-forest-light">
                      AI analysed your spending — tap to see insights
                    </p>
                  </div>
                </div>

                <div
                  className="absolute -right-4 bottom-10 z-20 hidden rounded-2xl border border-white/10 bg-ink p-3 shadow-xl md:block animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        7 day streak
                      </p>
                      <p className="text-xs text-white/40">Keep it up!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-20 h-12 overflow-hidden">
              <svg
                viewBox="0 0 1440 48"
                className="absolute bottom-0 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z"
                  fill="#FAF8F3"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-block rounded-full border border-forest/20 bg-forest/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
                Features
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                A tracker that feels active, not passive
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-stone">
                Every part of Truvllo is designed to make budgeting clearer and
                easier to maintain.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, copy, gradient }) => (
                <article
                  key={title}
                  className="card-hover group relative overflow-hidden rounded-[28px] border border-cream-dark bg-white p-7 shadow-soft"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity group-hover:opacity-[0.04]`}
                  />
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient}`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-stone">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* AI Section */}
        <section id="ai" className="bg-ink py-24 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-forest-light/30 bg-forest/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest-light">
                <Brain size={12} /> Powered by Claude AI
              </span>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Not just a tracker.
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #40916C, #95D5B2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  An AI financial companion.
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/50">
                Every Premium account includes 6 AI features built on Claude.
                Works in any currency, any country. Your data stays private.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {aiFeatures.map(({ icon: Icon, title, desc, tag }) => (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-white/4 p-6 transition hover:bg-white/8 hover:border-white/15"
                >
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-forest/20 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-gradient">
                        <Icon size={18} className="text-white" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs text-white/40">
                        {tag}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/50">
                      {desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10 flex items-center justify-center gap-3 rounded-[20px] border border-white/8 bg-white/4 px-6 py-4">
              <Sparkles size={15} className="text-forest-light shrink-0" />
              <p className="text-sm text-white/50">
                AI features are on{" "}
                <span className="font-semibold text-white">Premium</span>. Your
                data is never shared or used to train AI models.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-block rounded-full border border-forest/20 bg-forest/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
                Real users
              </span>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                People taking <em>control</em>
                <br className="hidden sm:block" /> of their money
              </h2>
              <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-cream-dark bg-white px-5 py-2.5 shadow-soft">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber text-amber" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-ink">4.9 / 5</span>
                <span className="text-sm text-stone">· 500+ users</span>
              </div>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-start">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="card-hover rounded-[24px] border border-cream-dark bg-white p-6 shadow-soft"
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className="fill-amber text-amber"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-stone">
                    "{t.text}"
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${t.color} text-sm font-bold text-white`}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{t.name}</p>
                      <p className="text-xs text-stone">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Join them — it's free
              </Link>
              <p className="mt-3 text-xs text-stone">
                No credit card needed. Start in under 2 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* App Preview Section */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block rounded-full border border-forest/20 bg-forest/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
                Live preview
              </span>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                See it before you <em>sign up</em>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-stone">
                This is your actual dashboard — with real data, real AI, real
                pace tracking.
              </p>
            </div>

            {/* Fake browser window */}
            <div className="relative mx-auto max-w-4xl">
              {/* Glow behind */}
              <div className="absolute -inset-4 rounded-[40px] bg-forest/10 blur-3xl" />

              {/* Browser chrome */}
              <div className="relative overflow-hidden rounded-[24px] border border-stone/20 shadow-[0_32px_80px_rgba(10,10,10,0.15)]">
                {/* Browser top bar */}
                <div className="flex items-center gap-3 bg-[#F0EDE4] px-4 py-3 border-b border-stone/10">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2 rounded-lg bg-white/80 px-4 py-1.5 text-xs text-stone border border-stone/10">
                      <div className="h-2.5 w-2.5 rounded-full bg-forest/60" />
                      truvllo.app/dashboard
                    </div>
                  </div>
                </div>

                {/* App UI mockup */}
                <div
                  className="bg-cream p-4 sm:p-5"
                  style={{ minHeight: "420px" }}
                >
                  <div className="flex gap-4">
                    {/* Sidebar — desktop only */}
                    <div className="hidden sm:flex w-44 shrink-0 flex-col rounded-[20px] bg-ink p-4 gap-2">
                      <div className="mb-2 h-5 w-20 rounded-lg bg-white/20" />
                      <div className="rounded-xl bg-white/8 p-2.5 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-forest-light" />
                        <div className="h-2 w-16 rounded bg-white/60" />
                      </div>
                      {["w-14", "w-16", "w-12", "w-16", "w-14"].map((w, i) => (
                        <div
                          key={i}
                          className="rounded-xl p-2.5 flex items-center gap-2"
                        >
                          <div className="h-2 w-2 rounded-full bg-white/20" />
                          <div className={`h-2 ${w} rounded bg-white/20`} />
                        </div>
                      ))}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="mb-3">
                        <div className="h-2 w-24 rounded-full bg-forest/40 mb-1.5" />
                        <div className="h-5 w-32 rounded-lg bg-ink/80" />
                      </div>

                      {/* Summary cards */}
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                          {
                            label: "Total budget",
                            val: "₦150,000",
                            sub: "monthly",
                            dark: false,
                          },
                          {
                            label: "Total spent",
                            val: "₦87,500",
                            sub: "58% used",
                            dark: false,
                          },
                          {
                            label: "Remaining",
                            val: "₦62,500",
                            sub: "42% left",
                            dark: false,
                          },
                          {
                            label: "Safe today",
                            val: "₦3,200",
                            sub: "Spend freely",
                            dark: true,
                          },
                        ].map(({ label, val, sub, dark }) => (
                          <div
                            key={label}
                            className={`rounded-[16px] p-3 ${dark ? "text-white" : "bg-white border border-cream-dark"}`}
                            style={
                              dark
                                ? {
                                    background:
                                      "linear-gradient(135deg,#1B4332,#40916C)",
                                  }
                                : {}
                            }
                          >
                            <p
                              className={`text-[9px] font-semibold uppercase tracking-wide mb-1 ${dark ? "text-white/50" : "text-stone"}`}
                            >
                              {label}
                            </p>
                            <p
                              className={`text-sm font-bold stat-number ${dark ? "text-white" : "text-ink"}`}
                            >
                              {val}
                            </p>
                            <p
                              className={`text-[9px] mt-0.5 capitalize ${dark ? "text-white/40" : "text-stone"}`}
                            >
                              {sub}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Pace card */}
                      <div
                        className="rounded-[20px] bg-white border border-cream-dark p-4"
                        style={{ borderLeft: "3px solid #2D6A4F" }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-wide text-stone mb-1">
                              Budget pace
                            </p>
                            <div className="flex items-center gap-1.5">
                              <div className="h-3 w-3 rounded-full bg-emerald-500" />
                              <p className="text-sm font-semibold text-ink">
                                On track
                              </p>
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">
                            58% used
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-cream-dark relative">
                          <div
                            className="absolute top-0 h-2 w-0.5 bg-stone/30 rounded-full"
                            style={{ left: "55%" }}
                          />
                          <div
                            className="h-2 rounded-full bg-forest-gradient"
                            style={{ width: "58%" }}
                          />
                        </div>
                        <p className="text-[9px] text-stone mt-1">
                          Expected 55% · Actual 58%
                        </p>
                      </div>

                      {/* AI insight card */}
                      <div className="rounded-[20px] bg-white border border-cream-dark p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-xl bg-forest-gradient flex items-center justify-center">
                              <Brain size={12} className="text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-ink">
                                AI Spending Analyst
                              </p>
                              <p className="text-[9px] text-stone">
                                Powered by Claude
                              </p>
                            </div>
                          </div>
                          <div className="rounded-xl bg-forest px-2.5 py-1 text-[9px] font-semibold text-white flex items-center gap-1">
                            <Sparkles size={8} /> Analyse
                          </div>
                        </div>
                        <div className="rounded-xl bg-forest/5 border border-forest/10 p-2.5">
                          <p className="text-[10px] leading-4 text-ink">
                            Your top spending is Food at ₦39,500 — 45% of total.
                            Transport is second at ₦14,300. You're slightly
                            ahead of pace — good work! 🎯
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA overlay */}
              <div className="mt-8 text-center">
                <p className="mt-3 text-xs text-stone">
                  No account needed · See real features · Takes 30 seconds
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-block rounded-full border border-forest/20 bg-forest/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
                How it works
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Three steps to total money clarity
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                [
                  "01",
                  "Set your budget",
                  "Choose amount, timeframe, and currency. Done in 2 minutes.",
                  "from-forest-dark to-forest",
                ],
                [
                  "02",
                  "Log spending daily",
                  "Add expenses in seconds with quick-add. Category, amount, note — done.",
                  "from-forest to-forest-light",
                ],
                [
                  "03",
                  "See your pace",
                  "Know if you're ahead, on track, or overspending — and your safe daily spend.",
                  "from-amber-700 to-amber",
                ],
              ].map(([num, title, copy, gradient]) => (
                <article
                  key={num}
                  className="group relative overflow-hidden rounded-[32px] bg-ink p-8 text-white transition hover:-translate-y-1"
                >
                  <div
                    className={`absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-35`}
                  />
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-sm font-bold text-white`}
                  >
                    {num}
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-ink py-24 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <span className="inline-block rounded-full border border-forest-light/30 bg-forest/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest-light">
                Pricing
              </span>
              <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
                Simple, honest pricing
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/50">
                Start free forever. Upgrade when you need the full power of AI
                and advanced tools.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {/* Basic */}
              <div className="flex flex-col rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:border-white/20 hover:bg-white/8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Basic
                </p>
                <div className="mt-4">
                  <span className="text-5xl font-semibold text-white">
                    Free
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/40">
                  No credit card needed
                </p>
                <div className="my-6 h-px bg-white/10" />
                <ul className="flex-1 space-y-3.5">
                  {[
                    "Unlimited budgets",
                    "Daily expense logging",
                    "Budget pace indicator",
                    "Safe-to-spend forecast",
                    "Simple cycle summaries",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-sm text-white/70"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-white/50">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className="mt-8 block rounded-2xl border border-white/20 px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Get started free
                </Link>
              </div>

              {/* Premium — featured */}
              <div
                className="relative flex flex-col rounded-[32px] p-8"
                style={{
                  background:
                    "linear-gradient(145deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)",
                }}
              >
                {/* Glow */}
                <div className="absolute inset-0 rounded-[32px] shadow-[0_0_60px_rgba(64,145,108,0.35)]" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber px-5 py-1.5 text-xs font-bold text-ink">
                  ✦ 7-day free trial
                </div>
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    Premium
                  </p>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="stat-number text-5xl font-semibold text-white">
                      ₦6,500
                    </span>
                    <span className="mb-1.5 text-sm text-white/50">
                      / month
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/50">
                    Billed in your local currency
                  </p>
                  <div className="my-6 h-px bg-white/20" />
                  <ul className="flex-1 space-y-3.5">
                    {[
                      "Everything in Basic",
                      "Unlimited budgets",
                      "Safe-to-spend forecast",
                      "Category caps with alerts",
                      "Recurring expense tracking",
                      "Advanced insights & charts",
                      "Export to CSV",
                      "Habit streaks & recovery",
                      "6 AI-powered features",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 text-sm text-white/90"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs text-white">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className="mt-8 block rounded-2xl bg-white px-5 py-3.5 text-center text-sm font-bold text-forest-dark transition hover:opacity-90 active:scale-[0.98]"
                  >
                    Start free — 7-day trial
                  </Link>
                </div>
              </div>

              {/* Business — coming soon */}
              <div className="relative flex flex-col rounded-[32px] border border-white/8 bg-white/3 p-8 opacity-70">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-5 py-1.5 text-xs font-semibold text-white/50 backdrop-blur flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber/60" />{" "}
                  Coming soon
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                  Business
                </p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="stat-number text-5xl font-semibold text-white/30">
                    ₦15,000
                  </span>
                  <span className="mb-1.5 text-sm text-white/25">/ month</span>
                </div>
                <p className="mt-2 text-sm text-white/25">
                  For teams & small businesses
                </p>
                <div className="my-6 h-px bg-white/8" />
                <ul className="flex-1 space-y-3.5">
                  {[
                    "Everything in Premium",
                    "Up to 5 team members",
                    "Shared business budgets",
                    "Role-based access",
                    "Expense approval workflow",
                    "Department spend reports",
                    "VAT-ready expense tagging",
                    "Priority support",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-sm text-white/30"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-white/20">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className="mt-8 block w-full cursor-not-allowed rounded-2xl border border-white/10 px-5 py-3.5 text-center text-sm font-semibold text-white/25"
                >
                  Coming soon
                </button>
              </div>
            </div>

            {/* Bottom note */}
            <p className="mt-10 text-center text-sm text-white/30">
              7-day Premium trial unlocks automatically when you log your first
              expense. No card needed. Payments via Paystack.
            </p>
          </div>
        </section>
      </main>

      {/* Demo video modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            onClick={() => setShowDemo(false)}
          />
          <div className="relative w-full max-w-3xl rounded-[28px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex items-center justify-between bg-ink px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest">
                  <Play size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Truvllo Demo
                  </p>
                  <p className="text-xs text-white/40">See how it works</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemo(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video area */}
            <div className="relative bg-ink/95 aspect-video flex items-center justify-center">
              {/* Replace src with your video URL when ready */}
              <video
                src="/demo.mp4"
                controls
                autoPlay
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide video and show placeholder if file not found
                  (e.target as HTMLVideoElement).style.display = "none";
                  document.getElementById("demo-placeholder")!.style.display =
                    "flex";
                }}
              />
              {/* Placeholder — shown when video not uploaded yet */}
              <div
                id="demo-placeholder"
                className="absolute inset-0 flex-col items-center justify-center gap-4 bg-ink/95 hidden"
                style={{ display: "flex" }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/20 border border-forest/30">
                  <Play size={28} className="text-forest-light ml-1" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">
                    Demo video coming soon
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Add your video file to{" "}
                    <code className="text-forest-light">public/demo.mp4</code>
                  </p>
                </div>
                <Link
                  to="/signup"
                  onClick={() => setShowDemo(false)}
                  className="mt-2 flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark transition"
                >
                  Try it free instead <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between bg-ink/95 border-t border-white/8 px-5 py-3">
              <p className="text-xs text-white/30">
                No credit card needed to get started
              </p>
              <Link
                to="/signup"
                onClick={() => setShowDemo(false)}
                className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-white hover:bg-forest-dark transition"
              >
                Start free <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-cream-dark bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          {/* Mobile */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <img src="/logo-light.svg" className="h-8 w-auto" alt="Truvllo" />
              <div className="flex gap-2">
                {["Secure", "No ads"].map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-white/12 px-2.5 py-1 text-xs text-white/40"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/8 pt-6">
              {[
                [
                  "Product",
                  [
                    ["Features", "#features"],
                    ["Pricing", "/pricing"],
                    ["Blog", "/blog"],
                  ],
                ],
                [
                  "Account",
                  [
                    ["Sign up", "/signup"],
                    ["Log in", "/login"],
                  ],
                ],
                [
                  "Legal",
                  [
                    ["Privacy", "/privacy"],
                    ["Terms", "/terms"],
                  ],
                ],
              ].map(([group, items]) => (
                <div key={group as string}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/30">
                    {group as string}
                  </p>
                  <ul className="space-y-2">
                    {(items as string[][]).map(([label, href]) => (
                      <li key={label}>
                        {href.startsWith("/") ? (
                          <Link
                            to={href}
                            className="text-xs text-white/50 hover:text-white"
                          >
                            {label}
                          </Link>
                        ) : (
                          <a
                            href={href}
                            className="text-xs text-white/50 hover:text-white"
                          >
                            {label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-white/8 pt-4 text-xs text-white/25">
              &copy; {new Date().getFullYear()} Truvllo. All rights reserved.
            </p>
          </div>

          {/* Desktop */}
          <div className="hidden md:grid gap-12 md:grid-cols-[1.8fr_repeat(3,1fr)]">
            <div>
              <img src="/logo-light.svg" className="h-8 w-auto" alt="Truvllo" />
              <p className="mt-4 max-w-xs text-sm leading-7 text-white/45">
                A spending tracker built for people who want budget clarity
                without spreadsheet complexity.
              </p>
              <div className="mt-6 flex gap-3">
                {["Secure", "No ads", "Privacy first"].map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/40"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <p className="mt-8 text-xs text-white/25">
                &copy; {new Date().getFullYear()} Truvllo. All rights reserved.
              </p>
            </div>
            {[
              [
                "Product",
                [
                  ["Features", "#features"],
                  ["How it works", "#how-it-works"],
                  ["Pricing", "/pricing"],
                  ["Blog", "/blog"],
                ],
              ],
              [
                "Account",
                [
                  ["Sign up", "/signup"],
                  ["Log in", "/login"],
                  ["Settings", "/settings"],
                ],
              ],
              [
                "Legal",
                [
                  ["Privacy policy", "/privacy"],
                  ["Terms of use", "/terms"],
                ],
              ],
            ].map(([group, items]) => (
              <div key={group as string}>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                  {group as string}
                </p>
                <ul className="space-y-3">
                  {(items as string[][]).map(([label, href]) => (
                    <li key={label}>
                      {href.startsWith("/") ? (
                        <Link
                          to={href}
                          className="text-sm text-white/50 hover:text-white"
                        >
                          {label}
                        </Link>
                      ) : (
                        <a
                          href={href}
                          className="text-sm text-white/50 hover:text-white"
                        >
                          {label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
