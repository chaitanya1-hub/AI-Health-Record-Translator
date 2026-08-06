import React from 'react';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export const ReportSummary = ({ summaryText = '', keyTakeaways = [], areasToMonitor = [] }) => {
  return (
    <div className="medical-card p-6 space-y-6">
      
      {/* Title & Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Plain-Language Summary</h3>
            <p className="text-xs text-slate-500">AI translation into clear patient terms</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Medical AI Analysis
        </span>
      </div>

      {/* Main Paragraph */}
      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
        <p className="text-sm text-slate-700 leading-relaxed font-normal">
          {summaryText || "This medical report details key metabolic and biological markers. Please review the key takeaways and specific areas to monitor below."}
        </p>
      </div>

      {/* Grid: Key Takeaways & Areas to Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Key Takeaways */}
        <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-100 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Key Takeaways & Strengths</span>
          </div>
          <ul className="space-y-2 pt-1">
            {keyTakeaways.length > 0 ? (
              keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-500">Normal systemic markers detected.</li>
            )}
          </ul>
        </div>

        {/* Areas to Monitor */}
        <div className="p-4 rounded-xl bg-amber-50/30 border border-amber-100 space-y-2">
          <div className="flex items-center space-x-2 text-amber-800 font-semibold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Areas to Track & Discuss</span>
          </div>
          <ul className="space-y-2 pt-1">
            {areasToMonitor.length > 0 ? (
              areasToMonitor.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-500">No critical areas flagged.</li>
            )}
          </ul>
        </div>

      </div>

    </div>
  );
};
