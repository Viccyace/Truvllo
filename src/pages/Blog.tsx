import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Tag, Search, ArrowLeft } from "lucide-react";
import logoLight from "/logo-light.svg";
import logoDark from "/logo-dark.svg";

const posts = [
  {
    slug: "budget-pace-what-it-means",
    title: "Budget Pace: The One Number That Changes How You Spend",
    excerpt:
      "Most budget apps tell you what you spent. Budget pace tells you if you're spending too fast. Here's why that difference matters.",
    category: "Budgeting",
    readTime: "4 min read",
    date: "March 10, 2026",
    featured: true,
    content: `
Most budget apps show you a simple number: you've spent ₦45,000 out of ₦150,000. That's 30%. But is that good or bad? Without context, you have no idea.

That's where budget pace comes in.

## What is budget pace?

Budget pace is the relationship between how much you've spent and how much time has passed. If you're 10 days into a 30-day budget, you should have spent roughly one-third of your total budget. If you've spent more than that, you're over pace. If you've spent less, you're ahead.

It sounds simple. But most people never think about spending this way — and it costs them.

## Why it matters

Say you get paid on the 1st. By the 15th, you've spent 70% of your budget. You still have two weeks left, but only 30% of your money. Without budget pace, you might look at that number and think "I still have money left." With budget pace, you immediately see the problem.

This is the insight that changes behaviour. Not "how much have I spent?" but "am I spending at the right speed?"

## How Truvllo uses it

Every time you open your dashboard, you see your pace status — Ahead of plan, On track, Slightly over pace, or Over budget risk. The green progress bar shows your actual spending. The grey marker shows where you should be based on the date.

When you're over the marker, you know to slow down. When you're under it, you know you have breathing room.

## Safe-to-spend

Pace also powers the safe-to-spend number — the single daily figure that tells you exactly how much you can spend today without going over budget. No mental math. No spreadsheets. Just one number.

Start paying attention to your pace, not just your total. It's the difference between running out of money on the 25th and making it to the end of the month with something left over.
    `,
  },
  {
    slug: "daily-logging-beats-monthly-reviews",
    title: "Why Daily Expense Logging Beats Monthly Reviews",
    excerpt:
      "Reviewing your spending at the end of the month is like reading a post-mortem. Daily logging lets you actually change the outcome.",
    category: "Habits",
    readTime: "3 min read",
    date: "March 5, 2026",
    featured: false,
    content: `
There's a common approach to personal finance: ignore your spending all month, then do a big review at the end to see where the money went. This feels responsible. It's actually useless.

By the time you review, the money is gone. You can feel bad about it, but you can't change it.

## The case for daily logging

When you log an expense the moment it happens — or at the end of each day — something different occurs. You become aware of your spending while you can still do something about it.

That ₦8,000 you spent on takeout tonight looks different when you also remember you spent ₦6,000 on takeout two days ago. Together they're ₦14,000 on food in three days. That awareness, in the moment, changes what you do tomorrow.

## The friction problem

The main reason people don't log daily is friction. Opening an app, navigating to expenses, entering details — it adds up. This is why Truvllo has a quick-add form directly on the dashboard: amount, category, note, date. Four fields. Ten seconds.

Premium users can also use natural language entry: just type "spent 4500 on food" and the AI parses it automatically.

## The streak effect

There's another reason daily logging works: streaks. When you've logged for 12 consecutive days, you don't want to break that streak. The habit reinforces itself. Missing a day feels wrong.

That's not a trick. That's how habits actually form — through consistent small actions, not big monthly reviews.

Log today. It takes 10 seconds. Do it again tomorrow.
    `,
  },
  {
    slug: "realistic-monthly-budget-nigeria",
    title: "How to Set a Realistic Monthly Budget in Nigeria",
    excerpt:
      "Setting a budget that's too tight guarantees failure. Here's a practical framework for budgeting in naira that actually works.",
    category: "Guides",
    readTime: "6 min read",
    date: "February 28, 2026",
    featured: false,
    content: `
Most budgeting advice comes from Western sources that assume stable income, cheap rent, and predictable prices. Nigeria is different. Here's how to build a budget that actually works for Nigerian realities.

## Start with what you actually earn

Don't budget based on your salary. Budget based on what hits your account after taxes and deductions. If your salary is ₦350,000 but you take home ₦290,000, your budget starts at ₦290,000.

If your income is irregular — freelance work, business revenue, commissions — use your lowest month from the last three as your baseline. Budget conservatively and let any extra become savings.

## The Nigerian expense categories

Standard budgeting categories don't quite fit. Here's a more realistic breakdown:

**Housing** — rent, service charge, generator fuel, internet. In Lagos, this often runs 40-50% of income for many people. That's high by global standards but it's the reality.

**Food** — groceries, market runs, and yes, the occasional takeout or restaurant meal. Be honest about this one. Most people underestimate food spending by 30-40%.

**Transport** — fuel, Uber/Bolt, danfo, bus. Highly variable depending on your location and work situation.

**Utilities** — PHCN bills, generator maintenance, water.

**Airtime and data** — this is a real line item in Nigeria, not a rounding error.

**Savings** — treat this like a bill. Pay it first, not last.

**Everything else** — entertainment, clothing, personal care, miscellaneous.

## The 50/30/20 rule — adapted

The classic rule (50% needs, 30% wants, 20% savings) needs adjustment for Nigeria. A more realistic starting point:

- 60% needs (housing, food, transport, utilities)
- 20% wants (entertainment, dining out, lifestyle)
- 20% savings and investments

If your housing costs are particularly high, you may need to compress wants to 10-15% to make it work.

## Use a tracker from day one

The biggest mistake is setting a budget and then not tracking it. A budget without tracking is just a wish. Use Truvllo, a spreadsheet, anything — but track every naira.

The goal isn't perfection. The goal is awareness. When you know where your money is going, you can start making different choices.
    `,
  },
  {
    slug: "safe-to-spend-explained",
    title: "Safe to Spend: Your Daily Money Number",
    excerpt:
      "One number, updated daily, that tells you exactly how much you can spend without going over budget. Here's how it works.",
    category: "Features",
    readTime: "3 min read",
    date: "February 20, 2026",
    featured: false,
    content: `
What if you only had to check one number every morning to know if you could afford something today?

That's exactly what the safe-to-spend number does.

## How it's calculated

Safe-to-spend takes your remaining budget and divides it by the number of days left in your budget cycle. That's it.

If you have ₦60,000 remaining and 15 days left, your safe-to-spend is ₦4,000 per day. Spend less than that today and you're on track. Spend more and you're borrowing from tomorrow.

## Why it's more useful than your remaining balance

Your remaining balance tells you how much you have left. Safe-to-spend tells you how fast you can spend it. These are very different things.

₦60,000 remaining sounds comfortable. But if you only have 5 days left, that's actually ₦12,000 per day — which might be fine, or might be tight, depending on your plans.

## Checking it daily

The habit that works best: check your safe-to-spend first thing in the morning, the same way you might check the weather before deciding what to wear. It takes two seconds and it anchors your spending decisions for the entire day.

Some Truvllo users call it their "spending weather" — some days are clear and open, some days require more care.
    `,
  },
  {
    slug: "ai-budgeting-nigeria",
    title: "What AI Can (and Can't) Do for Your Budget",
    excerpt:
      "AI in personal finance is real and useful — but it's not magic. Here's an honest look at what AI budgeting tools actually do.",
    category: "AI & Finance",
    readTime: "5 min read",
    date: "February 12, 2026",
    featured: false,
    content: `
AI is everywhere in finance right now, and most of it is hype. But some of it is genuinely useful — if you understand what it can and can't do.

## What AI actually does well

**Pattern recognition.** AI is very good at finding patterns in your spending data that you might miss. "You spend 60% more on weekends." "Your food spending spikes in the last week of the month." "You've exceeded your entertainment budget 4 months in a row." These observations exist in your data — AI just surfaces them faster than you would.

**Natural language parsing.** Instead of filling out a form, you can type "spent 3500 on lunch with client" and the AI extracts the amount, category, and note automatically. This removes friction from daily logging.

**Personalised suggestions.** When an AI savings coach sees your specific spending breakdown, it can give more relevant advice than generic tips. "Cut your transport spending" is useless. "You spend ₦18,000 on Bolt monthly — carpooling twice a week could save ₦6,000" is actionable.

## What AI can't do

**Make decisions for you.** AI can tell you that you're overspending on food. It cannot make you cook at home instead of ordering out. The insight is only as useful as what you do with it.

**Know your full context.** AI doesn't know that you spent more on food last month because your sister visited. It doesn't know that your transport costs spiked because your car broke down. Human context always matters.

**Replace financial planning.** For complex situations — investments, debt management, business finances — you need a qualified human advisor, not an AI chatbot.

## The honest use case

AI budgeting tools work best as an analyst and a coach — surfacing insights from your data and nudging you toward better habits. That's genuinely useful. Just don't expect it to solve money problems that require human decisions and discipline.

Truvllo uses Claude AI for exactly this: analysing your spending, explaining overspending, and giving personalised savings tips. It's a tool, not a solution.
    `,
  },
];

const categories = [
  "All",
  ...Array.from(new Set(posts.map((p) => p.category))),
];

function PostCard({
  post,
  featured = false,
}: {
  post: (typeof posts)[0];
  featured?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <article className="col-span-full">
        <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft sm:p-8">
          <button
            onClick={() => setOpen(false)}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-forest hover:underline"
          >
            <ArrowLeft size={15} /> Back to blog
          </button>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
              {post.category}
            </span>
            <span className="text-xs text-stone">{post.date}</span>
            <span className="flex items-center gap-1 text-xs text-stone">
              <Clock size={11} />
              {post.readTime}
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            {post.title}
          </h1>
          <div className="prose mt-6 max-w-none">
            {post.content
              .trim()
              .split("\n")
              .map((line, i) => {
                if (line.startsWith("## "))
                  return (
                    <h2
                      key={i}
                      className="mt-8 mb-3 font-display text-2xl font-semibold text-ink"
                    >
                      {line.slice(3)}
                    </h2>
                  );
                if (line.startsWith("**") && line.endsWith("**"))
                  return (
                    <p key={i} className="mt-4 font-semibold text-ink">
                      {line.slice(2, -2)}
                    </p>
                  );
                if (line.trim() === "") return <div key={i} className="h-3" />;
                return (
                  <p key={i} className="text-base leading-8 text-stone">
                    {line}
                  </p>
                );
              })}
          </div>
          <div className="mt-10 rounded-[20px] bg-forest-gradient p-6 text-white text-center">
            <p className="font-display text-xl font-semibold">
              Ready to take control of your budget?
            </p>
            <p className="mt-2 text-sm text-white/70">
              Start free — no credit card needed.
            </p>
            <Link
              to="/signup"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-forest-dark hover:opacity-90 transition"
            >
              Get started free <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (featured) {
    return (
      <article
        className="col-span-full cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="group relative overflow-hidden rounded-[28px] bg-ink p-8 text-white shadow-card transition hover:-translate-y-1 sm:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-forest/20 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-forest/30 px-3 py-1 text-xs font-semibold text-forest-light">
                {post.category}
              </span>
              <span className="rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold text-amber">
                Featured
              </span>
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Clock size={11} />
                {post.readTime}
              </span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              {post.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/60">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-forest-light group-hover:gap-3 transition-all">
              Read article <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="cursor-pointer card-hover"
      onClick={() => setOpen(true)}
    >
      <div className="flex h-full flex-col rounded-[24px] border border-cream-dark bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full bg-forest/10 px-2.5 py-1 text-xs font-semibold text-forest">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-stone">
            <Clock size={10} />
            {post.readTime}
          </span>
        </div>
        <h2 className="font-display text-lg font-semibold text-ink leading-snug flex-1">
          {post.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-stone line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-stone">{post.date}</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-forest">
            Read <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = posts.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (!search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase())),
  );

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-cream-dark bg-ink">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          <Link to="/">
            <img src={logoLight} className="h-8 w-auto" alt="Truvllo" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-semibold text-white/60 hover:text-white sm:block"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark transition"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block rounded-full border border-forest/20 bg-forest/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
            Blog
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Budget smarter.
            <br />
            <em>Spend with clarity.</em>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-stone">
            Practical guides on budgeting, habits, and making your money work
            for you.
          </p>
        </div>

        {/* Search + filter */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-2xl border border-cream-dark bg-white py-3 pl-9 pr-4 text-sm outline-none focus:border-forest"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === c ? "bg-ink text-white" : "border border-cream-dark bg-white text-stone hover:border-stone"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-stone">
              No articles found. Try a different search.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured && <PostCard post={featured} featured />}
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-[28px] bg-ink p-8 text-center text-white sm:p-12">
          <h2 className="font-display text-3xl font-semibold">
            Ready to budget with clarity?
          </h2>
          <p className="mt-3 text-white/60">
            Join users who track smarter with Truvllo — free to start.
          </p>
          <Link
            to="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 text-sm font-semibold text-white hover:bg-forest-dark transition"
          >
            Start for free <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-dark bg-ink py-8 text-center">
        <Link to="/">
          <img src={logoLight} className="mx-auto h-7 w-auto" alt="Truvllo" />
        </Link>
        <p className="mt-4 text-xs text-white/30">
          &copy; {new Date().getFullYear()} Truvllo. All rights reserved.
        </p>
        <div className="mt-3 flex justify-center gap-6 text-xs text-white/40">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <Link to="/signup" className="hover:text-white">
            Sign up
          </Link>
          <Link to="/login" className="hover:text-white">
            Log in
          </Link>
        </div>
      </footer>
    </div>
  );
}
