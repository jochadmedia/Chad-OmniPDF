import React, { useState } from 'react';
import {
  FileDiff,
  X,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Download,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PdfDocument, ComparisonDiff } from '../../types/chad-omnidpdf';

interface SideBySideCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  documents: PdfDocument[];
}

export const SideBySideCompareModal: React.FC<SideBySideCompareModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  documents,
}) => {
  const [compareDocId, setCompareDocId] = useState<string>(() => {
    return (documents || []).find((d) => currentDoc && d && d.id !== currentDoc.id)?.id || documents?.[0]?.id || '';
  });
  const [filterType, setFilterType] = useState<string>('all');

  const otherDoc = (documents || []).find((d) => d && d.id === compareDocId) || documents?.[0];

  // Real dynamic document difference engine
  const diffs = React.useMemo<ComparisonDiff[]>(() => {
    if (!currentDoc || !otherDoc) return [];

    if (currentDoc.id === otherDoc.id) {
      return [
        {
          type: 'modification',
          page: 1,
          description: 'Identical document instances selected for comparison',
          oldText: currentDoc.title || '',
          newText: otherDoc.title || '',
        },
      ];
    }

    const calculated: ComparisonDiff[] = [];

    const curPages = currentDoc.pages || [];
    const othPages = otherDoc.pages || [];
    const maxPages = Math.max(curPages.length, othPages.length);
    for (let pNum = 1; pNum <= maxPages; pNum++) {
      const curPage = curPages.find((p) => p.pageNumber === pNum);
      const othPage = othPages.find((p) => p.pageNumber === pNum);

      if (!curPage && othPage) {
        calculated.push({
          type: 'addition',
          page: pNum,
          description: `Page ${pNum} exists in ${otherDoc.title || ''} but not in ${currentDoc.title || ''}`,
          newText: othPage.paragraphs?.map((pr) => pr.text).join(' ').slice(0, 140) + '...',
        });
      } else if (curPage && !othPage) {
        calculated.push({
          type: 'deletion',
          page: pNum,
          description: `Page ${pNum} removed in ${otherDoc.title || ''}`,
          oldText: curPage.paragraphs?.map((pr) => pr.text).join(' ').slice(0, 140) + '...',
        });
      } else if (curPage && othPage) {
        const curParas = curPage.paragraphs || [];
        const othParas = othPage.paragraphs || [];
        const maxParas = Math.max(curParas.length, othParas.length);
        for (let paraIdx = 0; paraIdx < maxParas; paraIdx++) {
          const cp = curParas[paraIdx];
          const op = othParas[paraIdx];

          if (!cp && op) {
            calculated.push({
              type: 'addition',
              page: pNum,
              description: `Added paragraph in Section ${pNum}.${paraIdx + 1}`,
              newText: op.text,
            });
          } else if (cp && !op) {
            calculated.push({
              type: 'deletion',
              page: pNum,
              description: `Deleted paragraph from Section ${pNum}.${paraIdx + 1}`,
              oldText: cp.text,
            });
          } else if (cp && op && cp.text !== op.text) {
            calculated.push({
              type: 'modification',
              page: pNum,
              description: `Clause modified in Page ${pNum}`,
              oldText: cp.text,
              newText: op.text,
            });
          }
        }
      }
    }

    const curFields = currentDoc.formFields || [];
    const othFields = otherDoc.formFields || [];
    if (curFields.length !== othFields.length) {
      calculated.push({
        type: 'modification',
        page: 1,
        description: `Form field schema variance: ${curFields.length} vs ${othFields.length} fields`,
        oldText: `${curFields.length} interactive fields in ${currentDoc.title || ''}`,
        newText: `${othFields.length} interactive fields in ${otherDoc.title || ''}`,
      });
    }

    if (calculated.length === 0) {
      calculated.push({
        type: 'modification',
        page: 1,
        description: 'No text variances detected between active document streams',
        oldText: currentDoc.title || '',
        newText: otherDoc.title || '',
      });
    }

    return calculated;
  }, [currentDoc, otherDoc]);

  const filteredDiffs = diffs.filter((d) => {
    if (filterType === 'all') return true;
    return d.type === filterType;
  });

  if (!isOpen || !currentDoc || !otherDoc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileDiff className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">Side-by-Side Document Comparison</h2>
              <p className="text-[11px] text-slate-500">
                Automated visual &amp; semantic diff report comparing 2 document versions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={compareDocId}
              onChange={(e) => setCompareDocId(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700"
            >
              {(documents || []).filter(d => d && d.id).map((d) => (
                <option key={d.id} value={d.id}>
                  Compare with: {d.title}
                </option>
              ))}
            </select>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diff Summary Bar */}
        <div className="bg-blue-50/70 border-b border-blue-200 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-blue-900">
              Found {diffs.length} differences across {Math.max(currentDoc.pageCount, otherDoc.pageCount)} pages
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                All ({diffs.length})
              </button>
              <button
                onClick={() => setFilterType('addition')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  filterType === 'addition' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-800 border border-emerald-200'
                }`}
              >
                +{diffs.filter((d) => d.type === 'addition').length} Additions
              </button>
              <button
                onClick={() => setFilterType('modification')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  filterType === 'modification' ? 'bg-amber-600 text-white' : 'bg-white text-amber-800 border border-amber-200'
                }`}
              >
                ~{diffs.filter((d) => d.type === 'modification').length} Modifications
              </button>
              <button
                onClick={() => setFilterType('deletion')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  filterType === 'deletion' ? 'bg-red-600 text-white' : 'bg-white text-red-800 border border-red-200'
                }`}
              >
                -{diffs.filter((d) => d.type === 'deletion').length} Deletions
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              const report = `CHAD-OMNIPDF DOCUMENT COMPARISON AUDIT REPORT\n` +
                `Document A: ${otherDoc.title}\n` +
                `Document B: ${currentDoc.title}\n` +
                `Audit Generated: ${new Date().toISOString()}\n` +
                `Total Discrepancies: ${diffs.length}\n` +
                `-----------------------------------------------------\n\n` +
                diffs.map((d, i) => `[${i + 1}] TYPE: ${d.type.toUpperCase()} | PAGE: ${d.page}\nDescription: ${d.description}\n` +
                  (d.oldText ? `Previous: ${d.oldText}\n` : '') +
                  (d.newText ? `Current: ${d.newText}\n` : '')
                ).join('\n');
              const blob = new Blob([report], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Comparison_Audit_${currentDoc.title.replace(/\s+/g, '_')}_DiffReport.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-medium text-[11px] flex items-center gap-1.5"
          >
            <Download className="w-3 h-3" /> Export Diff Report
          </button>
        </div>

        {/* Main Body: Side by Side Views + Differences Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document A (Original / Previous) */}
          <div className="flex-1 border-r border-slate-200 p-4 overflow-y-auto bg-slate-100 flex flex-col items-center">
            <div className="w-full max-w-md mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="truncate">[Original] {otherDoc.fileName}</span>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">{otherDoc.pages.length} pgs</span>
            </div>
            <div className="w-full max-w-md bg-white border border-slate-300 shadow-md rounded p-4 text-xs space-y-4">
              <div className="border-b pb-2 text-center">
                <h3 className="font-bold text-slate-800 text-sm">{otherDoc.title}</h3>
                <span className="text-[10px] text-slate-400 font-mono">Version: {otherDoc.version}</span>
              </div>
              <div className="space-y-3">
                {otherDoc.pages.map((p) => (
                  <div key={p.pageNumber} className="border border-slate-200 rounded p-2.5 bg-slate-50/50 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Page {p.pageNumber} {p.title ? `— ${p.title}` : ''}
                    </div>
                    {p.paragraphs.map((para) => {
                      const isDeleted = diffs.some((d) => d.type === 'deletion' && d.oldText && para.text.includes(d.oldText.slice(0, 30)));
                      const isModified = diffs.some((d) => d.type === 'modification' && d.oldText && para.text.includes(d.oldText.slice(0, 30)));
                      return (
                        <p
                          key={para.id}
                          className={`text-[11px] leading-relaxed p-1 rounded transition-colors ${
                            isDeleted
                              ? 'bg-red-50 border-l-2 border-red-500 text-red-900 line-through'
                              : isModified
                              ? 'bg-amber-50 border-l-2 border-amber-500 text-amber-900'
                              : 'text-slate-700'
                          }`}
                        >
                          {para.text}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Document B (Current / Revised) */}
          <div className="flex-1 border-r border-slate-200 p-4 overflow-y-auto bg-slate-100 flex flex-col items-center">
            <div className="w-full max-w-md mb-2 flex items-center justify-between text-xs font-semibold text-blue-700">
              <span className="truncate">[Modified Version] {currentDoc.fileName}</span>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">{currentDoc.pages.length} pgs</span>
            </div>
            <div className="w-full max-w-md bg-white border border-slate-300 shadow-md rounded p-4 text-xs space-y-4">
              <div className="border-b pb-2 text-center">
                <h3 className="font-bold text-slate-800 text-sm">{currentDoc.title}</h3>
                <span className="text-[10px] text-slate-400 font-mono">Version: {currentDoc.version}</span>
              </div>
              <div className="space-y-3">
                {currentDoc.pages.map((p) => (
                  <div key={p.pageNumber} className="border border-slate-200 rounded p-2.5 bg-slate-50/50 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Page {p.pageNumber} {p.title ? `— ${p.title}` : ''}
                    </div>
                    {p.paragraphs.map((para) => {
                      const isAdded = diffs.some((d) => d.type === 'addition' && d.newText && para.text.includes(d.newText.slice(0, 30)));
                      const isModified = diffs.some((d) => d.type === 'modification' && d.newText && para.text.includes(d.newText.slice(0, 30)));
                      return (
                        <p
                          key={para.id}
                          className={`text-[11px] leading-relaxed p-1 rounded transition-colors ${
                            isAdded
                              ? 'bg-emerald-50 border-l-2 border-emerald-500 text-emerald-900 font-medium'
                              : isModified
                              ? 'bg-amber-50 border-l-2 border-amber-500 text-amber-900 font-medium'
                              : 'text-slate-700'
                          }`}
                        >
                          {para.text}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Differences List Panel */}
          <div className="w-80 p-3 overflow-y-auto bg-white flex flex-col space-y-2">
            <span className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider">
              Change Log &amp; Revisions
            </span>
            <div className="space-y-2 overflow-y-auto flex-1 text-xs">
              {filteredDiffs.map((d, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/50 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        d.type === 'addition'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.type === 'deletion'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Page {d.page}</span>
                  </div>
                  <div className="font-semibold text-slate-800 mb-1">{d.description}</div>
                  {d.oldText && (
                    <div className="text-[10px] text-red-700 bg-red-50/70 p-1 rounded mb-1 line-through">
                      - {d.oldText}
                    </div>
                  )}
                  {d.newText && (
                    <div className="text-[10px] text-emerald-700 bg-emerald-50/70 p-1 rounded font-medium">
                      + {d.newText}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
          >
            Close Comparison View
          </button>
        </div>
      </div>
    </div>
  );
};
