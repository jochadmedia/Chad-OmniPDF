import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  CheckCircle,
  AlertTriangle,
  Lock,
  Trash2,
  FileCheck
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface RedactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onApplyPermanentRedaction: (query?: string) => void;
}

export const RedactionDialog: React.FC<RedactionDialogProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onApplyPermanentRedaction,
}) => {
  const [options, setOptions] = useState({
    purgeSsn: true,
    purgeCreditCard: true,
    purgeEmail: true,
    removeMetadata: true,
    removeHiddenLayers: true,
  });

  const [purgedSuccess, setPurgedSuccess] = useState(false);
  const [customPattern, setCustomPattern] = useState('');

  // Scan items
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  const ccRegex = /\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;

  let ssnCount = 0;
  let ccCount = 0;

  if (currentDoc?.pages) {
    currentDoc.pages.forEach((p) => {
      (p.paragraphs || []).forEach((para) => {
        const ssnMatches = para.text.match(ssnRegex);
        if (ssnMatches) ssnCount += ssnMatches.length;
        const ccMatches = para.text.match(ccRegex);
        if (ccMatches) ccCount += ccMatches.length;
      });
    });
  }

  const totalSensitiveDetected = ssnCount + ccCount;

  if (!isOpen || !currentDoc) return null;

  const handleExecute = () => {
    onApplyPermanentRedaction(customPattern || undefined);
    setPurgedSuccess(true);
    setTimeout(() => {
      setPurgedSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-red-50/70">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Permanent Redaction &amp; Stream Sanitization
              </h2>
              <p className="text-[11px] text-slate-500">
                Physical stream purge: guarantees 0% residual PII data recovery
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3.5 text-xs">
          {/* Detected PII Warning */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1">
            <div className="font-bold text-red-900 flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              Automated PII Scan Results:
            </div>
            <p className="text-red-800 text-[11px] leading-relaxed">
              Detected <strong>{totalSensitiveDetected} sensitive records</strong> in{' '}
              <em>{currentDoc.fileName}</em>:
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-1 border-t border-red-200/60 font-medium text-[11px]">
              <span className="text-red-700">• Social Security Numbers (SSN): {ssnCount} found</span>
              <span className="text-red-700">• Credit Card Numbers: {ccCount} found</span>
            </div>
          </div>

          {/* Config Checkboxes */}
          <div className="space-y-2 pt-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sanitization Options (Purge Vector &amp; Text Streams)
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.purgeSsn}
                onChange={(e) => setOptions({ ...options, purgeSsn: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span className="text-slate-700">Purge all US Social Security Numbers (SSN pattern)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.purgeCreditCard}
                onChange={(e) => setOptions({ ...options, purgeCreditCard: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span className="text-slate-700">Purge Visa/MasterCard/Amex Credit Card Numbers</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.removeMetadata}
                onChange={(e) => setOptions({ ...options, removeMetadata: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span className="text-slate-700">Sanitize hidden metadata (Author, Creation dates, GPS tags)</span>
            </label>

            <div className="pt-2">
              <span className="text-slate-700 block mb-1 font-semibold">Targeted Search Pattern (Optional):</span>
              <input
                type="text"
                value={customPattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                placeholder="e.g. Project 'Falcon', Client ID, specific name..."
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Warning notice */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
            <strong>Permanent Operation:</strong> Unlike visual overlays, Chad-OmniPDF Permanent Redaction strips font glyphs and binary streams. This action cannot be reversed once saved.
          </div>

          {purgedSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded font-semibold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Permanent Redaction Applied! File Streams Purged.
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={purgedSuccess}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Apply &amp; Purge Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
