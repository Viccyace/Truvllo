import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "./AppShell";

export function AppLayout() {
  const { profile, loading } = useAuth();

  if (loading)
    return <div style={{ minHeight: "100vh", background: "#FAF8F3" }} />;
  if (!profile) return <Navigate to="/login" replace />;
  if (!profile.onboarding_completed)
    return <Navigate to="/onboarding" replace />;

  return (
    <AppShell profile={profile}>
      <Outlet />
    </AppShell>
  );
}
