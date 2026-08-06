import React, { useState } from 'react';
import { HealthScoreCard } from '../components/HealthScoreCard';
import { AbnormalValuesList } from '../components/AbnormalValuesList';
import { ReportSummary } from '../components/ReportSummary';
import { AskDoctorQuestions } from '../components/AskDoctorQuestions';
import { PrecautionsList } from '../components/PrecautionsList';
import { QAChat } from '../components/QAChat';
import { ArrowLeft, FileText, Calendar, Sparkles, ShieldCheck, MessageSquare } from 'lucide-react';

export const ReportDetail = ({ report, onBack, user }) => {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'values', 'precautions', 'questions', 'qa'

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-xs text-slate-500">No report selected.</p>
        <button onClick={onBack} className="mt-4 text-xs text-brand-600 font-bold hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{report.title}</h1>
            <p className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Uploaded {new Date(report.uploaded_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Score: {report.overall_score || 82}/100
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Executive Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('values')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'values'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          <span>Extracted Lab Values</span>
        </button>

        <button
          onClick={() => setActiveTab('precautions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'precautions'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Precautions & Guidance</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-brand-600" />
          <span>Doctor Questions</span>
        </button>

        <button
          onClick={() => setActiveTab('qa')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'qa'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand-300" />
          <span>Ask Q&A Assistant</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <HealthScoreCard
                score={report.overall_score || 82}
                totalMarkers={report.values?.length || 10}
                abnormalCount={report.values?.filter(v => v.status === 'high' || v.status === 'low').length || 2}
              />
            </div>
            <div className="lg:col-span-2">
              <ReportSummary
                summaryText={report.summary_text}
                keyTakeaways={report.key_takeaways || []}
                areasToMonitor={report.areas_to_monitor || []}
              />
            </div>
          </div>
          <AbnormalValuesList values={report.values || []} />
        </div>
      )}

      {activeTab === 'values' && (
        <AbnormalValuesList values={report.values || []} />
      )}

      {activeTab === 'precautions' && (
        <PrecautionsList precautions={report.precautions || []} />
      )}

      {activeTab === 'questions' && (
        <AskDoctorQuestions questions={report.questions || []} />
      )}

      {activeTab === 'qa' && (
        <QAChat reportId={report.id} reportTitle={report.title} />
      )}

    </div>
  );
};
