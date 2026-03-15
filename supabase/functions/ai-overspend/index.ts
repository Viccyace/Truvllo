import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callClaude } from '../_shared/claude.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { expenses, budget, currency, spent, expected } = await req.json();

    const byCategory: Record<string, number> = {};
    expenses.forEach((e: any) => {
      byCategory[e.category] = (byCategory[e.category] ?? 0) + Number(e.amount);
    });

    const breakdown = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => `${cat}: ${currency}${amt.toLocaleString()}`)
      .join(', ');

    const system = `You are a direct but empathetic financial coach. Explain in plain English why this person is overspending their budget pace. Then suggest 2-3 specific cuts they can make RIGHT NOW this week based on their actual categories. Keep it under 120 words. Direct but not harsh. Short paragraphs, no bullet points.`;

    const user = `Budget: ${currency}${budget.total_amount}. Spent: ${currency}${spent}. Expected by now: ${currency}${expected}. Over by: ${currency}${spent - expected}. Breakdown: ${breakdown}.`;

    const explanation = await callClaude(system, user, 250);

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
