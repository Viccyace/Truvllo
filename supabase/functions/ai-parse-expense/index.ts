import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callClaude } from '../_shared/claude.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { text } = await req.json();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const system = `You are an expense parser. Extract the amount (number only), category (one of: Food, Transport, Shopping, Housing, Health, Education, Entertainment, Savings, Utilities, Other), a short note, and the date (YYYY-MM-DD format). Today is ${today}, yesterday is ${yesterday}. Respond ONLY with valid JSON, no markdown, no explanation: {"amount": 3500, "category": "Food", "note": "Lunch", "expense_date": "${today}"}`;

    const parsed = await callClaude(system, text, 100);

    let result;
    try {
      result = JSON.parse(parsed.replace(/```json|```/g, '').trim());
    } catch {
      result = { error: 'Could not parse expense. Try: "spent 2000 on transport"' };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
