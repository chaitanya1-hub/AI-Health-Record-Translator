import React from 'react';


export const HealthScoreCard = ({ score = 82, totalValues = 10, abnormalCount = 2 }) => {
  // Determine score colors & status
  let statusText = 'Optimal Health';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let strokeColor = '#10B981'; // Emerald

  if (score < 70) {
    statusText = 'Attention Required';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
    strokeColor = '#EF4444'; // Rose
  } else if (score < 85) {
    statusText = 'Mild Findings';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    strokeColor = '#7C3AED'; // Violet accent ring
  }

  // SVG Circular math
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="medical-card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Score</span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">Health Score</h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColor}`}>
          {statusText}
        </span>
      </div>

      {/* SVG Score Ring */}
      <div className="my-6 flex items-center justify-center relative">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{score}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-slate-500 font-medium">Normal Values</div>
          <div className="text-sm font-bold text-emerald-600 mt-0.5">
            {totalValues - abnormalCount} <span className="text-xs font-normal text-slate-400">of {totalValues}</span>
          </div>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="text-slate-500 font-medium">Flagged Items</div>
          <div className={`text-sm font-bold mt-0.5 ${abnormalCount > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
            {abnormalCount} <span className="text-xs font-normal text-slate-400">out of range</span>
          </div>
        </div>
      </div>
    </div>
  );
};
