import React, { useState } from 'react';
import { HealthScoreCard } from '../components/HealthScoreCard';
import { AbnormalValuesList } from '../components/AbnormalValuesList';
import { ReportSummary } from '../components/ReportSummary';
import { AskDoctorQuestions } from '../components/AskDoctorQuestions';
import { PrecautionsList } from '../components/PrecautionsList';
import { QAChat } from '../components/QAChat';
import { TrendsChart } from '../components/TrendsChart';
import { UploadReport } from '../components/UploadReport';
import { FileText, Sparkles, MessageSquare, AlertTriangle, ShieldCheck, TrendingUp, Plus, ChevronRight } from 'lucide-react';

export const Dashboard = ({
  reports = [],
  activeReport = null,
  trends = [],
  loading = false,
  uploading = false,
  selectReport,
  uploadReport,
  user
}) => {
  const [activeViewSection, setActiveViewSection] = useState('overview'); // 'overview', 'qa', 'precautions', 'questions', 'trends'
  const [showUploadModal, setShowUploadModal] = useState(false);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500">Loading health records & processing lab markers...</p>
      </div>
    );
  }

  if (!activeReport && reports.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
          <FileText className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900">Welcome to AI Health Record Translator</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Upload your medical lab report (PDF, scanned image, or text file). Our AI extracts lab values, flags abnormal results, explains terms in plain language, and generates questions for your doctor.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload First Lab Report</span>
        </button>

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
  }

  const report = activeReport || reports[0];

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
            Active Selected Report
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">{report?.title || 'Lab Report'}</h1>
          <p className="text-xs text-slate-500">
            Uploaded {report?.uploaded_at ? new Date(report.uploaded_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'} • {report?.values?.length || 0} lab values extracted
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {reports.length > 1 && (
            <select
              value={report?.id || ''}
              onChange={(e) => selectReport(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-800"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({new Date(r.uploaded_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowUploadModal(true)}
            className="py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Report</span>
          </button>
        </div>
      </div>

      {/* Row 1: Health Score Gauge + Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HealthScoreCard
            score={report?.overall_score || 82}
            totalMarkers={report?.values?.length || 10}
            abnormalCount={report?.values?.filter(v => v.status === 'high' || v.status === 'low').length || 2}
          />
        </div>
        <div className="lg:col-span-2">
          <ReportSummary
            summaryText={report?.summary_text}
            keyTakeaways={report?.key_takeaways || []}
            areasToMonitor={report?.areas_to_monitor || []}
          />
        </div>
      </div>

      {/* Section Pill Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveViewSection('overview')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeViewSection === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Full Overview</span>
        </button>

        <button
          onClick={() => setActiveViewSection('qa')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeViewSection === 'qa'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand-300" />
          <span>Ask AI Q&A Assistant</span>
        </button>

        <button
          onClick={() => setActiveViewSection('precautions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeViewSection === 'precautions'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Precautions & Guidance</span>
        </button>

        <button
          onClick={() => setActiveViewSection('questions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeViewSection === 'questions'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-brand-600" />
          <span>Questions for Doctor</span>
        </button>

        <button
          onClick={() => setActiveViewSection('trends')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeViewSection === 'trends'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>Lab Trends Chart</span>
        </button>
      </div>

      {/* Main Content Sections based on Section Pills */}
      {activeViewSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AbnormalValuesList values={report?.values || []} />
            <PrecautionsList precautions={report?.precautions || []} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AskDoctorQuestions questions={report?.questions || []} />
            <QAChat reportId={report?.id} reportTitle={report?.title} />
          </div>

          <TrendsChart trendsData={trends} />
        </div>
      )}

      {activeViewSection === 'qa' && (
        <div className="max-w-4xl mx-auto">
          <QAChat reportId={report?.id} reportTitle={report?.title} />
        </div>
      )}

      {activeViewSection === 'precautions' && (
        <div className="max-w-4xl mx-auto">
          <PrecautionsList precautions={report?.precautions || []} />
        </div>
      )}

      {activeViewSection === 'questions' && (
        <div className="max-w-4xl mx-auto">
          <AskDoctorQuestions questions={report?.questions || []} />
        </div>
      )}

      {activeViewSection === 'trends' && (
        <div className="max-w-4xl mx-auto">
          <TrendsChart trendsData={trends} />
        </div>
      )}

      {/* Upload Modal */}
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
