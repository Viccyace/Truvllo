import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callClaude } from '../_shared/claude.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { income, goal, currency, timeframe } = await req.json();

    const system = `You are a personal finance advisor. Based on this income and goal, suggest a realistic ${timeframe} budget breakdown. Cover: Food, Transport, Housing, Utilities, Savings, Entertainment, Health, Other. Give specific amounts in ${currency}. Add one sentence of advice for their goal. Keep it under 200 words. Plain paragraphs, no markdown headers.`;

    const user = `${timeframe} income: ${currency}${income}. Financial goal: ${goal}.`;

    const advice = await callClaude(system, user, 350);

    return new Response(JSON.stringify({ advice }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
