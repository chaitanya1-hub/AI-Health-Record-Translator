import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Stethoscope, HelpCircle } from 'lucide-react';

export const AskDoctorQuestions = ({ questions = [] }) => {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAll = () => {
    const allText = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(allText);
    setCopiedIdx('all');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="medical-card p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Suggested Questions for Your Doctor</h3>
            <p className="text-xs text-slate-500">Prepared questions grounded directly in your flagged lab values</p>
          </div>
        </div>

        {questions.length > 0 && (
          <button
            onClick={copyAll}
            className="flex items-center space-x-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-all"
          >
            {copiedIdx === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Questions</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-3">
        {questions.map((question, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-all flex items-start justify-between space-x-4"
          >
            <div className="flex items-start space-x-3">
              <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs font-medium text-slate-800 leading-relaxed">
                {question}
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(question, idx)}
              title="Copy question text"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-all shrink-0"
            >
              {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* Helpful note */}
      <div className="bg-brand-50/40 p-3.5 rounded-xl border border-brand-100/70 text-xs text-slate-700 flex items-center space-x-2">
        <HelpCircle className="w-4 h-4 text-brand-600 shrink-0" />
        <span>Tip: Print or show these questions to your physician during your next routine appointment.</span>
      </div>

    </div>
  );
};
