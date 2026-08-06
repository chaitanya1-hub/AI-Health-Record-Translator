import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle2, Sparkles, Shield } from 'lucide-react';

export const UploadReport = ({ onUpload, onClose, isUploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [customTitle, setCustomTitle] = useState('');
  const [error, setError] = useState(null);
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

  const validateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|png|jpg|jpeg|txt)$/i)) {
      setError('Please upload a valid lab report document (PDF, PNG, JPG, or TXT).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB max
      setError('File size exceeds 15MB limit.');
      return;
    }

    setSelectedFile(file);
    if (!customTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setCustomTitle(cleanName);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please drag & drop or select a lab report file.');
      return;
    }

    try {
      await onUpload(selectedFile, customTitle);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Failed to process report');
    }
  };

  const useSampleFile = () => {
    const sampleBlob = new Blob([
      "LABORATORY TEST RESULT REPORT\nDate: 2026-05-14\nFasting Blood Glucose: 92 mg/dL (Normal Range: 70-99)\nHemoglobin A1c: 5.4%\nTotal Cholesterol: 198 mg/dL\nLDL Cholesterol: 124 mg/dL (High)\nHDL Cholesterol: 58 mg/dL\nSerum Ferritin: 24 ng/mL\nTSH: 2.1 mIU/L"
    ], { type: 'text/plain' });

    const sampleFile = new File([sampleBlob], "Sample_Blood_Panel_2026.txt", { type: "text/plain" });
    setSelectedFile(sampleFile);
    setCustomTitle("Sample Blood Panel 2026");
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
      
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Upload Lab Report</h2>
          <p className="text-xs text-slate-500">PDF, scanned image, or text file up to 15MB</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Report Label / Title (Optional)
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="e.g. Annual Blood Work 2026"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
              : selectedFile
              ? 'border-emerald-300 bg-emerald-50/40'
              : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
              <p className="text-[11px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB — Click to change file</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Drag & drop your medical lab report here
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">or click to browse from device</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick sample option */}
        {!selectedFile && (
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Don't have a report handy?</span>
            <button
              type="button"
              onClick={useSampleFile}
              className="text-brand-600 hover:underline font-semibold flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use sample report file</span>
            </button>
          </div>
        )}

        {/* Security badge */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center space-x-2 text-[11px] text-slate-500">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Private & Encrypted. Your health records are processed securely.</span>
        </div>

        {/* Action button */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Extracting & Translating Report with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Translate Report in Plain Language</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};
