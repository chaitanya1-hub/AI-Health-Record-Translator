import React from 'react';
import { Activity, FileText, TrendingUp, LogOut, Upload, ShieldCheck, User } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenUpload, user, onLogout, isDemo }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                HealthTranslate <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">AI</span>
              </span>
              <span className="text-xs text-slate-500 block -mt-0.5">Plain-Language Medical Reports</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Report History & Trends</span>
            </button>
          </nav>

          {/* Action Button & User Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenUpload}
              className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Report</span>
            </button>

            {/* Profile Dropdown / User Info */}
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-3 ml-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden lg:block text-xs">
                <p className="font-semibold text-slate-800 leading-tight">
                  {user?.user_metadata?.full_name || 'Patient'}
                </p>
                <p className="text-slate-500 flex items-center gap-1">
                  {isDemo ? (
                    <span className="text-amber-600 font-medium">Demo Mode</span>
                  ) : (
                    <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Supabase
                    </span>
                  )}
                </p>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Log out"
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
