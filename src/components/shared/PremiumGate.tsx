import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";

interface Props {
  feature: string;
  isPremium: boolean;
  children: React.ReactNode;
  hint?: string;
}

export function PremiumGate({ feature, isPremium, children, hint }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (isPremium || dismissed) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none blur-sm opacity-40 max-h-48 overflow-hidden">
        {children}
      </div>

      {/* Small popup — bottom-right corner */}
      <div className="absolute bottom-3 right-3 z-10 w-64 rounded-[20px] border border-forest/20 bg-white p-4 shadow-[0_8px_32px_rgba(10,10,10,0.15)]">
        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-3 rounded-lg p-1 text-stone/50 hover:text-stone transition"
        >
          <X size={13} />
        </button>

        {/* Icon + title */}
        <div className="flex items-center gap-2.5 pr-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-forest-gradient shadow-glow-sm">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Premium feature</p>
            <p className="text-xs text-stone leading-4">{feature}</p>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/upgrade"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-forest py-2 text-xs font-semibold text-white transition hover:bg-forest-dark active:scale-[0.98]"
        >
          <Sparkles size={11} /> Upgrade to unlock
        </Link>
      </div>
    </div>
  );
}
