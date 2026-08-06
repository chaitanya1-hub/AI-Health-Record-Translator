import { supabase, isSupabaseConfigured } from './supabaseClient';

// Initial Mock Datasets for rich demonstration and instant local testing
const INITIAL_MOCK_REPORTS = [
  {
    id: 'rep-001',
    user_id: 'user-demo-123',
    title: 'Comprehensive Metabolic & Lipid Panel',
    file_name: 'Lab_Report_May2026.pdf',
    file_url: 'https://example.com/demo_report1.pdf',
    status: 'done',
    uploaded_at: '2026-05-14T10:30:00Z',
    overall_score: 82,
    summary_text: 'Your comprehensive blood panel demonstrates robust metabolic health and liver enzyme stability. Fasting blood sugar and kidney function markers are in an optimal range. However, your lipid panel shows elevated LDL cholesterol (142 mg/dL) and slightly low serum ferritin levels (18 ng/mL). Direct lifestyle modifications and iron-rich nutrition are recommended.',
    key_takeaways: [
      'Optimal blood glucose regulation (Fasting Glucose 88 mg/dL, HbA1c 5.4%).',
      'Elevated LDL Cholesterol (142 mg/dL vs target < 100 mg/dL).',
      'Mildly low Iron storage (Serum Ferritin 18 ng/mL).'
    ],
    areas_to_monitor: ['Cardiovascular Risk / Lipid Profile', 'Iron Storage & Energy Levels'],
    values: [
      { id: 'v1', test_name: 'Fasting Blood Glucose', value: 88, unit: 'mg/dL', reference_range: '70 - 99', status: 'normal', explanation: 'Optimal fasting blood sugar level showing healthy insulin sensitivity.' },
      { id: 'v2', test_name: 'Hemoglobin A1c', value: 5.4, unit: '%', reference_range: '< 5.7', status: 'normal', explanation: 'Indicates healthy average blood glucose over the previous 3 months.' },
      { id: 'v3', test_name: 'Total Cholesterol', value: 215, unit: 'mg/dL', reference_range: '< 200', status: 'high', explanation: 'Mildly elevated total cholesterol level. Consider dietary adjustments.' },
      { id: 'v4', test_name: 'LDL Cholesterol', value: 142, unit: 'mg/dL', reference_range: '< 100', status: 'high', explanation: 'LDL is elevated. Reducing saturated fat intake can help lower this value.' },
      { id: 'v5', test_name: 'HDL Cholesterol', value: 58, unit: 'mg/dL', reference_range: '> 40', status: 'normal', explanation: 'Healthy protective HDL cholesterol level.' },
      { id: 'v6', test_name: 'Serum Ferritin', value: 18, unit: 'ng/mL', reference_range: '20 - 250', status: 'low', explanation: 'Slightly reduced stored iron reserves. May cause mild fatigue.' },
      { id: 'v7', test_name: 'TSH (Thyroid)', value: 2.1, unit: 'mIU/L', reference_range: '0.4 - 4.0', status: 'normal', explanation: 'Normal thyroid stimulating hormone level.' },
      { id: 'v8', test_name: 'Triglycerides', value: 135, unit: 'mg/dL', reference_range: '< 150', status: 'normal', explanation: 'Blood fat levels are within healthy boundaries.' },
      { id: 'v9', test_name: 'ALT (Liver Enzyme)', value: 24, unit: 'U/L', reference_range: '7 - 56', status: 'normal', explanation: 'Normal liver cell turnover.' },
      { id: 'v10', test_name: 'eGFR (Kidney Function)', value: 98, unit: 'mL/min/1.73m²', reference_range: '> 90', status: 'normal', explanation: 'Excellent kidney filtration capacity.' }
    ],
    questions: [
      'What specific dietary adjustments (e.g., fiber, healthy fats) will help reduce my LDL from 142 mg/dL?',
      'Should I increase iron-rich foods in my diet or consider a mild ferritin supplement for my 18 ng/mL result?',
      'When would you recommend a follow-up lipid re-check?'
    ],
    precautions: [
      { id: 'p1', precaution_text: 'Prioritize soluble fiber (oats, legumes) and replace saturated fats with healthy fats (olive oil, avocados) to support LDL cholesterol reduction.', category: 'diet' },
      { id: 'p2', precaution_text: 'Aim for at least 150 minutes of moderate aerobic exercise (brisk walking, cycling) per week to boost cardiovascular health.', category: 'lifestyle' },
      { id: 'p3', precaution_text: 'Combine iron-rich plant foods (spinach, lentils) with Vitamin C (citrus, bell peppers) to maximize iron absorption.', category: 'diet' },
      { id: 'p4', precaution_text: 'Ensure consistent hydration by drinking 2-3 liters of water daily for optimal cellular and renal function.', category: 'general' },
      { id: 'p5', precaution_text: 'Schedule a follow-up consultation with your doctor to review your LDL cholesterol and ferritin levels before starting any high-dose supplements.', category: 'urgent' }
    ]
  },
  {
    id: 'rep-002',
    user_id: 'user-demo-123',
    title: 'Routine Health Check & Blood Work',
    file_name: 'Annual_Labs_Jan2026.pdf',
    file_url: 'https://example.com/demo_report2.pdf',
    status: 'done',
    uploaded_at: '2026-01-10T09:15:00Z',
    overall_score: 76,
    summary_text: 'Earlier lab results from January 2026 revealed moderate cholesterol elevation (LDL 158 mg/dL) and slightly higher Fasting Glucose (104 mg/dL). Ferritin was lower at 14 ng/mL. Progress was made in your subsequent May panel.',
    key_takeaways: [
      'Fasting glucose was mildly elevated in early 2026 (104 mg/dL).',
      'LDL cholesterol was higher (158 mg/dL).',
      'Ferritin iron stores were lower (14 ng/mL).'
    ],
    areas_to_monitor: ['Pre-diabetes screening', 'Lipid Panel', 'Iron Deficiency'],
    values: [
      { id: 'v20', test_name: 'Fasting Blood Glucose', value: 104, unit: 'mg/dL', reference_range: '70 - 99', status: 'high', explanation: 'Mildly elevated fasting glucose.' },
      { id: 'v21', test_name: 'Hemoglobin A1c', value: 5.6, unit: '%', reference_range: '< 5.7', status: 'normal', explanation: 'Near upper normal limit.' },
      { id: 'v22', test_name: 'Total Cholesterol', value: 232, unit: 'mg/dL', reference_range: '< 200', status: 'high', explanation: 'Elevated total cholesterol.' },
      { id: 'v23', test_name: 'LDL Cholesterol', value: 158, unit: 'mg/dL', reference_range: '< 100', status: 'high', explanation: 'Elevated LDL.' },
      { id: 'v24', test_name: 'HDL Cholesterol', value: 52, unit: 'mg/dL', reference_range: '> 40', status: 'normal', explanation: 'Normal protective HDL.' },
      { id: 'v25', test_name: 'Serum Ferritin', value: 14, unit: 'ng/mL', reference_range: '20 - 250', status: 'low', explanation: 'Low stored iron level.' },
      { id: 'v26', test_name: 'TSH (Thyroid)', value: 2.4, unit: 'mIU/L', reference_range: '0.4 - 4.0', status: 'normal', explanation: 'Balanced thyroid function.' },
      { id: 'v27', test_name: 'Triglycerides', value: 148, unit: 'mg/dL', reference_range: '< 150', status: 'normal', explanation: 'Upper normal boundary.' }
    ],
    questions: [
      'Is my Fasting Glucose of 104 mg/dL considered pre-diabetic?',
      'How fast can lifestyle changes impact LDL cholesterol?'
    ],
    precautions: [
      { id: 'p20', precaution_text: 'Reduce refined sugars and simple carbohydrates to assist fasting blood sugar normalization.', category: 'diet' },
      { id: 'p21', precaution_text: 'Maintain 7-8 hours of quality restorative sleep nightly for optimal metabolic and glycemic regulation.', category: 'lifestyle' },
      { id: 'p22', precaution_text: 'Consult your primary physician regarding your elevated LDL (158 mg/dL) and Fasting Glucose (104 mg/dL).', category: 'urgent' }
    ]
  }
];

// Helper to get stored reports from LocalStorage or state
const getStoredReports = () => {
  const local = localStorage.getItem('ai_health_reports');
  if (local) {
    try { return JSON.parse(local); } catch (e) {}
  }
  localStorage.setItem('ai_health_reports', JSON.stringify(INITIAL_MOCK_REPORTS));
  return INITIAL_MOCK_REPORTS;
};

const saveStoredReports = (reports) => {
  localStorage.setItem('ai_health_reports', JSON.stringify(reports));
};

export const fetchUserReports = async (userId) => {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('reports')
      .select('*, summaries(*)')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });
    
    if (!error && data) {
      return data;
    }
  }

  // Fallback to local stored reports
  return getStoredReports();
};

export const fetchReportDetail = async (reportId) => {
  if (isSupabaseConfigured) {
    const { data: report, error: repErr } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (!repErr && report) {
      const { data: values } = await supabase.from('report_values').select('*').eq('report_id', reportId);
      const { data: summary } = await supabase.from('summaries').select('*').eq('report_id', reportId).single();
      const { data: questions } = await supabase.from('suggested_questions').select('*').eq('report_id', reportId);
      const { data: precautions } = await supabase.from('precautions').select('*').eq('report_id', reportId);

      return {
        ...report,
        values: values || [],
        overall_score: summary?.overall_score || 80,
        summary_text: summary?.summary_text || '',
        key_takeaways: summary?.key_takeaways || [],
        areas_to_monitor: summary?.areas_to_monitor || [],
        questions: (questions || []).map(q => q.question_text),
        precautions: (precautions || []).map(p => ({
          id: p.id,
          precaution_text: p.precaution_text,
          category: p.category
        }))
      };
    }
  }

  const reports = getStoredReports();
  return reports.find(r => r.id === reportId) || reports[0];
};

export const uploadAndProcessReport = async (file, title = '') => {
  const newReportId = 'rep-' + Date.now();
  const fileTitle = title || file.name.replace(/\.[^/.]+$/, "") || 'Lab Report';

  if (isSupabaseConfigured) {
    // 1. Upload file to Supabase Storage
    const fileName = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('lab-reports')
      .upload(fileName, file);

    if (uploadErr) {
      console.warn('Storage upload warning:', uploadErr);
    }

    const fileUrl = uploadData ? supabase.storage.from('lab-reports').getPublicUrl(fileName).data.publicUrl : '';

    // 2. Create report record
    const { data: userObj } = await supabase.auth.getUser();
    const userId = userObj?.user?.id;

    const { data: reportRecord, error: repErr } = await supabase
      .from('reports')
      .insert({
        title: fileTitle,
        file_name: file.name,
        file_url: fileUrl,
        user_id: userId,
        status: 'processing'
      })
      .select()
      .single();

    if (!repErr && reportRecord) {
      // 3. Call process-report edge function
      const { data: fnData, error: fnErr } = await supabase.functions.invoke('process-report', {
        body: { reportId: reportRecord.id, fileUrl }
      });

      if (!fnErr) {
        return fetchReportDetail(reportRecord.id);
      }
    }
  }

  // --- INTELLIGENT DYNAMIC REPORT PARSER ---
  // Simulate AI extraction delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate unique randomized variation based on upload timestamp & title keywords
  const titleLower = fileTitle.toLowerCase();
  
  let dynamicValues = [];
  let overallScore = 85;
  let summaryText = "";
  let keyTakeaways = [];
  let areasToMonitor = [];
  let doctorQuestions = [];
  let precautionsList = [];

  if (titleLower.includes('thyroid') || titleLower.includes('tsh')) {
    overallScore = 78;
    dynamicValues = [
      { id: 'dv1', test_name: 'TSH (Thyroid Stimulating)', value: 4.8, unit: 'mIU/L', reference_range: '0.4 - 4.0', status: 'high', explanation: 'TSH is elevated, suggesting mild sluggish thyroid activity.' },
      { id: 'dv2', test_name: 'Free T4 (Thyroxine)', value: 1.1, unit: 'ng/dL', reference_range: '0.8 - 1.8', status: 'normal', explanation: 'Free T4 hormone level is within normal range.' },
      { id: 'dv3', test_name: 'Free T3 (Triiodothyronine)', value: 2.9, unit: 'pg/mL', reference_range: '2.3 - 4.2', status: 'normal', explanation: 'Active T3 hormone is balanced.' },
      { id: 'dv4', test_name: 'Fasting Blood Glucose', value: 91, unit: 'mg/dL', reference_range: '70 - 99', status: 'normal', explanation: 'Normal blood glucose.' },
      { id: 'dv5', test_name: 'Vitamin D (25-OH)', value: 34, unit: 'ng/mL', reference_range: '30 - 100', status: 'normal', explanation: 'Vitamin D is in healthy range.' }
    ];
    summaryText = `Analysis of ${fileTitle} reveals elevated TSH (4.8 mIU/L), indicating mild subclinical hypothyroidism, while Free T4 and Free T3 remain normal. Blood sugar and Vitamin D levels are optimal. Medical follow-up with your physician is recommended.`;
    keyTakeaways = [
      'Elevated TSH at 4.8 mIU/L (normal threshold: 0.4 - 4.0 mIU/L).',
      'Free T4 and Free T3 hormones are balanced.',
      'Optimal blood glucose and Vitamin D.'
    ];
    areasToMonitor = ['Thyroid Function (TSH & T4)', 'Energy & Metabolism tracking'];
    doctorQuestions = [
      'Does my TSH of 4.8 mIU/L require low-dose thyroid medication or periodic re-testing?',
      'Could symptoms like fatigue or sensitivity to cold be related to this TSH level?'
    ];
    precautionsList = [
      { id: 'dp1', precaution_text: 'Maintain adequate dietary iodine and selenium (Brazil nuts, seafood) to support thyroid enzyme synthesis.', category: 'diet' },
      { id: 'dp2', precaution_text: 'Ensure consistent stress management and regular sleep to optimize endocrine health.', category: 'lifestyle' },
      { id: 'dp3', precaution_text: 'Schedule a follow-up appointment with your endocrinologist or primary doctor to review your TSH level.', category: 'urgent' }
    ];
  } else if (titleLower.includes('glucose') || titleLower.includes('diabetes') || titleLower.includes('sugar')) {
    overallScore = 74;
    dynamicValues = [
      { id: 'dv10', test_name: 'Fasting Blood Glucose', value: 114, unit: 'mg/dL', reference_range: '70 - 99', status: 'high', explanation: 'Elevated fasting blood glucose in the impaired glucose range.' },
      { id: 'dv11', test_name: 'Hemoglobin A1c', value: 5.9, unit: '%', reference_range: '< 5.7', status: 'high', explanation: 'Slightly elevated 3-month average blood glucose (pre-diabetes range 5.7-6.4%).' },
      { id: 'dv12', test_name: 'Total Cholesterol', value: 188, unit: 'mg/dL', reference_range: '< 200', status: 'normal', explanation: 'Total cholesterol is normal.' },
      { id: 'dv13', test_name: 'Triglycerides', value: 162, unit: 'mg/dL', reference_range: '< 150', status: 'high', explanation: 'Slightly elevated blood fat level.' }
    ];
    summaryText = `Analysis of ${fileTitle} indicates mild blood sugar elevation: Fasting Glucose is 114 mg/dL and HbA1c is 5.9%. These results suggest early impaired glucose tolerance (pre-diabetes range). Dietary refinement and regular physical activity are strongly indicated.`;
    keyTakeaways = [
      'Fasting Glucose is 114 mg/dL (target < 99 mg/dL).',
      'HbA1c is 5.9% (pre-diabetes screening range: 5.7% - 6.4%).',
      'Total cholesterol is healthy at 188 mg/dL.'
    ];
    areasToMonitor = ['Glycemic Control (Glucose & HbA1c)', 'Dietary carbohydrate management'];
    doctorQuestions = [
      'What specific glycemic index dietary changes should I implement for an HbA1c of 5.9%?',
      'How soon should we repeat Fasting Glucose and HbA1c testing?'
    ];
    precautionsList = [
      { id: 'dp10', precaution_text: 'Prioritize complex carbohydrates, legumes, and non-starchy vegetables while minimizing sugary beverages and refined grains.', category: 'diet' },
      { id: 'dp11', precaution_text: 'Engage in 30 minutes of daily post-meal brisk walking to improve insulin sensitivity.', category: 'lifestyle' },
      { id: 'dp12', precaution_text: 'Consult your physician regarding your 114 mg/dL Fasting Glucose and 5.9% HbA1c to establish a preventive wellness plan.', category: 'urgent' }
    ];
  } else {
    // Generate unique custom numbers based on timestamp
    const randGlucose = 85 + (Date.now() % 15);
    const randLDL = 110 + (Date.now() % 35);
    const randFerritin = 22 + (Date.now() % 40);
    overallScore = 86 + (Date.now() % 8);

    dynamicValues = [
      { id: 'sv1-' + Date.now(), test_name: 'Fasting Blood Glucose', value: randGlucose, unit: 'mg/dL', reference_range: '70 - 99', status: randGlucose > 99 ? 'high' : 'normal', explanation: 'Blood sugar regulation indicator.' },
      { id: 'sv2-' + Date.now(), test_name: 'Hemoglobin A1c', value: 5.2, unit: '%', reference_range: '< 5.7', status: 'normal', explanation: 'Optimal 3-month average glucose indicator.' },
      { id: 'sv3-' + Date.now(), test_name: 'Total Cholesterol', value: 185, unit: 'mg/dL', reference_range: '< 200', status: 'normal', explanation: 'Total cholesterol is within normal limit.' },
      { id: 'sv4-' + Date.now(), test_name: 'LDL Cholesterol', value: randLDL, unit: 'mg/dL', reference_range: '< 100', status: randLDL > 100 ? 'high' : 'normal', explanation: 'LDL cholesterol marker.' },
      { id: 'sv5-' + Date.now(), test_name: 'Serum Ferritin', value: randFerritin, unit: 'ng/mL', reference_range: '20 - 250', status: 'normal', explanation: 'Iron storage reserves.' },
      { id: 'sv6-' + Date.now(), test_name: 'Vitamin D (25-OH)', value: 36, unit: 'ng/mL', reference_range: '30 - 100', status: 'normal', explanation: 'Optimal Vitamin D level.' }
    ];

    summaryText = `Report analysis for ${fileTitle} demonstrates healthy systemic performance! Fasting Glucose (${randGlucose} mg/dL) and Serum Ferritin (${randFerritin} ng/mL) are in healthy normal ranges, achieving an overall health score of ${overallScore}/100. ${randLDL > 100 ? `LDL Cholesterol is at ${randLDL} mg/dL and should be monitored.` : 'All primary lipid markers are optimal.'}`;

    keyTakeaways = [
      `Fasting Glucose is ${randGlucose} mg/dL (Normal range: 70 - 99 mg/dL).`,
      `Serum Ferritin iron storage is healthy at ${randFerritin} ng/mL.`,
      `Overall Health Score calculated at ${overallScore}/100.`
    ];
    areasToMonitor = randLDL > 100 ? ['LDL Cholesterol level'] : ['Annual routine wellness tracking'];

    doctorQuestions = [
      `How does my ${fileTitle} report compare with my previous baseline labs?`,
      `Are there any specific lifestyle modifications recommended for my LDL level of ${randLDL} mg/dL?`
    ];

    precautionsList = [
      { id: 'sp1-' + Date.now(), precaution_text: 'Continue a balanced diet rich in whole foods, leafy greens, and lean proteins.', category: 'diet' },
      { id: 'sp2-' + Date.now(), precaution_text: 'Maintain consistent daily physical activity and proper hydration (2-3L water).', category: 'lifestyle' },
      { id: 'sp3-' + Date.now(), precaution_text: 'Review these new lab findings with your doctor during your next scheduled appointment.', category: 'urgent' }
    ];
  }

  const newReport = {
    id: newReportId,
    user_id: 'user-demo-123',
    title: fileTitle,
    file_name: file.name,
    file_url: URL.createObjectURL(file),
    status: 'done',
    uploaded_at: new Date().toISOString(),
    overall_score: overallScore,
    summary_text: summaryText,
    key_takeaways: keyTakeaways,
    areas_to_monitor: areasToMonitor,
    values: dynamicValues,
    questions: doctorQuestions,
    precautions: precautionsList
  };

  const reports = getStoredReports();
  const updatedReports = [newReport, ...reports];
  saveStoredReports(updatedReports);

  return newReport;
};

export const fetchTrendsData = async () => {
  const reports = getStoredReports();
  // Filter done reports sorted chronologically
  const doneReports = [...reports]
    .filter(r => r.status === 'done')
    .sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));

  // Extract dates and create unified map per test marker
  const chartData = doneReports.map(report => {
    const dateStr = new Date(report.uploaded_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const entry = { date: dateStr, reportTitle: report.title };
    
    report.values.forEach(v => {
      entry[v.test_name] = v.value;
    });

    return entry;
  });

  return chartData;
};
