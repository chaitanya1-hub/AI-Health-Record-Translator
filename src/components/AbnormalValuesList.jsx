import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, Search } from 'lucide-react';

export const AbnormalValuesList = ({ values = [] }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'flagged', 'normal'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredValues = values.filter(v => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'flagged' ? (v.status === 'high' || v.status === 'low' || v.status === 'abnormal') :
      filter === 'normal' ? v.status === 'normal' : true;

    const matchesSearch = v.test_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" /> High
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" /> Low
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Normal
          </span>
        );
    }
  };

  const flaggedCount = values.filter(v => v.status === 'high' || v.status === 'low').length;

  return (
    <div className="medical-card p-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900">Extracted Lab Values</h3>
            {flaggedCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {flaggedCount} Flagged
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare your detected test numbers against medical reference ranges.
          </p>
        </div>

        {/* Search & Filter Tabs */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search marker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 w-36 sm:w-44 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
            >
              All ({values.length})
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filter === 'flagged' ? 'bg-white text-amber-700 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
            >
              Flagged ({flaggedCount})
            </button>
            <button
              onClick={() => setFilter('normal')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filter === 'normal' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
            >
              Normal
            </button>
          </div>
        </div>
      </div>

      {/* Values List Grid */}
      {filteredValues.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
          No lab markers match the selected filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredValues.map((v) => (
            <div
              key={v.id || v.test_name}
              className={`p-4 rounded-xl border transition-all ${
                v.status === 'high'
                  ? 'bg-amber-50/20 border-amber-200/70 hover:border-amber-300'
                  : v.status === 'low'
                  ? 'bg-rose-50/20 border-rose-200/70 hover:border-rose-300'
                  : 'bg-slate-50/40 border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                
                {/* Left: Test Name & Explanation */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">{v.test_name}</span>
                    {getStatusBadge(v.status)}
                  </div>
                  {v.explanation && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {v.explanation}
                    </p>
                  )}
                </div>

                {/* Right: Value & Reference Range */}
                <div className="flex items-center space-x-4 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block font-medium">Your Value</span>
                    <span className={`text-base font-extrabold ${
                      v.status === 'high' ? 'text-amber-700' :
                      v.status === 'low' ? 'text-rose-700' : 'text-slate-900'
                    }`}>
                      {v.value} <span className="text-xs font-normal text-slate-500">{v.unit}</span>
                    </span>
                  </div>

                  <div className="text-left sm:text-right border-l border-slate-200 pl-4">
                    <span className="text-xs text-slate-400 block font-medium">Standard Range</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {v.reference_range} {v.unit}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
