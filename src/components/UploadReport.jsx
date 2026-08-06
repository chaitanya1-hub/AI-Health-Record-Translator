import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, X } from 'lucide-react';

export const UploadReport = ({ onUpload, onClose, isUploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [uploadStep, setUploadStep] = useState(0); // 0: select, 1: processing
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    if (file.type.includes('pdf') || file.type.includes('image')) {
      setSelectedFile(file);
      if (!reportTitle) {
        setReportTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '));
      }
    } else {
      alert('Please upload a PDF or image file (PNG, JPG, WEBP).');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadStep(1);
    try {
      await onUpload(selectedFile, reportTitle);
      if (onClose) onClose();
    } catch (err) {
      setUploadStep(0);
    }
  };

  const handleLoadSample = async () => {
    // Create a mock blob for quick demo testing
    const sampleBlob = new Blob(["Sample Medical Lab Report Content - Blood Glucose: 92 mg/dL, Total Cholesterol: 198 mg/dL, Vitamin D: 22 ng/mL"], { type: 'application/pdf' });
    const sampleFile = new File([sampleBlob], "Lab_Report_Current.pdf", { type: 'application/pdf' });
    setSelectedFile(sampleFile);
    setReportTitle("Lipid & Vitamin D Follow-up Lab");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-xl w-full mx-auto">
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Upload Lab Report</h3>
            <p className="text-xs text-slate-500">PDFs, PNG, or JPG lab results</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6">
        {uploadStep === 1 || isUploading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin flex items-center justify-center"></div>
              <Sparkles className="w-6 h-6 text-brand-600 absolute top-5 left-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Analyzing Your Report...</h4>
              <p className="text-sm text-slate-500 max-w-xs mt-1">
                Our AI is extracting medical values, scoring risks, and translating complex terms into plain language.
              </p>
            </div>
            <div className="w-full max-w-xs space-y-2 text-xs text-slate-500 pt-2">
              <div className="flex items-center justify-between text-brand-700 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> File Ingestion</span>
                <span>Done</span>
              </div>
              <div className="flex items-center justify-between text-brand-700 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Medical Value Extraction</span>
                <span>Done</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 font-medium animate-pulse">
                <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> AI Summary & Doctor Questions</span>
                <span>In Progress</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Report Title / Description
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Annual Blood Panel - May 2026"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-brand-500 bg-brand-50/50'
                  : selectedFile
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • Ready to analyze</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="text-xs text-rose-600 hover:underline pt-1"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-1">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Supports PDF or High-Resolution Images</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Pre-loader */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">Want to test without a file?</span>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
              >
                Use sample report file
              </button>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!selectedFile}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-sm flex items-center justify-center space-x-2 transition-all ${
                  selectedFile
                    ? 'bg-brand-600 hover:bg-brand-700 cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Translate Report in Plain Language</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
