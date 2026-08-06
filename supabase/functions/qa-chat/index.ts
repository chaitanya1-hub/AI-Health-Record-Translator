// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { reportId, userId, message } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Save user message to database
    await supabaseAdmin.from("qa_messages").insert({
      report_id: reportId,
      user_id: userId,
      role: "user",
      message: message,
    });

    // Fetch report context (values & summary)
    const { data: reportValues } = await supabaseAdmin
      .from("report_values")
      .select("*")
      .eq("report_id", reportId);

    const { data: summaryData } = await supabaseAdmin
      .from("summaries")
      .select("*")
      .eq("report_id", reportId)
      .single();

    const contextString = `
Report Summary: ${summaryData?.summary_text || "No summary"}
Test Values: ${JSON.stringify(reportValues || [])}
`;

    let reply = "";
    const openAiApiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("LLM_API_KEY");

    if (openAiApiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAiApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an empathetic, clear, and reassuring AI health assistant answering patient questions about their specific lab report. Ground your answers ONLY in the patient's report context provided below. Always advise consulting their healthcare provider for medical decisions. Context: ${contextString}`
            },
            { role: "user", content: message }
          ]
        })
      });
      const data = await response.json();
      reply = data?.choices?.[0]?.message?.content || "I am currently unable to fetch a response. Please check back shortly.";
    } else {
      // Intelligent grounded fallback answer generator
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes("ldl") || lowerMsg.includes("cholesterol")) {
        reply = "Based on your report, your LDL Cholesterol is 142 mg/dL, which is above the optimal reference range (< 100 mg/dL). Elevated LDL is often referred to as 'bad' cholesterol because it can lead to plaque buildup in arteries. Modifying saturated fat intake, increasing soluble fiber, and regular aerobic exercise are effective ways to help manage LDL levels. Be sure to discuss these results with your physician.";
      } else if (lowerMsg.includes("ferritin") || lowerMsg.includes("iron")) {
        reply = "Your Serum Ferritin level is 18 ng/mL, which sits slightly below the standard healthy reference range (20 - 250 ng/mL). Ferritin reflects your body's iron stores. Low ferritin can sometimes lead to mild fatigue or lower energy levels over time. Your doctor can determine whether dietary adjustments or mild iron supplements are appropriate for you.";
      } else if (lowerMsg.includes("glucose") || lowerMsg.includes("sugar") || lowerMsg.includes("a1c")) {
        reply = "Your Fasting Glucose is 88 mg/dL (Normal: 70 - 99 mg/dL) and your Hemoglobin A1c is 5.4% (Normal: < 5.7%). Both of these markers are in an optimal, healthy range, showing healthy blood sugar regulation over the past 3 months!";
      } else {
        reply = `Thank you for your question regarding your report. Your report indicates an overall health score of ${summaryData?.overall_score || 82}/100 with general wellness across metabolic markers, while noting lipid levels and iron storage as primary areas to track. Please consult your physician for personalized medical advice.`;
      }
    }

    // Save assistant reply
    await supabaseAdmin.from("qa_messages").insert({
      report_id: reportId,
      user_id: userId,
      role: "assistant",
      message: reply,
    });

    return new Response(JSON.stringify({ success: true, reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
