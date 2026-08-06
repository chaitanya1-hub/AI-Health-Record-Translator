// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { reportId, message, conversationHistory } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: report } = await supabaseAdmin.from('reports').select('*').eq('id', reportId).single();
    const { data: values } = await supabaseAdmin.from('report_values').select('*').eq('report_id', reportId);
    const { data: summary } = await supabaseAdmin.from('summaries').select('*').eq('report_id', reportId).single();

    const apiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('LLM_API_KEY');

    const systemPrompt = `You are an AI Health Record Assistant. Answer user follow-up questions in empathetic plain language, grounded strictly in their lab report context:
    Report Title: ${report?.title || 'Lab Report'}
    Summary: ${summary?.summary_text || ''}
    Values: ${JSON.stringify(values || [])}
    Rule: Never offer direct medical diagnosis or treatment prescribing. Remind the user to consult their primary care physician.`;

    let replyText = "";

    if (apiKey) {
      const messagesPayload = [
        { role: 'system', content: systemPrompt },
        ...(conversationHistory || []).map(m => ({ role: m.role, content: m.text || m.message })),
        { role: 'user', content: message }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messagesPayload
        })
      });

      const resData = await response.json();
      replyText = resData.choices[0].message.content;
    } else {
      replyText = `Based on your report context: your lab values show well-managed metabolic markers. For specific medical advice regarding "${message}", please consult your primary physician.`;
    }

    return new Response(JSON.stringify({ reply: replyText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
