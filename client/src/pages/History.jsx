import React from 'react';
import { TrendsChart } from '../components/TrendsChart';
import { Clock, FileText, ChevronRight, Calendar, Activity, Plus } from 'lucide-react';

export const History = ({ reports = [], trends = [], onSelectReport, onOpenUpload }) => {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Report History & Biometric Trends</h1>
            <p className="text-xs text-slate-500">Chronological history of lab tests & continuous biomarker tracking</p>
          </div>
        </div>

        <button
          onClick={onOpenUpload}
          className="py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Report</span>
        </button>
      </div>

      {/* Analytics Chart */}
      <TrendsChart trendsData={trends} />

      {/* History List */}
      <div className="medical-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">All Submitted Medical Reports ({reports.length})</h3>
          <span className="text-xs text-slate-500">Sorted by Upload Date</span>
        </div>

        <div className="space-y-3">
          {reports.map((r) => {
            const abnormalCount = r.values?.filter(v => v.status === 'high' || v.status === 'low').length || 0;
            return (
              <div
                key={r.id}
                onClick={() => onSelectReport(r.id)}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-card-hover transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-600 flex items-center justify-center border border-slate-200 group-hover:bg-brand-50 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {r.title}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(r.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{r.values?.length || 0} lab values</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-extrabold text-slate-900">Score: {r.overall_score || 80}/100</span>
                    <p className="text-[11px] text-slate-500">
                      {abnormalCount > 0 ? `${abnormalCount} flagged` : 'All normal'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
