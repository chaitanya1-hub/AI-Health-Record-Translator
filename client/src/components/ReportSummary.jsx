import React from 'react';
import { FileText, Sparkles, CheckCircle2, Eye, ShieldAlert } from 'lucide-react';

export const ReportSummary = ({ summaryText = '', keyTakeaways = [], areasToMonitor = [] }) => {
  return (
    <div className="medical-card p-6 space-y-6">
      
      {/* Executive Summary Header */}
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
        <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Plain Language Executive Summary</h3>
          <p className="text-xs text-slate-500">AI translation of clinical medical terms</p>
        </div>
      </div>

      {/* Main Plain Language Paragraph */}
      <div className="bg-brand-50/50 border border-brand-100/80 rounded-xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
        {summaryText || 'Your report analysis is complete. Summary details are ready below.'}
      </div>

      {/* Key Takeaways & Focus Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Key Positive Takeaways */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Key Positive Takeaways</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Monitor */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
            <Eye className="w-4 h-4 text-amber-600" />
            <span>Areas to Monitor</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {areasToMonitor.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Doctor Consultation Reminder */}
      <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <ShieldAlert className="w-4 h-4 text-brand-600 shrink-0" />
        <span>This plain-language summary helps you prepare for your doctor's appointment. It is not a clinical diagnosis.</span>
      </div>

    </div>
  );
};
