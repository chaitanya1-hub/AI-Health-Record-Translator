import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

export const AbnormalValuesList = ({ values = [] }) => {
  const [expandedId, setExpandedId] = useState(null);

  const abnormalValues = values.filter(v => v.status === 'high' || v.status === 'low');
  const normalValues = values.filter(v => v.status === 'normal');

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="medical-card p-6 space-y-6">
      
      {/* Flagged Values Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Flagged Abnormal Values</h3>
              <p className="text-xs text-slate-500">Results falling outside standard reference range</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {abnormalValues.length} Flagged
          </span>
        </div>

        {abnormalValues.length === 0 ? (
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-center space-y-1">
            <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-emerald-900">All Lab Values In Normal Range</p>
            <p className="text-[11px] text-emerald-700">No abnormal flags were detected in this report.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {abnormalValues.map((v) => {
              const isHigh = v.status === 'high';
              const badgeStyle = isHigh
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-amber-50 text-amber-800 border-amber-200';

              const isExpanded = expandedId === v.id;

              return (
                <div
                  key={v.id || v.test_name}
                  className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all bg-white"
                >
                  <div className="flex items-start justify-between cursor-pointer" onClick={() => toggleExpand(v.id)}>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{v.test_name}</span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                          {v.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Reference Range: <span className="font-semibold text-slate-700">{v.reference_range} {v.unit}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-base font-black text-slate-900">
                          {v.value} <span className="text-xs font-medium text-slate-500">{v.unit}</span>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Explanation drawer */}
                  <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/70 p-3 rounded-lg flex items-start space-x-2">
                    <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong className="font-semibold text-slate-900">Plain Language Context: </strong>
                      {v.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Normal Values Accordion */}
      {normalValues.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <details className="group">
            <summary className="flex items-center justify-between text-xs font-semibold text-slate-600 cursor-pointer py-2 hover:text-slate-900">
              <span className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>View All Normal Lab Values ({normalValues.length})</span>
              </span>
              <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {normalValues.map((nv) => (
                <div key={nv.id || nv.test_name} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between items-center">
                  <span className="font-medium text-slate-800">{nv.test_name}</span>
                  <span className="font-bold text-slate-900">{nv.value} <span className="text-[10px] text-slate-500 font-normal">{nv.unit}</span></span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

    </div>
  );
};
