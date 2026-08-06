import React, { useState } from 'react';
import { UploadReport } from '../components/UploadReport';
import { HealthScoreCard } from '../components/HealthScoreCard';
import { AbnormalValuesList } from '../components/AbnormalValuesList';
import { ReportSummary } from '../components/ReportSummary';
import { AskDoctorQuestions } from '../components/AskDoctorQuestions';
import { PrecautionsList } from '../components/PrecautionsList';
import { QAChat } from '../components/QAChat';
import { TrendsChart } from '../components/TrendsChart';
import { Sparkles, Plus, ShieldCheck, Activity, MessageSquare, FileText, TrendingUp, HelpCircle } from 'lucide-react';

export const Dashboard = ({
  reports,
  activeReport,
  trends,
  loading,
  uploading,
  selectReport,
  uploadReport,
  user
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'values', 'precautions', 'questions', 'chat', 'trends'

  if (loading && !activeReport) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading your medical reports...</p>
      </div>
    );
  }

  const values = activeReport?.values || [];
  const abnormalCount = values.filter(v => v.status === 'high' || v.status === 'low').length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200 inline-block mb-2">
            Patient Health Dashboard
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.user_metadata?.full_name || 'Patient'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Active Report: <strong className="text-slate-800 font-semibold">{activeReport?.title || 'May 2026 Panel'}</strong> ({new Date(activeReport?.uploaded_at || Date.now()).toLocaleDateString()})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {reports.length > 1 && (
            <select
              value={activeReport?.id || ''}
              onChange={(e) => selectReport(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({new Date(r.uploaded_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Report</span>
          </button>
        </div>
      </div>

      {/* 2. Top Overview Row: Score Card + Plain Language Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <HealthScoreCard
          score={activeReport?.overall_score || 82}
          totalValues={values.length}
          abnormalCount={abnormalCount}
        />
        <div className="lg:col-span-2">
          <ReportSummary
            summaryText={activeReport?.summary_text}
            keyTakeaways={activeReport?.key_takeaways}
            areasToMonitor={activeReport?.areas_to_monitor}
          />
        </div>
      </div>

      {/* 3. Horizontal Navigation Pills Bar */}
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
            <span>Full Overview</span>
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
            {abnormalCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {abnormalCount} flagged
              </span>
            )}
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

          {/* Prominent Highlighted Q&A Chat Button */}
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

          <button
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'trends'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Biomarker Trends</span>
          </button>

        </div>
      </div>

      {/* 4. Active Tab View Content */}
      <div className="space-y-8">
        
        {/* Full Overview Tab (Shows all sections in clean order) */}
        {activeTab === 'all' && (
          <>
            <AbnormalValuesList values={values} />
            <PrecautionsList precautions={activeReport?.precautions || []} />
            <AskDoctorQuestions questions={activeReport?.questions} />
            
            {/* Embedded Q&A Assistant Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Interactive Q&A Assistant</h3>
              </div>
              <QAChat report={activeReport} userId={user?.id} />
            </div>

            <TrendsChart trendsData={trends} />
          </>
        )}

        {/* Tab 1: Extracted Values */}
        {activeTab === 'values' && (
          <AbnormalValuesList values={values} />
        )}

        {/* Tab 2: Precautions */}
        {activeTab === 'precautions' && (
          <PrecautionsList precautions={activeReport?.precautions || []} />
        )}

        {/* Tab 3: Doctor Questions */}
        {activeTab === 'questions' && (
          <AskDoctorQuestions questions={activeReport?.questions} />
        )}

        {/* Tab 4: Q&A Assistant (Full Screen / Dedicated View) */}
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
            <QAChat report={activeReport} userId={user?.id} />
          </div>
        )}

        {/* Tab 5: Trends */}
        {activeTab === 'trends' && (
          <TrendsChart trendsData={trends} />
        )}

      </div>

      {/* Upload Modal Overlay */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <UploadReport
            onUpload={uploadReport}
            onClose={() => setShowUploadModal(false)}
            isUploading={uploading}
          />
        </div>
      )}

    </div>
  );
};
