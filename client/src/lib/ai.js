import { supabase, isSupabaseConfigured } from './supabaseClient';

export const sendQAMessage = async (reportId, message, previousMessages = []) => {
  if (isSupabaseConfigured) {
    const { data: userObj } = await supabase.auth.getUser();
    const userId = userObj?.user?.id;

    // Save user message to database
    await supabase.from('qa_messages').insert({
      report_id: reportId,
      user_id: userId,
      role: 'user',
      message: message
    });

    // Invoke edge function
    const { data, error } = await supabase.functions.invoke('qa-chat', {
      body: { reportId, message, conversationHistory: previousMessages }
    });

    if (!error && data?.reply) {
      // Save assistant reply
      await supabase.from('qa_messages').insert({
        report_id: reportId,
        user_id: userId,
        role: 'assistant',
        message: data.reply
      });
      return data.reply;
    }
  }

  // Instant Smart AI Simulation for Q&A (fallback mode)
  await new Promise(resolve => setTimeout(resolve, 1400));

  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('ferritin') || lowerMsg.includes('iron') || lowerMsg.includes('fatigue')) {
    return "Serum Ferritin reflects your body's stored iron reserves. Your Ferritin value (18 ng/mL) is near the lower boundary of normal (20-250 ng/mL). Low ferritin can contribute to mild tiredness or low stamina. Combining iron-rich foods (spinach, lentils, red meat) with Vitamin C improves iron absorption. Discussing targeted supplementation with your doctor is recommended.";
  }

  if (lowerMsg.includes('ldl') || lowerMsg.includes('cholesterol') || lowerMsg.includes('heart') || lowerMsg.includes('diet')) {
    return "LDL (Low-Density Lipoprotein) is often called 'bad cholesterol' because elevated levels can build up in arterial walls over time. Your LDL level is 142 mg/dL (optimal target is < 100 mg/dL). Increasing soluble fiber (oats, beans) and replacing saturated fats with healthy unsaturated fats (olive oil, nuts) can effectively help lower LDL numbers.";
  }

  if (lowerMsg.includes('glucose') || lowerMsg.includes('sugar') || lowerMsg.includes('diabetes')) {
    return "Fasting Blood Glucose measures sugar in your blood after an overnight fast. Your result (88 mg/dL) is well within the healthy normal range (70-99 mg/dL), indicating good insulin sensitivity and metabolic balance.";
  }

  return `Regarding your question about "${message}": Based on your report, your metabolic and kidney values are well-regulated. For specific clinical advice or starting supplements, sharing these exact numbers with your primary healthcare provider is best!`;
};
