import React, { useState } from 'react';
import { Stamp, X, Check, RotateCw, Sliders } from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface WatermarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onApplyWatermark: (watermarkText: string) => void;
}

export const WatermarkModal: React.FC<WatermarkModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onApplyWatermark,
}) => {
  const [watermarkText, setWatermarkText] = useState(
    currentDoc?.watermark || 'CONFIDENTIAL'
  );
  const presets = ['CONFIDENTIAL', 'DRAFT', 'RESTRICTED', 'INTERNAL USE ONLY', 'APPROVED', 'FINAL'];

  if (!isOpen || !currentDoc) return null;

  const handleApply = () => {
    onApplyWatermark(watermarkText.trim().toUpperCase());
    onClose();
  };

  const handleRemove = () => {
    onApplyWatermark('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-blue-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Stamp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Add Document Watermark</h3>
              <p className="text-[11px] text-slate-500">
                Overlay diagonal security stamp across all {currentDoc.pageCount} pages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Watermark Text
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="e.g. CONFIDENTIAL"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-bold tracking-widest text-slate-800 uppercase"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Standard Security Presets
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setWatermarkText(preset)}
                  className={`p-1.5 text-center text-[10px] font-semibold rounded border transition-colors ${
                    watermarkText === preset
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Box */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative h-28 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-20 pointer-events-none select-none text-[8px] font-mono text-slate-700">
              <div className="w-3/4 h-2 bg-slate-400 rounded-xs mb-1"></div>
              <div className="w-full h-2 bg-slate-300 rounded-xs mb-1"></div>
              <div className="w-5/6 h-2 bg-slate-300 rounded-xs mb-1"></div>
              <div className="w-2/3 h-2 bg-slate-300 rounded-xs"></div>
            </div>
            {watermarkText ? (
              <span className="transform -rotate-25 text-2xl font-black tracking-widest text-red-500/35 uppercase select-none pointer-events-none">
                {watermarkText}
              </span>
            ) : (
              <span className="text-slate-400 italic text-[11px]">No watermark applied</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          {currentDoc.watermark ? (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              Remove Existing
            </button>
          ) : (
            <div></div>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Apply Watermark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
