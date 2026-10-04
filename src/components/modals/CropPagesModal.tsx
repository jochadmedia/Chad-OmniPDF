import React, { useState } from 'react';
import {
  Scissors,
  X,
  Check,
  RotateCcw,
  Sliders,
  Crop
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface CropPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onApplyCrop: (pageNumber: number, margins: { top: number; bottom: number; left: number; right: number }, applyToAll?: boolean) => void;
}

export const CropPagesModal: React.FC<CropPagesModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  onApplyCrop,
}) => {
  const [margins, setMargins] = useState({
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  });
  const [applyToAll, setApplyToAll] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-blue-50/70">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">Crop Pages Caliper</h2>
              <p className="text-[11px] text-slate-500">
                Adjust margins to trim printer bleed, headers, or scanner borders
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          {/* Visual Crop Box Preview */}
          <div className="flex justify-center p-3 bg-slate-100 rounded-lg">
            <div className="relative w-44 h-56 bg-white border border-slate-300 shadow-sm rounded-xs flex items-center justify-center">
              <div
                style={{
                  position: 'absolute',
                  top: `${margins.top * 1.5}%`,
                  bottom: `${margins.bottom * 1.5}%`,
                  left: `${margins.left * 1.5}%`,
                  right: `${margins.right * 1.5}%`,
                }}
                className="border-2 border-dashed border-blue-600 bg-blue-50/30 flex items-center justify-center"
              >
                <span className="text-[9px] font-mono text-blue-700 font-bold">Crop Boundary</span>
              </div>
            </div>
          </div>

          {/* Margins Sliders */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Top Margin:</span>
                <span className="font-mono text-blue-600">{margins.top}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={margins.top}
                onChange={(e) => setMargins({ ...margins, top: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Bottom Margin:</span>
                <span className="font-mono text-blue-600">{margins.bottom}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={margins.bottom}
                onChange={(e) => setMargins({ ...margins, bottom: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Left Margin:</span>
                <span className="font-mono text-blue-600">{margins.left}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={margins.left}
                onChange={(e) => setMargins({ ...margins, left: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Right Margin:</span>
                <span className="font-mono text-blue-600">{margins.right}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={margins.right}
                onChange={(e) => setMargins({ ...margins, right: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-slate-700 font-medium">Apply crop boundary to all pages</span>
          </label>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApplyCrop(applyToAll ? -1 : currentPage, margins, applyToAll);
                onClose();
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" /> Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
