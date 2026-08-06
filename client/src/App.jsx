import React, { useState } from 'react';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { useReports } from './hooks/useReports';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ReportDetail } from './pages/ReportDetail';
import { History } from './pages/History';
import { UploadReport } from './components/UploadReport';

function MainApp() {
  const { user } = useAuthContext();
  const {
    reports,
    activeReport,
    trends,
    loading: reportsLoading,
    uploading,
    selectReport,
    uploadReport
  } = useReports();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'history', 'detail'
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleSelectReport = async (reportId) => {
    setSelectedReportId(reportId);
    await selectReport(reportId);
    setActiveTab('detail');
  };

  const handleUploadSuccess = async (file, title) => {
    const newRep = await uploadReport(file, title);
    if (newRep?.id) {
      setSelectedReportId(newRep.id);
      await selectReport(newRep.id);
      setActiveTab('detail');
    }
  };

  // Determine current detailed report object
  const detailedReport = reports.find(r => r.id === selectedReportId) || activeReport;

  return (
    <div className="min-h-screen bg-surface-bg text-slate-900 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setShowUploadModal(true)}
        user={user}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            reports={reports}
            activeReport={activeReport}
            trends={trends}
            loading={reportsLoading}
            uploading={uploading}
            selectReport={handleSelectReport}
            uploadReport={handleUploadSuccess}
            user={user}
          />
        )}

        {activeTab === 'history' && (
          <History
            reports={reports}
            trends={trends}
            onSelectReport={handleSelectReport}
            onOpenUpload={() => setShowUploadModal(true)}
          />
        )}

        {activeTab === 'detail' && (
          <ReportDetail
            report={detailedReport}
            onBack={() => setActiveTab('dashboard')}
            user={user}
          />
        )}
      </main>

      {/* Global Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <UploadReport
            onUpload={handleUploadSuccess}
            onClose={() => setShowUploadModal(false)}
            isUploading={uploading}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 AI Health Record Translator. Plain Language Medical Lab Summaries & Insights.</p>
        <p className="text-[11px] text-slate-400">
          Disclaimer: This application translates laboratory values into plain language for educational use only. Always consult a qualified medical doctor for diagnosis.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
