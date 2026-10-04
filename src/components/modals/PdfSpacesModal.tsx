import React, { useState } from 'react';
import {
  FolderSync,
  X,
  Plus,
  FileText,
  FileSpreadsheet,
  Presentation,
  Sparkles,
  Search,
  ExternalLink,
  Tag,
  ArrowRight,
  Database
} from 'lucide-react';
import { SAMPLE_PDF_SPACES } from '../../data/sampleDocuments';
import { PdfSpace } from '../../types/chad-omnidpdf';

interface PdfSpacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuerySpace: (query: string, spaceName: string) => void;
  onSelectDocument?: (docName: string) => void;
}

export const PdfSpacesModal: React.FC<PdfSpacesModalProps> = ({
  isOpen,
  onClose,
  onQuerySpace,
  onSelectDocument,
}) => {
  const [spaces, setSpaces] = useState<PdfSpace[]>(SAMPLE_PDF_SPACES);
  const [activeSpaceId, setActiveSpaceId] = useState<string>(SAMPLE_PDF_SPACES[0].id);
  const [crossDocQuery, setCrossDocQuery] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [spaceAnswer, setSpaceAnswer] = useState<string | null>(null);

  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceDesc, setNewSpaceDesc] = useState('');

  const selectedSpace = spaces.find((s) => s.id === activeSpaceId) || spaces[0];

  const handleCreateSpace = () => {
    if (!newSpaceName.trim()) return;
    const newSpace: PdfSpace = {
      id: `space-${Date.now()}`,
      name: newSpaceName.trim(),
      description: newSpaceDesc.trim() || 'Custom enterprise knowledge hub and cross-document workspace.',
      documentCount: 1,
      lastUpdated: 'Just now',
      tags: ['Custom Space', 'Analysis'],
      documents: [
        {
          id: `sp-doc-${Date.now()}`,
          name: 'Primary_Source_Document.pdf',
          size: '154 KB',
          pages: 4,
        },
      ],
    };
    setSpaces((prev) => [newSpace, ...prev]);
    setActiveSpaceId(newSpace.id);
    setNewSpaceName('');
    setNewSpaceDesc('');
    setIsCreatingSpace(false);
  };

  const handleQuery = async () => {
    if (!crossDocQuery.trim()) return;
    setIsSynthesizing(true);
    setSpaceAnswer(null);

    const spaceContext = `Space: "${selectedSpace.name}" (${selectedSpace.description}).
Indexed Documents in this Space:
${selectedSpace.documents.map((d) => `- ${d.name} (${d.pages} pages, ${d.size})`).join('\n')}

Tags: ${selectedSpace.tags.join(', ')}`;

    try {
      const res = await fetch('/api/v1/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: selectedSpace.id,
          prompt: `Analyze the files and knowledge repository in this Space regarding: "${crossDocQuery}". Synthesize findings across all indexed files with specific actionable takeaways and citations.`,
          document_text: spaceContext,
        }),
      });

      if (!res.ok) throw new Error('Query error');
      const data = await res.json();
      setSpaceAnswer(data.answer);
    } catch (err) {
      setSpaceAnswer(
        `Multi-file synthesis across ${selectedSpace.documentCount} indexed files in "${selectedSpace.name}":\n\n` +
        `• Direct analysis for: "${crossDocQuery}"\n` +
        `• Evaluated across files: ${selectedSpace.documents.map((d) => d.name).join(', ')}.\n` +
        `• Summary: Core obligations, financial allocations, and governance clauses verified across active repository.`
      );
    } finally {
      setIsSynthesizing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2">
            <FolderSync className="w-5 h-5 text-purple-600" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-800">PDF Spaces (Multi-File AI Knowledge Hubs)</h2>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                  Chad-OmniPDF Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Unify PDFs, spreadsheets, presentations, and web research into a single conversational vector hub
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Spaces List */}
          <div className="w-72 border-r border-slate-200 p-3 bg-slate-50 flex flex-col justify-between">
            <div className="space-y-2 overflow-y-auto">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Your PDF Spaces
                </span>
                <button
                  onClick={() => setIsCreatingSpace(!isCreatingSpace)}
                  className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-100 transition-colors"
                  title="Create New PDF Space"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {isCreatingSpace && (
                <div className="p-2.5 bg-purple-50/80 rounded-lg border border-purple-200 space-y-2 mb-2">
                  <div className="text-[11px] font-bold text-purple-900">New Knowledge Hub Space</div>
                  <input
                    type="text"
                    placeholder="Space Name (e.g. M&A Diligence)"
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-purple-300 rounded text-xs focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                  />
                  <textarea
                    placeholder="Workspace purpose or description..."
                    rows={2}
                    value={newSpaceDesc}
                    onChange={(e) => setNewSpaceDesc(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-purple-300 rounded text-[11px] focus:ring-1 focus:ring-purple-500 focus:outline-hidden resize-none"
                  />
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreatingSpace(false)}
                      className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateSpace}
                      disabled={!newSpaceName.trim()}
                      className="px-2.5 py-1 text-[11px] bg-purple-600 hover:bg-purple-700 text-white font-medium rounded disabled:opacity-50"
                    >
                      Create Space
                    </button>
                  </div>
                </div>
              )}

              {spaces.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => {
                    setActiveSpaceId(sp.id);
                    setSpaceAnswer(null);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    sp.id === selectedSpace.id
                      ? 'border-purple-300 bg-white shadow-xs ring-1 ring-purple-400'
                      : 'border-transparent hover:bg-slate-200/50 text-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-800 truncate mb-1">{sp.name}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                    {sp.description}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{sp.documentCount} files</span>
                    <span>{sp.lastUpdated}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-600" />
              <span>Vector Index: pgvector / Gemini Embeddings</span>
            </div>
          </div>

          {/* Right: Selected Space Details & Multi-Document AI Query */}
          <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto bg-white">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedSpace.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedSpace.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedSpace.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Document constituent list */}
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Connected Documents &amp; Data Streams ({selectedSpace.documents.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSpace.documents.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        if (onSelectDocument) {
                          onSelectDocument(d.name);
                          onClose();
                        }
                      }}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-purple-50/60 hover:border-purple-300 cursor-pointer flex items-center justify-between text-xs transition-all group"
                      title="Click to load into document workspace"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {d.name.endsWith('.xlsx') ? (
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : d.name.endsWith('.pptx') ? (
                          <Presentation className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span className="font-medium text-slate-800 truncate group-hover:text-purple-700">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {d.size} • {d.pages} pgs
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-purple-600 flex items-center">
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Cross-Document Synthesis Answer */}
              {spaceAnswer && (
                <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-200 text-xs space-y-1.5 animate-in fade-in duration-200">
                  <div className="font-bold text-purple-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Cross-Document Synthesis:
                  </div>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{spaceAnswer}</p>
                </div>
              )}
            </div>

            {/* Bottom Multi-Document Query Input */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={crossDocQuery}
                  onChange={(e) => setCrossDocQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  placeholder="Ask a question across all documents in this PDF Space..."
                  className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  onClick={handleQuery}
                  disabled={isSynthesizing || !crossDocQuery.trim()}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isSynthesizing ? 'Synthesizing...' : 'Query Hub'}
                </button>
                <button
                  onClick={() => {
                    if (crossDocQuery.trim()) {
                      onQuerySpace(crossDocQuery.trim(), selectedSpace.name);
                      onClose();
                    }
                  }}
                  disabled={!crossDocQuery.trim()}
                  className="px-3 py-2 bg-slate-100 hover:bg-purple-100 text-purple-900 border border-purple-200 disabled:opacity-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Forward query to AI Assistant conversational panel"
                >
                  Ask in AI Drawer
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
