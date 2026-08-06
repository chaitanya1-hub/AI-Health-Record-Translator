import React from 'react';
import { Activity, CheckCircle, AlertTriangle } from 'lucide-react';

export const HealthScoreCard = ({ score = 82, totalMarkers = 10, abnormalCount = 2 }) => {
  // SVG Ring calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return { stroke: '#7c3aed', text: 'text-brand-600', label: 'Optimal / Stable' };
    if (score >= 65) return { stroke: '#f59e0b', text: 'text-amber-600', label: 'Attention Needed' };
    return { stroke: '#ef4444', text: 'text-rose-600', label: 'Requires Follow-up' };
  };

  const statusInfo = getScoreColor();

  return (
    <div className="medical-card p-6 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Report Health Score</span>
          <h3 className="text-sm font-bold text-slate-900">Overall Panel Rating</h3>
        </div>
        <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
          <Activity className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-center space-x-6 py-1">
        {/* SVG Circular Score Ring */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={statusInfo.stroke}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">{score}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">/ 100</span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-extrabold ${statusInfo.text} px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200/60`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Normal Markers:
              </span>
              <span className="font-bold text-slate-800">{totalMarkers - abnormalCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Flagged Values:
              </span>
              <span className="font-bold text-slate-800">{abnormalCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
