import React, { useState } from 'react';
import { TrendsChart } from '../components/TrendsChart';
import { FileText, Calendar, ChevronRight, Search, Plus } from 'lucide-react';

export const History = ({ reports = [], trends = [], onSelectReport, onOpenUpload }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200 inline-block mb-2">
            Historical Records & Analytics
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Report History & Trends</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past health panels, compare lab progression, and track biomarkers over time.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Lab Report</span>
        </button>
      </div>

      {/* Biomarker Trends Section */}
      <TrendsChart trendsData={trends} />

      {/* Historic Reports Table/Card Ledger */}
      <div className="medical-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">All Stored Medical Reports ({reports.length})</h2>
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 w-full sm:w-60 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredReports.map((r) => {
            const values = r.values || [];
            const abnormalCount = values.filter(v => v.status === 'high' || v.status === 'low').length;

            return (
              <div
                key={r.id}
                onClick={() => onSelectReport(r.id)}
                className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/30 hover:bg-white hover:border-brand-300 hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-700 transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(r.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-brand-50 text-slate-400 group-hover:text-brand-600 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 font-medium">Score:</span>
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {r.overall_score || 82} / 100
                    </span>
                  </div>

                  <div>
                    {abnormalCount > 0 ? (
                      <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {abnormalCount} flagged values
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        All values normal
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
