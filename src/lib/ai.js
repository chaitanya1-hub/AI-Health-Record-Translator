import { supabase, isSupabaseConfigured } from './supabaseClient';

const INITIAL_MOCK_MESSAGES = {
  'rep-001': [
    {
      id: 'm1',
      role: 'assistant',
      message: 'Hello! I am your AI Health Assistant. I have analyzed your Comprehensive Metabolic & Lipid Panel report from May 2026. Ask me any question about your values, abnormal markers, or dietary tips!',
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ]
};

const getStoredMessages = (reportId) => {
  const local = localStorage.getItem(`ai_qa_messages_${reportId}`);
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  return INITIAL_MOCK_MESSAGES[reportId] || [
    {
      id: 'm-default',
      role: 'assistant',
      message: 'Hello! I have reviewed this health report. Feel free to ask me anything about your test results, risk levels, or questions for your doctor!',
      created_at: new Date().toISOString()
    }
  ];
};

const saveStoredMessages = (reportId, messages) => {
  localStorage.setItem(`ai_qa_messages_${reportId}`, JSON.stringify(messages));
};

export const fetchQAMessages = async (reportId) => {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('qa_messages')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      return data;
    }
  }

  return getStoredMessages(reportId);
};

export const sendQAMessage = async (reportId, userId, messageText, reportContext) => {
  if (isSupabaseConfigured) {
    // Call Supabase Edge Function 'qa-chat'
    const { data, error } = await supabase.functions.invoke('qa-chat', {
      body: { reportId, userId, message: messageText }
    });

    if (!error && data?.reply) {
      return fetchQAMessages(reportId);
    }
  }

  // --- MOCK GROUNDED ANSWER GENERATION ---
  const currentMsgs = getStoredMessages(reportId);

  const userMsg = {
    id: 'u-' + Date.now(),
    role: 'user',
    message: messageText,
    created_at: new Date().toISOString()
  };

  const updatedWithUser = [...currentMsgs, userMsg];
  saveStoredMessages(reportId, updatedWithUser);

  // Simulate AI delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  const lower = messageText.toLowerCase();
  let aiReply = "";

  if (lower.includes('ldl') || lower.includes('cholesterol')) {
    aiReply = "Your report shows LDL Cholesterol at 142 mg/dL, which is classified as High (optimal reference range is below 100 mg/dL). Elevated LDL increases arterial plaque risk over time. Key lifestyle recommendations include prioritizing soluble fiber (oats, legumes), choosing unsaturated fats (olive oil, avocados), and engaging in 150 minutes of weekly moderate exercise.";
  } else if (lower.includes('ferritin') || lower.includes('iron') || lower.includes('fatigue')) {
    aiReply = "Your Serum Ferritin is recorded at 18 ng/mL, slightly under the standard normal range of 20 - 250 ng/mL. Ferritin is the primary protein storing iron in your tissues. Low ferritin can contribute to sluggishness or mild fatigue even if hemoglobin is normal. Discussing iron-rich foods (spinach, lentils, lean protein) or mild supplementation with your physician is advised.";
  } else if (lower.includes('glucose') || lower.includes('sugar') || lower.includes('a1c')) {
    aiReply = "Great news on your glycemic control! Your Fasting Glucose is 88 mg/dL (Normal range: 70 - 99 mg/dL) and HbA1c is 5.4% (Normal: < 5.7%). These numbers demonstrate excellent blood sugar stability.";
  } else if (lower.includes('score') || lower.includes('health score') || lower.includes('overall')) {
    aiReply = `Your overall Health Score for this report is ${reportContext?.overall_score || 82}/100. This score reflects strong performance across glucose, thyroid, and renal function, offset slightly by lipid elevation and low ferritin stores.`;
  } else {
    aiReply = `Based on your ${reportContext?.title || 'lab report'}, your general metabolic panel is stable. The main findings to focus on are LDL cholesterol management and iron storage monitoring. Please consult your physician for personalized medical advice regarding any symptoms.`;
  }

  const assistantMsg = {
    id: 'a-' + Date.now(),
    role: 'assistant',
    message: aiReply,
    created_at: new Date().toISOString()
  };

  const finalMsgs = [...updatedWithUser, assistantMsg];
  saveStoredMessages(reportId, finalMsgs);

  return finalMsgs;
};
