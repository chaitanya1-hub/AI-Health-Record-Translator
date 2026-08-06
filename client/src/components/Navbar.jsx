import React from 'react';
import { Activity, Upload, Clock, User, LogOut, LayoutDashboard, FileText } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenUpload, user, onLogout, isDemo }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">AI Health Record Translator</span>
                {isDemo && (
                  <span className="text-[10px] uppercase font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Plain language medical lab summaries & guidance</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Report History & Trends</span>
            </button>

            {activeTab === 'detail' && (
              <button
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-brand-700 shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Report Detail</span>
              </button>
            )}
          </nav>

          {/* Action CTAs & User Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenUpload}
              className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload New Report</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {user && (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200">
                  {user.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
