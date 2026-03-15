import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { callClaude } from '../_shared/claude.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { note } = await req.json();

    const system = `You are an expense categoriser. Pick the single best category for this expense note from this list ONLY: Food, Transport, Shopping, Housing, Health, Education, Entertainment, Savings, Utilities, Other. Respond with ONLY the category name, nothing else, no punctuation.`;

    const category = (await callClaude(system, note, 20)).trim();

    return new Response(JSON.stringify({ category }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
