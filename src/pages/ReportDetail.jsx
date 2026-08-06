import React, { useState } from 'react';
import { HealthScoreCard } from '../components/HealthScoreCard';
import { AbnormalValuesList } from '../components/AbnormalValuesList';
import { ReportSummary } from '../components/ReportSummary';
import { AskDoctorQuestions } from '../components/AskDoctorQuestions';
import { PrecautionsList } from '../components/PrecautionsList';
import { QAChat } from '../components/QAChat';
import { ArrowLeft, Calendar, Download, Sparkles, Activity, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

export const ReportDetail = ({ report, onBack, user }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'summary', 'values', 'precautions', 'questions', 'chat'

  if (!report) return null;

  const values = report.values || [];
  const abnormalCount = values.filter(v => v.status === 'high' || v.status === 'low').length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">{report.title}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Processed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Uploaded {new Date(report.uploaded_at).toLocaleDateString()} • {report.file_name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Horizontal Navigation Pills Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Comprehensive View</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'summary'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Plain Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('values')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'values'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Lab Values ({values.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('precautions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'precautions'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Precautions & Guidance</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'questions'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Doctor Questions</span>
          </button>

          {/* Prominent Highlighted Q&A Assistant Button */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'chat'
                ? 'bg-brand-700 text-white ring-2 ring-brand-400 shadow-md'
                : 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
            <span>Ask AI Q&A Assistant</span>
          </button>

        </div>
      </div>

      {/* Main Content View */}
      <div className="space-y-8">
        {activeTab === 'all' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <HealthScoreCard
                score={report.overall_score || 82}
                totalValues={values.length}
                abnormalCount={abnormalCount}
              />
              <div className="lg:col-span-2">
                <ReportSummary
                  summaryText={report.summary_text}
                  keyTakeaways={report.key_takeaways}
                  areasToMonitor={report.areas_to_monitor}
                />
              </div>
            </div>

            <AbnormalValuesList values={values} />
            <PrecautionsList precautions={report.precautions || []} />
            <AskDoctorQuestions questions={report.questions} />
            
            {/* Embedded Q&A Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Interactive Q&A Assistant</h3>
              </div>
              <QAChat report={report} userId={user?.id} />
            </div>
          </>
        )}

        {activeTab === 'summary' && (
          <ReportSummary
            summaryText={report.summary_text}
            keyTakeaways={report.key_takeaways}
            areasToMonitor={report.areas_to_monitor}
          />
        )}

        {activeTab === 'values' && (
          <AbnormalValuesList values={values} />
        )}

        {activeTab === 'precautions' && (
          <PrecautionsList precautions={report.precautions || []} />
        )}

        {activeTab === 'questions' && (
          <AskDoctorQuestions questions={report.questions} />
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="bg-brand-50/70 p-4 rounded-xl border border-brand-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-brand-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  Report-Grounded AI Assistant
                </h3>
                <p className="text-xs text-brand-700 mt-0.5">
                  Ask any question about your medical values, lab definitions, or general wellness context.
                </p>
              </div>
            </div>
            <QAChat report={report} userId={user?.id} />
          </div>
        )}
      </div>

    </div>
  );
};
