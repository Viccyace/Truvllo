import { useAuth } from "@/hooks/useAuth";
import { useBudget, useExpenses } from "@/hooks/useBudget";
import { AppShell } from "@/components/shared/AppShell";
import { PremiumGate } from "@/components/shared/PremiumGate";
import { formatCurrency } from "@/lib/utils/currency";
import { getExpectedSpend, getPaceStatus } from "@/lib/utils/budget";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#2D6A4F",
  "#40916C",
  "#D4A017",
  "#1B4332",
  "#74C69D",
  "#B7E4C7",
  "#52B788",
  "#95D5B2",
];

export default function Insights() {
  const { profile } = useAuth();
  const { budget } = useBudget();
  const { expenses } = useExpenses(budget?.id ?? null);

  if (!profile) return null;
  const isPremium = profile.plan === "premium" || profile.plan === "business";

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const expected = budget
    ? getExpectedSpend(
        Number(budget.total_amount),
        budget.start_date,
        budget.end_date,
      )
    : 0;
  const paceStatus = getPaceStatus(totalSpent, expected);
  const totalBudget = Number(budget?.total_amount ?? 0);
  const remaining = Math.max(0, totalBudget - totalSpent);

  const byCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + Number(e.amount);
  });
  const topCategory =
    Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
  const categoryData = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const dailyMap: Record<string, number> = {};
  expenses.forEach((e) => {
    dailyMap[e.expense_date] =
      (dailyMap[e.expense_date] ?? 0) + Number(e.amount);
  });
  const dailyData = Object.entries(dailyMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, amount]) => ({ date: date.slice(5), amount }));

  const healthScore =
    totalBudget > 0
      ? Math.max(
          0,
          Math.round(
            100 -
              Math.abs(
                totalSpent / totalBudget - (expected || 0) / totalBudget,
              ) *
                200,
          ),
        )
      : 100;

  return (
    <AppShell title="Insights" profile={profile}>
      <div className="space-y-5">
        {/* Summary cards */}
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { label: "Top category", value: topCategory, sub: "Most spent" },
            {
              label: "Health score",
              value: `${healthScore}/100`,
              sub: "Budget vs pace",
            },
            { label: "Budget pace", value: paceStatus, sub: "Current status" },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="rounded-[24px] bg-white border border-cream-dark p-6 shadow-soft"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-stone">
                {label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
              <p className="mt-1 text-xs text-stone">{sub}</p>
            </div>
          ))}
        </div>

        {/* Charts — Premium gated */}
        <PremiumGate feature="Advanced insights & charts" isPremium={isPremium}>
          {expenses.length === 0 ? (
            <div className="rounded-[28px] bg-cream py-16 text-center">
              <p className="text-stone">
                Log some expenses to see charts here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Pie chart */}
              <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
                <h3 className="font-semibold text-ink mb-4">
                  Spending by category
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) =>
                        formatCurrency(v, profile.currency)
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar chart */}
              <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft">
                <h3 className="font-semibold text-ink mb-4">Top categories</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={categoryData.slice(0, 6)}
                    layout="vertical"
                    margin={{ left: 8 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) =>
                        formatCurrency(v, profile.currency).replace(
                          /[^0-9KM,]/g,
                          "",
                        )
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      width={80}
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        formatCurrency(v, profile.currency)
                      }
                    />
                    <Bar dataKey="value" fill="#2D6A4F" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line chart */}
              <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft lg:col-span-2">
                <h3 className="font-semibold text-ink mb-4">
                  Daily spending trend
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dailyData}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) =>
                        formatCurrency(v, profile.currency).replace(
                          /[^0-9KM,]/g,
                          "",
                        )
                      }
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        formatCurrency(v, profile.currency)
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#2D6A4F"
                      strokeWidth={2.5}
                      dot={{ fill: "#2D6A4F", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Budget breakdown */}
              <div className="rounded-[28px] border border-cream-dark bg-white p-6 shadow-soft lg:col-span-2">
                <h3 className="font-semibold text-ink mb-4">
                  Budget breakdown
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={[
                      {
                        name: "Budget",
                        spent: totalSpent,
                        remaining,
                        expected,
                      },
                    ]}
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v: number) =>
                        formatCurrency(v, profile.currency)
                      }
                    />
                    <Bar
                      dataKey="spent"
                      name="Spent"
                      fill="#2D6A4F"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="remaining"
                      name="Remaining"
                      fill="#B7E4C7"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="expected"
                      name="Expected"
                      fill="#D4A017"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </PremiumGate>
      </div>
    </AppShell>
  );
}
