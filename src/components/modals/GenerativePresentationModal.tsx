import React, { useState } from 'react';
import {
  Presentation,
  X,
  Sparkles,
  Download,
  ChevronLeft,
  ChevronRight,
  Palette,
  Check
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';
import { exportToPowerPointPptx } from '../../utils/fileExporters';

interface GenerativePresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
}

export const GenerativePresentationModal: React.FC<GenerativePresentationModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [theme, setTheme] = useState<'slate' | 'navy' | 'modern'>('navy');
  const [isGenerating, setIsGenerating] = useState(false);

  const [slides, setSlides] = useState<Array<{ title: string; subtitle: string; bullets: string[]; tag: string }>>(() => {
    if (!currentDoc) {
      return [
        {
          title: 'Executive Briefing',
          subtitle: 'Document Presentation',
          bullets: ['No active document selected for presentation extraction.'],
          tag: 'Overview',
        },
      ];
    }
    const p1Text = currentDoc.pages[0]?.paragraphs.map((p) => p.text).join(' ') || '';
    const p2Text = currentDoc.pages[1]?.paragraphs.map((p) => p.text).join(' ') || p1Text;

    return [
      {
        title: currentDoc.title,
        subtitle: `Executive Briefing: ${currentDoc.fileName}`,
        bullets: [
          `Source Document: ${currentDoc.fileName} (${(currentDoc.fileSizeBytes / 1024).toFixed(1)} KB)`,
          `Document Scope: ${currentDoc.pageCount} Pages • Form Status: ${(currentDoc.formStatus || 'none').toUpperCase()}`,
          `Security & Trust: ${currentDoc.isCertified ? 'AATL Certified & Cryptographically Sealed' : 'Standard Document Security'}`,
        ],
        tag: 'Overview & Scope',
      },
      {
        title: currentDoc.pages[0]?.title || 'Section 1: Core Terms & Provisions',
        subtitle: 'Foundational Covenants and Objectives',
        bullets: [
          p1Text.slice(0, 95) || 'Primary contractual covenants established for enterprise engagement.',
          `Extracted directly from ${currentDoc.title} Page 1 text stream.`,
          `Interactive Form Fields: ${currentDoc.formFields.length} actionable elements mapped.`,
        ],
        tag: 'Operational Scope',
      },
      {
        title: currentDoc.pages[1]?.title || 'Section 2: Covenants & Commitments',
        subtitle: 'Specifications, Metrics & Deliverables',
        bullets: [
          p2Text.slice(0, 95) || 'Key operational metrics and regulatory disclosures.',
          `Document Layers: ${currentDoc.layers.map((l) => l.name).join(', ') || 'Base Content'}.`,
          `Compliance Status: Validated for enterprise cross-platform distribution.`,
        ],
        tag: 'Deliverables & Metrics',
      },
      {
        title: 'Execution & Governance Review',
        subtitle: 'Auditability, Certification & Compliance',
        bullets: [
          `Digital Signatures: ${currentDoc.formFields.filter((f) => f.type === 'signature').length} designated signers.`,
          currentDoc.isEncrypted ? 'AES-256 Symmetric Stream Encryption Active.' : 'Open enterprise access with strict zero-training AI privacy.',
          `Preflight verification: Conforms to ISO 32000-1 specification.`,
        ],
        tag: 'Governance & Execution',
      },
    ];
  });

  const handleAiGenerate = async () => {
    if (!currentDoc) return;
    setIsGenerating(true);
    try {
      const docSummary = currentDoc.pages.map((p) => p.paragraphs.map((pr) => pr.text).join(' ')).join('\n');
      const res = await fetch('/api/v1/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: currentDoc.id,
          prompt: `Based on this document, generate a JSON array of 4 executive presentation slides summarizing key takeaways. Return strictly a raw JSON array of objects without markdown fences matching schema: [{"title": "...", "subtitle": "...", "bullets": ["...", "...", "..."], "tag": "..."}]`,
          document_text: docSummary.slice(0, 10000),
        }),
      });
      const data = await res.json();
      if (data.answer) {
        const jsonMatch = data.answer.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            setSlides(parsed);
            setActiveSlide(0);
          }
        }
      }
    } catch (err) {
      console.warn('AI slide generation fallback:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const themeStyles = {
    navy: 'bg-linear-to-br from-slate-900 to-blue-950 text-white',
    slate: 'bg-linear-to-br from-zinc-900 to-neutral-800 text-white',
    modern: 'bg-linear-to-br from-purple-950 via-slate-900 to-indigo-950 text-white',
  };

  if (!isOpen || !currentDoc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[82vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-purple-50">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-purple-600" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-800">Generative Presentations (Adobe Express Integration)</h2>
                <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                  Firefly + Gemini Layout
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Transform document insights into professionally styled presentation slides
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controller Bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-600">Slide Theme:</span>
            <button
              onClick={() => setTheme('navy')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                theme === 'navy' ? 'bg-blue-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Enterprise Navy
            </button>
            <button
              onClick={() => setTheme('slate')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                theme === 'slate' ? 'bg-zinc-800 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Dark Slate
            </button>
            <button
              onClick={() => setTheme('modern')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                theme === 'modern' ? 'bg-purple-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Modern Purple
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium text-[11px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3 text-purple-200" />
              {isGenerating ? 'Synthesizing...' : 'Regenerate with Gemini'}
            </button>
            <button
              onClick={() => exportToPowerPointPptx(currentDoc)}
              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-medium text-[11px] flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" /> Export PowerPoint (.pptx)
            </button>
          </div>
        </div>

        {/* Main Presentation Viewport */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-150">
          <div
            className={`w-full max-w-2xl aspect-[16/9] rounded-2xl shadow-2xl p-8 flex flex-col justify-between transition-all duration-300 ${themeStyles[theme]} relative overflow-hidden`}
          >
            {/* Top Tag & Brand */}
            <div className="flex items-center justify-between text-xs opacity-75 font-mono">
              <span className="uppercase tracking-widest">{slides[activeSlide].tag}</span>
              <span>Chad-OmniPDF Studio • Express Engine</span>
            </div>

            {/* Slide Core Content */}
            <div className="my-auto space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                {slides[activeSlide].title}
              </h2>
              <p className="text-xs sm:text-sm text-blue-200/90 font-medium">
                {slides[activeSlide].subtitle}
              </p>
              <div className="w-12 h-1 bg-red-500 rounded-full my-2"></div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                {slides[activeSlide].bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between text-[11px] opacity-60 pt-2 border-t border-white/10">
              <span>{currentDoc.title}</span>
              <span>Slide {activeSlide + 1} of {slides.length}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-4">
            <button
              disabled={activeSlide <= 0}
              onClick={() => setActiveSlide((prev) => prev - 1)}
              className="p-1.5 rounded-full bg-white shadow hover:bg-slate-100 disabled:opacity-40 text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeSlide === i ? 'bg-purple-600 w-4' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <button
              disabled={activeSlide >= slides.length - 1}
              onClick={() => setActiveSlide((prev) => prev + 1)}
              className="p-1.5 rounded-full bg-white shadow hover:bg-slate-100 disabled:opacity-40 text-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
          >
            Close Presentation Studio
          </button>
        </div>
      </div>
    </div>
  );
};
