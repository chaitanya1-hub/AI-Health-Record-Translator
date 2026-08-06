import { useState, useEffect, useCallback } from 'react';
import { fetchUserReports, fetchReportDetail, uploadAndProcessReport, fetchTrendsData } from '../lib/medicalApi';
import { useAuth } from './useAuth';

export const useReports = (initialReportId = null) => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (targetReportId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const allReports = await fetchUserReports(user?.id);
      setReports(allReports);

      // Set active report
      let reportToFetch = targetReportId || initialReportId;
      let selected = null;
      
      if (reportToFetch) {
        selected = await fetchReportDetail(reportToFetch);
      } else if (allReports && allReports.length > 0) {
        selected = await fetchReportDetail(allReports[0].id);
      }
      setActiveReport(selected);

      // Load trends analytics
      const trendsData = await fetchTrendsData();
      setTrends(trendsData);
    } catch (err) {
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [user, initialReportId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectReport = async (reportId) => {
    setLoading(true);
    try {
      const detail = await fetchReportDetail(reportId);
      setActiveReport(detail);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadReport = async (file, title) => {
    setUploading(true);
    setError(null);
    try {
      const processedReport = await uploadAndProcessReport(file, title);
      await loadData(processedReport.id);
      return processedReport;
    } catch (err) {
      setError(err.message || 'Error processing report');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    reports,
    activeReport,
    trends,
    loading,
    uploading,
    error,
    selectReport,
    uploadReport,
    refreshReports: loadData
  };
};
