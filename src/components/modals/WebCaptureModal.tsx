import React, { useState } from 'react';
import {
  Globe,
  X,
  Check,
  Download,
  ArrowRight,
  ExternalLink,
  Layers
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface WebCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureWebPage: (url: string, title: string, textBlocks?: string[]) => void;
}

export const WebCaptureModal: React.FC<WebCaptureModalProps> = ({
  isOpen,
  onClose,
  onCaptureWebPage,
}) => {
  const [url, setUrl] = useState('https://www.sec.gov/edgar/annual-report/2026');
  const [captureLevels, setCaptureLevels] = useState(1);
  const [stayOnSameDomain, setStayOnSameDomain] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);

  if (!isOpen) return null;

  const handleCapture = async () => {
    setIsCapturing(true);
    try {
      const res = await fetch('/api/v1/web/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      onCaptureWebPage(url, data.title || `Web Capture: ${data.domain}`, data.textBlocks);
      onClose();
    } catch {
      const domainName = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      onCaptureWebPage(url, `Web Capture: ${domainName}`);
      onClose();
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-blue-50/70">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">Web Capture (URL to PDF)</h2>
              <p className="text-[11px] text-slate-500">
                Convert live web pages and links into preserved PDF document hierarchies
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
            <label className="font-semibold text-slate-700 block mb-1">Target Web URL:</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Capture Levels:</label>
              <select
                value={captureLevels}
                onChange={(e) => setCaptureLevels(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800"
              >
                <option value={1}>1 Level (Current Page Only)</option>
                <option value={2}>2 Levels (Linked Pages)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Orientation:</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800">
                <option>Portrait (US Letter)</option>
                <option>Landscape</option>
              </select>
            </div>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={stayOnSameDomain}
              onChange={(e) => setStayOnSameDomain(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-slate-700">Stay on same web domain (isolate links)</span>
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
              onClick={handleCapture}
              disabled={isCapturing || !url}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {isCapturing ? 'Capturing Web Hierarchy...' : 'Capture & Convert'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
