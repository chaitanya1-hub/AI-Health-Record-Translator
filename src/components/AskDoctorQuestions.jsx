import React, { useState } from 'react';
import { MessageSquarePlus, Copy, Check, Printer, HelpCircle } from 'lucide-react';

export const AskDoctorQuestions = ({ questions = [] }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleCopyOne = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const textToCopy = questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="medical-card p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Suggested Questions for Your Doctor</h3>
            <p className="text-xs text-slate-500">Prepared questions based on your specific flagged lab results</p>
          </div>
        </div>

        {/* Copy All & Print CTAs */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {allCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied All</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy All</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print List</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          No specific questions generated. All lab values appear standard!
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-brand-200 transition-all flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-800 font-medium leading-snug">
                  {q}
                </p>
              </div>

              <button
                onClick={() => handleCopyOne(q, idx)}
                title="Copy question"
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-white transition-colors shrink-0"
              >
                {copiedIndex === idx ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Consultation Note */}
      <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200/60 flex items-start space-x-2 text-xs text-amber-800">
        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold">Tip for your visit:</strong> Show these questions directly to your physician or paste them into your patient portal message.
        </p>
      </div>
    </div>
  );
};
