import { Link } from "react-router-dom";
import { Sparkles, Clock } from "lucide-react";
import { Profile } from "@/types";

interface Props {
  profile: Profile;
}

export function TrialBanner({ profile }: Props) {
  if (!profile.trial_activated) return null;
  if (profile.plan !== "premium") return null;

  const endsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  if (!endsAt) return null;

  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((endsAt.getTime() - now.getTime()) / 86400000),
  );

  if (daysLeft <= 0) return null;

  const urgent = daysLeft <= 2;

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] p-4 mb-5 ${urgent ? "bg-amber-50 border border-amber-200" : "border border-forest/20 bg-forest/5"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${urgent ? "bg-amber-500" : "bg-forest-gradient"}`}
          >
            {urgent ? (
              <Clock size={15} className="text-white" />
            ) : (
              <Sparkles size={15} className="text-white" />
            )}
          </div>
          <div className="min-w-0">
            <p
              className={`text-sm font-semibold ${urgent ? "text-amber-800" : "text-ink"}`}
            >
              {urgent
                ? `⚠️ Trial ends in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`
                : `🎉 Premium trial — ${daysLeft} days left`}
            </p>
            <p
              className={`text-xs mt-0.5 ${urgent ? "text-amber-600" : "text-stone"}`}
            >
              {urgent
                ? "Upgrade now to keep all your AI features and data."
                : "You have full access to all Premium features. Enjoy!"}
            </p>
          </div>
        </div>
        <Link
          to="/upgrade"
          className={`shrink-0 flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 ${urgent ? "bg-amber-500" : "bg-forest"}`}
        >
          <Sparkles size={11} /> Upgrade
        </Link>
      </div>
    </div>
  );
}
