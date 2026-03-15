import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callClaude } from '../_shared/claude.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { expenses, budget, currency } = await req.json();

    const byCategory: Record<string, number> = {};
    expenses.forEach((e: any) => {
      byCategory[e.category] = (byCategory[e.category] ?? 0) + Number(e.amount);
    });

    const breakdown = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => `${cat}: ${currency}${amt.toLocaleString()}`)
      .join(', ');

    const system = `You are a friendly savings coach. Give ONE specific, practical savings tip based on this user's actual spending. Be concrete — mention specific amounts or categories from their data. Keep it under 80 words. Encouraging tone, not preachy. Plain paragraph, no bullet points.`;

    const user = `Budget: ${currency}${budget.total_amount}. Spending breakdown: ${breakdown}.`;

    const tip = await callClaude(system, user, 150);

    return new Response(JSON.stringify({ tip }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
