import React, { useState } from 'react';
import { Tag, X, Check, FileText } from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface BatesNumberingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onApplyBates: (prefix: string, startNumber: number) => void;
}

export const BatesNumberingModal: React.FC<BatesNumberingModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onApplyBates,
}) => {
  const [prefix, setPrefix] = useState('LIT-2026-');
  const [startNumber, setStartNumber] = useState(1);
  const [digits, setDigits] = useState(6);
  const [position, setPosition] = useState('bottom_right');

  const previewStr = `${prefix}${String(startNumber).padStart(digits, '0')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyBates(prefix, startNumber);
    onClose();
  };

  if (!isOpen || !currentDoc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">Add Bates Numbering (Legal Index)</h2>
              <p className="text-[11px] text-slate-500">
                Sequentially index discovery documents for litigation and trial evidence
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Prefix Case Code:</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g. LIT-2026-"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Start Number:</label>
              <input
                type="number"
                min={1}
                value={startNumber}
                onChange={(e) => setStartNumber(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Digit Padding:</label>
              <select
                value={digits}
                onChange={(e) => setDigits(parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800"
              >
                <option value={5}>5 digits (00001)</option>
                <option value={6}>6 digits (000001)</option>
                <option value={8}>8 digits (00000001)</option>
              </select>
            </div>
          </div>

          {/* Preview Box */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-blue-800 block mb-1">
              Sample Stamp Preview (Page 1)
            </span>
            <div className="text-sm font-mono font-bold text-blue-950 bg-white p-2 rounded border border-blue-200 text-center">
              {previewStr}
            </div>
            <div className="text-[10px] text-blue-600 mt-1">
              Applies across all {currentDoc.pageCount} pages in this document.
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
            >
              Apply Bates Stamping
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
