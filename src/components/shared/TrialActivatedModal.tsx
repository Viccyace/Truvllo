import { useState, useEffect } from "react";
import { Sparkles, X, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MODAL_KEY = "truvllo_trial_shown";

interface Props {
  justActivated: boolean;
}

export function TrialActivatedModal({ justActivated }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (justActivated && !localStorage.getItem(MODAL_KEY)) {
      setTimeout(() => setVisible(true), 600);
    }
  }, [justActivated]);

  function close() {
    localStorage.setItem(MODAL_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={close}
      />
      <div className="relative w-full max-w-sm rounded-[28px] bg-white p-8 shadow-[0_24px_64px_rgba(10,10,10,0.25)]">
        <button
          onClick={close}
          className="absolute right-4 top-4 rounded-xl p-2 text-stone hover:bg-cream"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-forest-gradient shadow-glow mx-auto">
          <Sparkles size={28} className="text-white" />
        </div>

        {/* Content */}
        <div className="mt-5 text-center">
          <h2 className="font-display text-2xl font-semibold text-ink">
            You unlocked Premium! 🎉
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone">
            You just logged your first expense. As a reward, enjoy{" "}
            <strong className="text-ink">7 days of Premium free</strong> — no
            card needed.
          </p>
        </div>

        {/* Features */}
        <div className="mt-5 space-y-2.5">
          {[
            "AI Spending Analyst",
            "AI Savings Coach",
            "Natural Language Entry",
            "Category caps & alerts",
            "Advanced charts",
            "CSV export",
          ].map((f) => (
            <div
              key={f}
              className="flex items-center gap-2.5 text-sm text-stone"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <Check size={11} />
              </span>
              {f}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={close}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-forest py-3.5 text-sm font-semibold text-white transition hover:bg-forest-dark"
        >
          Explore Premium features <ArrowRight size={14} />
        </button>
        <p className="mt-3 text-center text-xs text-stone">
          Trial ends in 7 days · No credit card needed
        </p>
      </div>
    </div>
  );
}
