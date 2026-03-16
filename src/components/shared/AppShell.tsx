import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Profile } from "@/types";
import {
  LayoutDashboard,
  ReceiptText,
  Wallet,
  BarChart2,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const nav = [
  { label: "Dashboard", to: "/dashboard", Icon: LayoutDashboard },
  { label: "Expenses", to: "/expenses", Icon: ReceiptText },
  { label: "Budget", to: "/budget", Icon: Wallet },
  { label: "Insights", to: "/insights", Icon: BarChart2 },
  { label: "Settings", to: "/settings", Icon: Settings },
];

interface Props {
  children: React.ReactNode;
  profile: Profile;
}

export function AppShell({ children, profile }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isPremium = profile.plan === "premium" || profile.plan === "business";
  const firstName = profile.full_name?.split(" ")[0] ?? "User";
  const initials = firstName.slice(0, 2).toUpperCase();
  const workspace = `${firstName}'s workspace`;

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    navigate("/login");
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`flex flex-col ${mobile ? "h-full p-6" : "p-5"} bg-ink text-white ${mobile ? "" : "rounded-[28px]"}`}
    >
      {/* Logo */}
      <div className="mb-6 flex items-center justify-between">
        <img src="/logo-light.svg" className="h-10 w-auto" alt="Truvllo" />
        {mobile && (
          <button
            onClick={() => setDrawer(false)}
            className="rounded-xl p-2 text-white/50 hover:bg-white/10"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* User chip */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/8 px-3 py-2.5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-gradient text-sm font-bold text-white shadow-glow-sm">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {firstName}
          </p>
          <p className="text-xs capitalize text-white/40">
            {profile.plan} plan
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 text-sm">
        {nav.map(({ label, to, Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setDrawer(false)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                active
                  ? "bg-forest text-white shadow-glow-sm font-semibold"
                  : "text-white/55 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon
                size={17}
                className={active ? "text-white" : "text-white/40"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
        {!isPremium && (
          <Link
            to="/upgrade"
            onClick={() => setDrawer(false)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-forest-gradient px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Sparkles size={14} /> Upgrade to Premium
          </Link>
        )}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/40 hover:bg-white/8 hover:text-white/70"
        >
          <LogOut size={15} />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-cream-dark bg-cream/95 px-3 py-2.5 backdrop-blur lg:hidden">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cream-dark bg-white text-ink/70 shadow-soft hover:bg-cream-dark active:scale-95 transition"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Logo — centered, dark version for light background */}
        <div className="flex flex-1 items-center justify-center">
          <img src="/logo-dark.svg" className="h-7 w-auto" alt="Truvllo" />
        </div>

        {/* Avatar + menu */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => navigate("/settings")}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-soft"
            style={{ background: "linear-gradient(135deg, #1B4332, #40916C)" }}
            title={profile.full_name}
          >
            <span className="text-xs font-bold text-white">{initials}</span>
            {isPremium && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-cream bg-amber" />
            )}
          </button>
          <button
            onClick={() => setDrawer(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-dark bg-white text-ink/60 hover:bg-cream-dark transition"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-72 shadow-2xl">
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Layout */}
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:py-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6">
            <Sidebar />
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="rounded-[20px] border border-cream-dark bg-white p-4 shadow-soft sm:rounded-[28px] sm:p-6 lg:p-7">
            <div className="flex items-center justify-between gap-3 mb-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                {workspace}
              </p>
              {!isPremium ? (
                <Link
                  to="/upgrade"
                  className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-ink px-3 py-2 text-xs font-semibold text-white"
                >
                  <Sparkles size={12} className="text-amber" />
                  Upgrade
                </Link>
              ) : (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-forest/20 bg-forest/8 px-3 py-1.5 text-xs font-semibold text-forest">
                  <Sparkles size={11} />
                  {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}
                </span>
              )}
            </div>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-cream-dark bg-white/95 px-2 pt-2 backdrop-blur lg:hidden pb-safe"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {nav.map(({ label, to, Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 transition ${active ? "text-forest" : "text-stone"}`}
            >
              <div
                className={`rounded-xl p-1.5 ${active ? "bg-forest/10" : ""}`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span
                className={`text-[10px] font-medium ${active ? "text-forest" : "text-stone"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
