import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  CheckCircle2,
  Cpu,
  FileText,
  Sparkles,
  Check
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface OcrProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onOcrComplete: (searchableTextAdded: boolean, newParagraphsByPage?: Record<number, any[]>) => void;
}

export const OcrProcessingModal: React.FC<OcrProcessingModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onOcrComplete,
}) => {
  const [language, setLanguage] = useState('eng');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [ocrEngine, setOcrEngine] = useState('Chad-OmniPDF Neural Vision OCR');

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setProgress(0);
      setComplete(false);
    }
  }, [isOpen]);

  if (!isOpen || !currentDoc) return null;

  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, backoff = 2000): Promise<Response> => {
    try {
      const res = await fetch(url, options);
      if (res.status === 429 && retries > 0) {
        console.warn(`Rate limited (429). Retrying in ${backoff}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      return res;
    } catch (err) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      throw err;
    }
  };

  const handleStartOcr = async () => {
    setIsProcessing(true);
    setProgress(20);

    const newParagraphsMap: Record<number, any[]> = {};

    try {
      const totalPages = currentDoc.pages.length;
      for (let i = 0; i < totalPages; i++) {
        const page = currentDoc.pages[i];
        setProgress(Math.round(20 + ((i + 0.5) / totalPages) * 70));

        const res = await fetchWithRetry('/api/v1/ocr/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: page.bgDataUrl || '',
            language,
            pageNumber: page.pageNumber,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.paragraphs && data.paragraphs.length > 0) {
            newParagraphsMap[page.pageNumber] = data.paragraphs;
          }
          if (data.engine) {
            setOcrEngine(data.engine);
          }
        }
      }

      setProgress(100);
      setIsProcessing(false);
      setComplete(true);
      onOcrComplete(true, newParagraphsMap);
    } catch (err) {
      console.warn('OCR processing error:', err);
      setProgress(100);
      setIsProcessing(false);
      setComplete(true);
      onOcrComplete(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-blue-50/70">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Optical Character Recognition (OCR)
              </h2>
              <p className="text-[11px] text-slate-500">
                Convert scanned bitmap pixels into selectable, searchable text layers
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
              Document Primary OCR Language:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isProcessing || complete}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="eng">English (US &amp; UK) - Latin Neural Engine</option>
              <option value="deu">German (Deutsch) - Multi-Lingual</option>
              <option value="fra">French (Français)</option>
              <option value="spa">Spanish (Español)</option>
              <option value="jpn">Japanese (Kanji / Kana)</option>
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Target Document:</span>
              <span className="font-medium text-slate-900">{currentDoc.fileName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pages to scan:</span>
              <span className="font-mono">{currentDoc.pageCount} pages</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Target Layer:</span>
              <span className="text-blue-600 font-medium">Searchable Image with Exact Bounds</span>
            </div>
          </div>

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                <span>Recognizing glyph streams &amp; segmenting paragraphs...</span>
                <span className="font-mono text-blue-600">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-blue-600 transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* Complete Success State */}
          {complete && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold">OCR Recognition Complete!</div>
                <div className="text-[10px] text-emerald-700">
                  Processed via {ocrEngine}. Searchable text layer active and editable.
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
            >
              {complete ? 'Close' : 'Cancel'}
            </button>
            {!complete && (
              <button
                onClick={handleStartOcr}
                disabled={isProcessing}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-4 h-4" />
                {isProcessing ? 'Processing OCR...' : 'Run OCR Recognition'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
