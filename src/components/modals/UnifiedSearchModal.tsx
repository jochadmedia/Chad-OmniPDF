import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  FileText,
  Sliders,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Tag,
  Printer,
  FileDiff
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface UnifiedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onExecuteTool: (toolAction: string) => void;
  onJumpToText: (pageNum: number, textSnippet: string) => void;
}

export const UnifiedSearchModal: React.FC<UnifiedSearchModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onExecuteTool,
  onJumpToText,
}) => {
  const [query, setQuery] = useState('');

  // 1. Tool registry
  const toolRegistry = [
    { id: 'open_redact_dialog', name: 'Auto-Detect & Redact PII (SSN, Credit Cards)', category: 'Protect & Redact', icon: <ShieldAlert className="w-4 h-4 text-red-600" /> },
    { id: 'open_bates_modal', name: 'Add Bates Numbering (Legal Index)', category: 'Edit & Legal', icon: <Tag className="w-4 h-4 text-blue-600" /> },
    { id: 'open_ai_assistant', name: 'AI Assistant (Conversational Q&A)', category: 'AI & Automation', icon: <Sparkles className="w-4 h-4 text-purple-600" /> },
    { id: 'open_podcast_modal', name: 'Generate AI Audio Podcast', category: 'AI & Automation', icon: <Sparkles className="w-4 h-4 text-purple-600" /> },
    { id: 'open_presentation_modal', name: 'Generate Presentation Slides', category: 'AI & Automation', icon: <Sparkles className="w-4 h-4 text-purple-600" /> },
    { id: 'open_compare_modal', name: 'Compare Two Documents (Diff Report)', category: 'Pro Tools', icon: <FileDiff className="w-4 h-4 text-blue-600" /> },
    { id: 'open_preflight_modal', name: 'Preflight Standards Validation (PDF/A)', category: 'Pro Tools', icon: <Printer className="w-4 h-4 text-emerald-600" /> },
    { id: 'open_print_production', name: 'Print Production (CMYK Output Preview)', category: 'Pro Tools', icon: <Printer className="w-4 h-4 text-slate-700" /> },
    { id: 'toggle_measure_tool', name: 'Measure Caliper (Distance & Area)', category: 'Pro Tools', icon: <Sliders className="w-4 h-4 text-slate-600" /> },
    { id: 'prepare_form', name: 'Prepare Interactive Form Fields', category: 'Forms & E-Sign', icon: <Sliders className="w-4 h-4 text-indigo-600" /> },
    { id: 'rotate_cw', name: 'Rotate Page 90° Clockwise', category: 'Organize Pages', icon: <Sliders className="w-4 h-4 text-amber-600" /> },
    { id: 'export_word', name: 'Export to Microsoft Word (.docx)', category: 'Create & Convert', icon: <FileText className="w-4 h-4 text-blue-600" /> },
    { id: 'export_excel', name: 'Export to Microsoft Excel (.xlsx)', category: 'Create & Convert', icon: <FileText className="w-4 h-4 text-emerald-600" /> },
  ];

  // Filter tools
  const matchingTools = useMemo(() => {
    if (!query.trim()) return toolRegistry.slice(0, 6);
    const q = query.toLowerCase();
    return toolRegistry.filter(
      (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    );
  }, [query]);

  // Scan in-document text matches
  const inDocumentMatches = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const results: { page: number; snippet: string; fullText: string }[] = [];

    currentDoc?.pages.forEach((page) => {
      page.paragraphs.forEach((p) => {
        const lower = p.text.toLowerCase();
        if (lower.includes(q)) {
          const idx = lower.indexOf(q);
          const start = Math.max(0, idx - 40);
          const end = Math.min(p.text.length, idx + q.length + 60);
          results.push({
            page: page.pageNumber,
            snippet: (start > 0 ? '...' : '') + p.text.slice(start, end) + (end < p.text.length ? '...' : ''),
            fullText: p.text,
          });
        }
      });
    });

    return results.slice(0, 8);
  }, [query, currentDoc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Chad-OmniPDF tools, actions, or text within this document..."
            className="w-full text-sm bg-transparent border-0 focus:outline-none text-slate-800 placeholder:text-slate-400"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-500 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs divide-y divide-slate-150">
          {/* Section 1: Actions & Tools */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Actionable Tools &amp; Commands ({matchingTools.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {matchingTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onExecuteTool(tool.id);
                    onClose();
                  }}
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    {tool.icon}
                    <div className="truncate">
                      <div className="font-semibold text-slate-800 group-hover:text-red-700 truncate">
                        {tool.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{tool.category}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: In-Document Text Matches */}
          <div className="pt-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Matches in Current Document ({inDocumentMatches.length})</span>
              <span className="font-normal text-slate-400">{currentDoc?.fileName || 'No Document'}</span>
            </div>

            {!currentDoc ? (
              <div className="text-slate-400 italic py-2">
                No active document to search within.
              </div>
            ) : inDocumentMatches.length === 0 ? (
              <div className="text-slate-400 italic py-2">
                {query.length > 1
                  ? 'No direct text matches found in this document.'
                  : 'Type at least 2 characters to search in-document text.'}
              </div>
            ) : (
              <div className="space-y-1.5">
                {inDocumentMatches.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onJumpToText(m.page, m.snippet);
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-start justify-between gap-3 group transition-colors"
                  >
                    <div className="truncate">
                      <span className="text-[10px] bg-slate-200 font-mono text-slate-700 px-1 py-0.5 rounded mr-2">
                        Page {m.page}
                      </span>
                      <span className="text-slate-700 font-sans">{m.snippet}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
          <span>Navigate with Tab / Enter</span>
          <button onClick={onClose} className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
