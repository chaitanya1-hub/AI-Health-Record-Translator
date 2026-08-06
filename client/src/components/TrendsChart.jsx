import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, Activity, Filter } from 'lucide-react';

export const TrendsChart = ({ trendsData = [] }) => {
  const [selectedMarker, setSelectedMarker] = useState('LDL Cholesterol');

  const markersList = [
    'LDL Cholesterol',
    'Fasting Blood Glucose',
    'Serum Ferritin',
    'Total Cholesterol',
    'TSH (Thyroid)'
  ];

  return (
    <div className="medical-card p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Health Changes & Lab Trends Over Time</h3>
            <p className="text-xs text-slate-500">Track key biometrics across consecutive laboratory reports</p>
          </div>
        </div>

        {/* Selector */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedMarker}
            onChange={(e) => setSelectedMarker(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-800"
          >
            {markersList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        {trendsData && trendsData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendsData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey={selectedMarker}
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 5, fill: '#7c3aed', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            Upload multiple lab reports over time to visualize trend lines.
          </div>
        )}
      </div>

    </div>
  );
};
