import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const { email, full_name } = await req.json();
    const first = full_name?.split(" ")[0] ?? "there";
    const RESEND_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_KEY) throw new Error("RESEND_API_KEY not set");

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width"/>
  <title>Welcome to Truvllo</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #F0EDE4;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1B4332,#40916C);padding:40px 40px 32px;text-align:center;">
      <h1 style="margin:0;font-size:32px;font-weight:700;color:#FAF8F3;font-family:Georgia,serif;">Truvllo.</h1>
      <p style="margin:8px 0 0;font-size:14px;color:rgba(250,248,243,0.6);">Budget with clarity</p>
    </div>
    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:600;color:#0A0A0A;">Welcome, ${first}! 🎉</h2>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#6B7280;">
        You're in. Truvllo is ready to help you spend with clarity — not guesswork. Here's how to get started in the next 5 minutes.
      </p>

      <!-- Steps -->
      <div style="background:#FAF8F3;border-radius:16px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 16px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#6B7280;">3 quick steps</p>
        ${[
          [
            "1",
            "Set your budget",
            "Go to Budget → create your first budget with amount and timeframe.",
          ],
          [
            "2",
            "Log your first expense",
            "Use the quick-add on your dashboard. Takes 10 seconds.",
          ],
          [
            "3",
            "Check your pace",
            "See if you're ahead, on track, or over pace — every day.",
          ],
        ]
          .map(
            ([num, title, desc]) => `
        <div style="display:flex;gap:16px;margin-bottom:16px;align-items:flex-start;">
          <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#1B4332,#40916C);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span style="color:#FAF8F3;font-size:13px;font-weight:700;">${num}</span>
          </div>
          <div>
            <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#0A0A0A;">${title}</p>
            <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">${desc}</p>
          </div>
        </div>`,
          )
          .join("")}
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="https://truvllo.vercel.app/dashboard"
          style="display:inline-block;background:linear-gradient(135deg,#1B4332,#40916C);color:#FAF8F3;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;">
          Open my dashboard →
        </a>
      </div>

      <!-- Tip -->
      <div style="border-left:3px solid #2D6A4F;padding:16px 20px;background:#F0EDE4;border-radius:0 12px 12px 0;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#1B4332;">💡 Pro tip</p>
        <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">
          Check your <strong>safe-to-spend</strong> number every morning — it tells you exactly how much you can spend today without going over budget.
        </p>
      </div>

      <p style="margin:0;font-size:14px;color:#6B7280;line-height:1.7;">
        If you have questions, just reply to this email. We read everything.<br/>
        <br/>
        — The Truvllo team
      </p>
    </div>
    <!-- Footer -->
    <div style="background:#FAF8F3;padding:24px 40px;border-top:1px solid #F0EDE4;text-align:center;">
      <p style="margin:0;font-size:12px;color:#6B7280;">
        © ${new Date().getFullYear()} Truvllo · <a href="https://truvllo.vercel.app" style="color:#2D6A4F;">truvllo.vercel.app</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Truvllo <hello@truvllo.com>",
        to: [email],
        subject: `Welcome to Truvllo, ${first}! 🌿`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
