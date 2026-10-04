import React, { useState } from 'react';
import {
  Scissors,
  X,
  Check,
  Download,
  FileText
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';
import { exportDocumentToPdfBlob } from '../../utils/pdfExport';

interface SplitPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onSplitComplete?: (part1: PdfDocument, part2: PdfDocument) => void;
}

export const SplitPdfModal: React.FC<SplitPdfModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onSplitComplete,
}) => {
  const [splitAtPage, setSplitAtPage] = useState<number>(
    Math.max(1, Math.floor((currentDoc?.pageCount || 2) / 2))
  );
  const [isSplitting, setIsSplitting] = useState(false);

  if (!isOpen || !currentDoc) return null;

  const handleExecuteSplit = async () => {
    setIsSplitting(true);
    try {
      // Document Part 1: pages 1 to splitAtPage
      const part1: PdfDocument = {
        ...currentDoc,
        id: `${currentDoc.id}-part1`,
        title: `${currentDoc.title} (Part 1)`,
        fileName: `${currentDoc.fileName.replace(/\.pdf$/i, '')}_Part1.pdf`,
        pages: currentDoc.pages.slice(0, splitAtPage),
        pageCount: splitAtPage,
      };

      // Document Part 2: pages splitAtPage+1 to end
      const part2: PdfDocument = {
        ...currentDoc,
        id: `${currentDoc.id}-part2`,
        title: `${currentDoc.title} (Part 2)`,
        fileName: `${currentDoc.fileName.replace(/\.pdf$/i, '')}_Part2.pdf`,
        pages: currentDoc.pages.slice(splitAtPage),
        pageCount: currentDoc.pageCount - splitAtPage,
      };

      const blob1 = await exportDocumentToPdfBlob(part1);
      const url1 = URL.createObjectURL(blob1);
      const a1 = document.createElement('a');
      a1.href = url1;
      a1.download = part1.fileName;
      document.body.appendChild(a1);
      a1.click();
      document.body.removeChild(a1);

      setTimeout(async () => {
        const blob2 = await exportDocumentToPdfBlob(part2);
        const url2 = URL.createObjectURL(blob2);
        const a2 = document.createElement('a');
        a2.href = url2;
        a2.download = part2.fileName;
        document.body.appendChild(a2);
        a2.click();
        document.body.removeChild(a2);
        onSplitComplete?.(part1, part2);
        setIsSplitting(false);
        onClose();
      }, 500);
    } catch (err) {
      setIsSplitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-amber-50/70">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">Split Document</h2>
              <p className="text-[11px] text-slate-500">
                Divide {currentDoc.fileName} into separate PDF files
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Split after Page Number:
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={Math.max(1, currentDoc.pageCount - 1)}
                value={splitAtPage}
                onChange={(e) => setSplitAtPage(Number(e.target.value))}
                className="w-24 bg-slate-50 border border-slate-300 rounded p-1.5 font-mono text-center text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="text-slate-500 text-[11px]">
                (Total: {currentDoc.pageCount} pages)
              </span>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Part 1:</span>
              <span className="font-mono text-slate-600">Pages 1 to {splitAtPage} ({splitAtPage} pages)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Part 2:</span>
              <span className="font-mono text-slate-600">
                Pages {splitAtPage + 1} to {currentDoc.pageCount} ({currentDoc.pageCount - splitAtPage} pages)
              </span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteSplit}
              disabled={isSplitting || currentDoc.pageCount <= 1}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              {isSplitting ? 'Splitting & Downloading...' : 'Split & Download Files'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
