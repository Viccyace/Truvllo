import { Link } from 'react-router-dom';

interface Props { title: string; copy: string; children: React.ReactNode; }

export function AuthShell({ title, copy, children }: Props) {
  return (
    <div className="min-h-screen bg-ink text-white lg:grid lg:grid-cols-2">

      {/* Left panel — dark branded */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-forest-gradient opacity-20" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-forest/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-forest-light/15 blur-3xl" />

        <div className="relative z-10">
          <img src="/logo-light.svg" className="h-10 w-auto" alt="Truvllo" />
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="text-2xl font-semibold leading-snug text-white/90">
            "The only tracker that tells me if I'm spending too fast — before it's too late."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-forest text-sm font-bold">AO</div>
            <div>
              <p className="text-sm font-semibold">Adaeze Okafor</p>
              <p className="text-xs text-white/40">Premium user, Lagos, Nigeria</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-8">
          {[['500+', 'Active users'], ['₦2B+', 'Tracked'], ['4.9★', 'Rating']].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="text-2xl font-semibold text-forest-light">{val}</p>
              <p className="text-xs text-white/40">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-12 lg:min-h-0">
        <div className="mb-8 lg:hidden">
          <img src="/logo-light.svg" className="h-10 w-auto" alt="Truvllo" />
        </div>
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-stone">{copy}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="mt-8 text-xs text-stone lg:hidden">
          <Link to="/" className="hover:text-forest">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
