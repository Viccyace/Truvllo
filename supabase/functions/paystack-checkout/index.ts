import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const { email, plan, currency, userId } = await req.json();
    const PAYSTACK_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_KEY) throw new Error("PAYSTACK_SECRET_KEY not set");

    // Amount in kobo (NGN) or lowest currency unit
    const amounts: Record<string, number> = {
      NGN: 650000, // ₦6,500 in kobo
      USD: 700, // $7 in cents
      GBP: 600, // £6 in pence
      EUR: 700, // €7 in cents
      KES: 90000, // KSh 900 in cents
      GHS: 9000, // ₵90 in pesewas
    };

    const amount = amounts[currency] ?? amounts.NGN;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        currency,
        metadata: { userId, plan, currency },
        callback_url: `${Deno.env.get("APP_URL")}/settings?upgraded=true`,
        channels: ["card", "bank", "ussd", "mobile_money"],
      }),
    });

    const data = await res.json();
    if (!data.status) throw new Error(data.message ?? "Paystack error");

    return new Response(
      JSON.stringify({
        authorization_url: data.data.authorization_url,
        reference: data.data.reference,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
