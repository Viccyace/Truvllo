import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { Eye, EyeOff } from "lucide-react";

const inputCls =
  "w-full rounded-2xl border border-cream-dark bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10";

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate("/onboarding");
  }

  return (
    <AuthShell
      title="Create your account"
      copy="Start free. Set your budget and upgrade only when you need more."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone">
            Full name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            required
            placeholder="Ada Okafor"
            autoComplete="name"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone">
            Email address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone">
            Password
          </label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? "text" : "password"}
              required
              placeholder="Min 6 characters"
              autoComplete="new-password"
              className={`${inputCls} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone hover:text-ink"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-stone">
            Confirm password
          </label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            required
            placeholder="Repeat password"
            autoComplete="new-password"
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-ink py-3.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-stone">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-forest hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
