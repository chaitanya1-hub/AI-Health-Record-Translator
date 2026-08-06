import React, { useState } from 'react';
import { AlertTriangle, Apple, Activity, ShieldCheck, Heart, Info, Filter } from 'lucide-react';

export const PrecautionsList = ({ precautions = [] }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'urgent', 'diet', 'lifestyle'

  const filteredPrecautions = precautions.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return p.category === 'urgent';
    if (filter === 'diet_lifestyle') return p.category === 'diet' || p.category === 'lifestyle';
    return p.category === filter;
  });

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Urgent / Medical Note
          </span>
        );
      case 'diet':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Apple className="w-3.5 h-3.5 text-emerald-600" /> Dietary Tip
          </span>
        );
      case 'lifestyle':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
            <Activity className="w-3.5 h-3.5 text-brand-600" /> Lifestyle Tip
          </span>
        );
      case 'general':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> General Wellness
          </span>
        );
    }
  };

  const urgentCount = precautions.filter((p) => p.category === 'urgent').length;

  return (
    <div className="medical-card p-6 space-y-4">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900">Precautions & Wellness Guidance</h3>
            {urgentCount > 0 && (
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                {urgentCount} Medical Note
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            General wellness tips and physician consultation recommendations based on your report.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            All ({precautions.length})
          </button>
          {urgentCount > 0 && (
            <button
              onClick={() => setFilter('urgent')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'urgent' ? 'bg-white text-rose-800 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              Urgent ({urgentCount})
            </button>
          )}
          <button
            onClick={() => setFilter('diet_lifestyle')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filter === 'diet_lifestyle' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Diet & Lifestyle
          </button>
        </div>
      </div>

      {/* Precautions List */}
      {filteredPrecautions.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
          No precautions found matching the selected filter.
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {filteredPrecautions.map((p, idx) => (
            <div
              key={p.id || idx}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                p.category === 'urgent'
                  ? 'bg-rose-50/30 border-rose-200/90 shadow-2xs'
                  : p.category === 'diet'
                  ? 'bg-emerald-50/20 border-emerald-200/70'
                  : p.category === 'lifestyle'
                  ? 'bg-brand-50/20 border-brand-200/70'
                  : 'bg-slate-50/40 border-slate-200/70'
              }`}
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  {getCategoryBadge(p.category)}
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed pt-1">
                  {p.precaution_text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Physician Positioning Footnote */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-start space-x-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold text-slate-800">Wellness Disclaimer:</strong> Precautions are provided strictly for general health, diet, and lifestyle awareness. They do not substitute for professional medical diagnosis or treatment. Always discuss out-of-range lab results with your doctor.
        </p>
      </div>
    </div>
  );
};
