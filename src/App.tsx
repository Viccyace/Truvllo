import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Pages
import Landing    from '@/pages/Landing';
import Login      from '@/pages/Login';
import Signup     from '@/pages/Signup';
import Onboarding from '@/pages/Onboarding';
import Dashboard  from '@/pages/Dashboard';
import Expenses   from '@/pages/Expenses';
import Budget     from '@/pages/Budget';
import Insights   from '@/pages/Insights';
import Settings   from '@/pages/Settings';
import Upgrade    from '@/pages/Upgrade';
import Pricing    from '@/pages/Pricing';
import Blog       from '@/pages/Blog';
import NotFound   from '@/pages/NotFound';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;
  if (!profile.onboarding_completed) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (profile) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-3 border-forest border-t-transparent animate-spin" style={{ borderWidth: 3 }} />
        <p className="text-sm text-stone">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"        element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog"    element={<Blog />} />

        {/* Auth */}
        <Route path="/login"  element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/expenses"  element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        <Route path="/budget"    element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/insights"  element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/upgrade"   element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
