import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { AuthShell } from '@/components/auth/AuthShell';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate          = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate('/dashboard');
  }

  return (
    <AuthShell title="Welcome back" copy="Log in to continue tracking your budget with Truvllo.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">{error}</div>
        )}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone">Email address</label>
          <input value={email} onChange={e => setEmail(e.target.value)}
            type="email" required autoComplete="email" placeholder="you@example.com"
            className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone">Password</label>
          <div className="relative">
            <input value={pass} onChange={e => setPass(e.target.value)}
              type={showPass ? 'text' : 'password'} required autoComplete="current-password" placeholder="••••••••"
              className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 pr-11 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10" />
            <button type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone hover:text-ink">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full rounded-2xl bg-ink py-3.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-stone">
        No account?{' '}
        <Link to="/signup" className="font-semibold text-forest hover:underline">Create one free</Link>
      </p>
    </AuthShell>
  );
}
