import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { TrendingUp, Filter } from 'lucide-react';

export const TrendsChart = ({ trendsData = [] }) => {
  // Available markers for selector
  const availableMarkers = [
    { key: 'LDL Cholesterol', unit: 'mg/dL', target: 100, isUpperLimit: true },
    { key: 'Fasting Blood Glucose', unit: 'mg/dL', target: 99, isUpperLimit: true },
    { key: 'Serum Ferritin', unit: 'ng/mL', target: 20, isUpperLimit: false },
    { key: 'Hemoglobin A1c', unit: '%', target: 5.7, isUpperLimit: true },
    { key: 'Total Cholesterol', unit: 'mg/dL', target: 200, isUpperLimit: true }
  ];

  const [selectedMarkerKey, setSelectedMarkerKey] = useState('LDL Cholesterol');
  const activeMarker = availableMarkers.find(m => m.key === selectedMarkerKey) || availableMarkers[0];

  // Calculate trend metrics
  const valuesArray = trendsData
    .map(item => item[selectedMarkerKey])
    .filter(val => val !== undefined && val !== null);

  const firstVal = valuesArray[0] || 0;
  const latestVal = valuesArray[valuesArray.length - 1] || 0;
  const diff = latestVal - firstVal;

  let trendBadge = 'Stable';
  let trendClass = 'bg-slate-100 text-slate-700';

  if (valuesArray.length > 1) {
    if (activeMarker.isUpperLimit) {
      if (diff < 0) {
        trendBadge = `Improved by ${Math.abs(diff).toFixed(1)} ${activeMarker.unit}`;
        trendClass = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      } else if (diff > 0) {
        trendBadge = `Increased by ${diff.toFixed(1)} ${activeMarker.unit}`;
        trendClass = 'bg-amber-50 text-amber-800 border border-amber-200';
      }
    } else {
      if (diff > 0) {
        trendBadge = `Recovered by +${diff.toFixed(1)} ${activeMarker.unit}`;
        trendClass = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      } else if (diff < 0) {
        trendBadge = `Decreased by ${diff.toFixed(1)} ${activeMarker.unit}`;
        trendClass = 'bg-rose-50 text-rose-800 border border-rose-200';
      }
    }
  }

  return (
    <div className="medical-card p-6">
      
      {/* Header & Marker Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Health Marker Trends Over Time</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track historical changes across your lab reports to monitor progress.
          </p>
        </div>

        {/* Marker Dropdown Selector */}
        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Marker:
          </label>
          <select
            value={selectedMarkerKey}
            onChange={(e) => setSelectedMarkerKey(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {availableMarkers.map((m) => (
              <option key={m.key} value={m.key}>
                {m.key} ({m.unit})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Highlight Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Latest Measurement</span>
          <div className="text-xl font-extrabold text-slate-900 mt-0.5">
            {latestVal} <span className="text-xs font-normal text-slate-500">{activeMarker.unit}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Target Reference Threshold</span>
          <div className="text-xl font-extrabold text-slate-700 mt-0.5">
            {activeMarker.isUpperLimit ? `< ${activeMarker.target}` : `> ${activeMarker.target}`} <span className="text-xs font-normal text-slate-500">{activeMarker.unit}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-center">
          <span className="text-xs text-slate-500 font-medium mb-1">Historical Trajectory</span>
          <div>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${trendClass}`}>
              {trendBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Line Graph */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendsData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748B', fontSize: 12 }} domain={['auto', 'auto']} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg space-y-1">
                      <p className="font-semibold text-slate-300">{label} • {dataPoint.reportTitle}</p>
                      <p className="text-brand-300 text-sm font-bold">
                        {selectedMarkerKey}: {payload[0].value} {activeMarker.unit}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={activeMarker.target}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              label={{
                value: `Target (${activeMarker.target} ${activeMarker.unit})`,
                fill: '#B45309',
                fontSize: 11,
                position: 'top'
              }}
            />
            <Line
              type="monotone"
              dataKey={selectedMarkerKey}
              stroke="#7C3AED"
              strokeWidth={3}
              dot={{ fill: '#7C3AED', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
