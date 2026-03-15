import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const PAYSTACK_KEY = Deno.env.get("PAYSTACK_SECRET_KEY")!;
    const body = await req.text();

    // Verify webhook signature
    const hash = createHmac("sha512", PAYSTACK_KEY).update(body).digest("hex");
    const signature = req.headers.get("x-paystack-signature");
    if (hash !== signature) {
      return new Response("Unauthorized", { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const { userId, plan } = event.data.metadata;

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      // Upgrade user to premium
      await supabase
        .from("profiles")
        .update({ plan: "premium" })
        .eq("id", userId);

      // Record subscription
      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          plan: "premium",
          status: "active",
          reference: event.data.reference,
          amount: event.data.amount,
          currency: event.data.currency,
          started_at: new Date().toISOString(),
          expires_at: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        { onConflict: "user_id" },
      );
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
