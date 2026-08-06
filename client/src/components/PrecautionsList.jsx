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
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <Activity className="w-3.5 h-3.5 text-blue-600" /> Lifestyle & Exercise
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Wellness Guidance
          </span>
        );
    }
  };

  return (
    <div className="medical-card p-6 space-y-6">
      
      {/* Header & Filter Pill Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Precautions & Wellness Guidance</h3>
            <p className="text-xs text-slate-500">General nutrition, habits, and doctor advisory notes</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === 'all' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tips ({precautions.length})
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === 'urgent' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Urgent Notes
          </button>
          <button
            onClick={() => setFilter('diet_lifestyle')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === 'diet_lifestyle' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diet & Habits
          </button>
        </div>
      </div>

      {/* Precautions List */}
      <div className="space-y-3">
        {filteredPrecautions.map((p) => {
          const isUrgent = p.category === 'urgent';
          return (
            <div
              key={p.id || p.precaution_text}
              className={`p-4 rounded-xl border transition-all ${
                isUrgent
                  ? 'bg-rose-50/40 border-rose-200/90 hover:border-rose-300'
                  : 'bg-slate-50/50 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                {getCategoryBadge(p.category)}
              </div>
              <p className="text-xs font-medium text-slate-800 leading-relaxed pl-1">
                {p.precaution_text}
              </p>
            </div>
          );
        })}
      </div>

      {/* General Disclaimer Footer */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start space-x-2 text-[11px] text-slate-500">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Wellness tips are provided for general health education (hydration, sleep, balanced nutrition) and are not a substitute for clinical medical evaluation.
        </span>
      </div>

    </div>
  );
};
