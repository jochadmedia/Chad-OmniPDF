import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  AlertTriangle,
  Trash2,
  Layers,
  Paperclip,
  Bookmark,
  FileCode
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface SanitizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onConfirmSanitize: (options: {
    removeMetadata: boolean;
    removeAttachments: boolean;
    removeHiddenLayers: boolean;
    removeBookmarks: boolean;
  }) => void;
}

export const SanitizeModal: React.FC<SanitizeModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onConfirmSanitize,
}) => {
  const [options, setOptions] = useState({
    removeMetadata: true,
    removeAttachments: true,
    removeHiddenLayers: true,
    removeBookmarks: false,
  });

  if (!isOpen || !currentDoc) return null;

  const handleExecute = () => {
    onConfirmSanitize(options);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Document Sanitization Review
              </h2>
              <p className="text-[11px] text-slate-500">
                Purge hidden information, metadata streams, attachments, and private tags
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3.5 text-xs">
          <div className="text-slate-600 leading-relaxed">
            Select hidden artifacts to permanently strip from <strong>{currentDoc.fileName}</strong>:
          </div>

          <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 text-slate-800">
                <FileCode className="w-4 h-4 text-slate-500" />
                <span>Document Metadata (Author, Title, Modification times)</span>
              </span>
              <input
                type="checkbox"
                checked={options.removeMetadata}
                onChange={(e) => setOptions({ ...options, removeMetadata: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 text-slate-800">
                <Paperclip className="w-4 h-4 text-slate-500" />
                <span>Embedded Attachments ({currentDoc.attachments.length} files)</span>
              </span>
              <input
                type="checkbox"
                checked={options.removeAttachments}
                onChange={(e) => setOptions({ ...options, removeAttachments: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 text-slate-800">
                <Layers className="w-4 h-4 text-slate-500" />
                <span>Hidden &amp; Optional Content Layers (OCG)</span>
              </span>
              <input
                type="checkbox"
                checked={options.removeHiddenLayers}
                onChange={(e) => setOptions({ ...options, removeHiddenLayers: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 text-slate-800">
                <Bookmark className="w-4 h-4 text-slate-500" />
                <span>Document Bookmarks ({currentDoc.bookmarks.length} entries)</span>
              </span>
              <input
                type="checkbox"
                checked={options.removeBookmarks}
                onChange={(e) => setOptions({ ...options, removeBookmarks: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </label>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              Sanitization completely purges file stream objects. Make sure to keep an archival master copy if needed.
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
              onClick={handleExecute}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Sanitize &amp; Purge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
