import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/shared/AppLayout";

const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Expenses = lazy(() => import("@/pages/Expenses"));
const Budget = lazy(() => import("@/pages/Budget"));
const Insights = lazy(() => import("@/pages/Insights"));
const Settings = lazy(() => import("@/pages/Settings"));
const Upgrade = lazy(() => import("@/pages/Upgrade"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Blog = lazy(() => import("@/pages/Blog"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Prefetcher() {
  useEffect(() => {
    const t = setTimeout(() => {
      import("@/pages/Dashboard");
      import("@/pages/Expenses");
      import("@/pages/Budget");
      import("@/pages/Insights");
      import("@/pages/Settings");
      import("@/pages/Upgrade");
      import("@/pages/Blog");
      import("@/pages/Login");
      import("@/pages/Signup");
    }, 800);
    return () => clearTimeout(t);
  }, []);
  return null;
}

function ProgressBar() {
  const location = useLocation();
  const barRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    clearTimeout(timer.current);
    bar.style.transition = "none";
    bar.style.width = "0%";
    bar.style.opacity = "1";
    requestAnimationFrame(() => {
      bar.style.transition = "width 0.3s ease";
      bar.style.width = "80%";
      timer.current = setTimeout(() => {
        bar.style.width = "100%";
        bar.style.transition = "width 0.15s ease, opacity 0.2s ease";
        setTimeout(() => {
          bar.style.opacity = "0";
        }, 150);
      }, 300);
    });
  }, [location.pathname]);

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        height: "2.5px",
        width: "0%",
        opacity: 0,
        background: "linear-gradient(90deg,#1B4332,#40916C)",
        borderRadius: "0 2px 2px 0",
        boxShadow: "0 0 6px rgba(64,145,108,0.5)",
        pointerEvents: "none",
      }}
    />
  );
}

// No fallback shown — PageFallback causes the flash
// Keep content visible while loading
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading)
    return <div style={{ minHeight: "100vh", background: "#FAF8F3" }} />;
  if (!profile) return <Navigate to="/login" replace />;
  if (!profile.onboarding_completed)
    return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading)
    return <div style={{ minHeight: "100vh", background: "#FAF8F3" }} />;
  if (profile) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ProgressBar />
      <Prefetcher />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/upgrade" element={<Upgrade />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
