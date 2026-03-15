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

    const totalSpent = expenses.reduce((s: number, e: any) => s + Number(e.amount), 0);

    const system = `You are a friendly personal finance analyst. Analyse spending and give 3-4 clear, actionable insights in plain English. Be specific — mention the top category, any red flags, and one positive observation. Keep it under 150 words. Warm, direct tone. Plain paragraphs, no bullet points.`;

    const user = `Budget: ${currency}${budget.total_amount} (${budget.timeframe}). Spent so far: ${currency}${totalSpent}. Breakdown: ${breakdown}. Start: ${budget.start_date}, End: ${budget.end_date}.`;

    const insight = await callClaude(system, user, 300);

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
