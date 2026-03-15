import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { AuthShell } from '@/components/auth/AuthShell';
import { Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    });

    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate('/onboarding');
  }

  const Field = ({ label, k, type = 'text', placeholder, autoComplete }: {
    label: string; k: string; type?: string; placeholder: string; autoComplete?: string;
  }) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-stone">{label}</label>
      <input value={form[k as keyof typeof form]} onChange={e => update(k, e.target.value)}
        type={type} required placeholder={placeholder} autoComplete={autoComplete}
        className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10" />
    </div>
  );

  return (
    <AuthShell title="Create your account" copy="Start free. Set your budget and upgrade only when you need more.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">{error}</div>
        )}
        <Field label="Full name"     k="full_name" placeholder="Ada Okafor"      autoComplete="name" />
        <Field label="Email address" k="email"     placeholder="you@example.com" autoComplete="email" type="email" />
        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone">Password</label>
          <div className="relative">
            <input value={form.password} onChange={e => update('password', e.target.value)}
              type={showPass ? 'text' : 'password'} required placeholder="Min 6 characters" autoComplete="new-password"
              className="w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 pr-11 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10" />
            <button type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone hover:text-ink">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <Field label="Confirm password" k="confirm" type="password" placeholder="Repeat password" autoComplete="new-password" />
        <button type="submit" disabled={loading}
          className="w-full rounded-2xl bg-ink py-3.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-stone">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-forest hover:underline">Log in</Link>
      </p>
    </AuthShell>
  );
}
