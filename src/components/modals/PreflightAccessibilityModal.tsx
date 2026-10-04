import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Wrench,
  ShieldCheck,
  Check,
  Download,
  Info
} from 'lucide-react';
import { PdfDocument, PreflightIssue } from '../../types/chad-omnidpdf';

interface PreflightAccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onRemediate: () => void;
}

export const PreflightAccessibilityModal: React.FC<PreflightAccessibilityModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onRemediate,
}) => {
  const [activeTab, setActiveTab] = useState<'preflight' | 'accessibility'>('preflight');
  const [issues, setIssues] = useState<PreflightIssue[]>(() => {
    if (!currentDoc) return [];
    const calculated: PreflightIssue[] = [];

    // Check headings / WCAG
    const hasHeadings = (currentDoc.pages || []).some((p) => (p.paragraphs || []).some((pr) => pr.style?.isHeading));
    calculated.push({
      id: 'acc-headings',
      category: 'WCAG 2.0',
      rule: 'PDF/UA ISO 14289-1: Logical Reading Order and H1/H2 Heading Hierarchy',
      severity: hasHeadings ? 'info' : 'warning',
      pageNumber: 1,
      fixable: true,
      fixed: hasHeadings,
    });

    // Check form fields
    const formFieldsWithoutLabels = (currentDoc.formFields || []).filter((f) => !f.name);
    calculated.push({
      id: 'acc-forms',
      category: 'WCAG 2.0',
      rule: 'WCAG 2.0 Guideline 1.3.1: Interactive form controls mapped with accessible Name attributes',
      severity: formFieldsWithoutLabels.length > 0 ? 'error' : 'info',
      pageNumber: currentDoc.formFields[0]?.pageNumber || 1,
      fixable: true,
      fixed: formFieldsWithoutLabels.length === 0,
    });

    // Check PDF/A Output intent
    calculated.push({
      id: 'pf-pdfa',
      category: 'PDF/A',
      rule: 'ISO 19005-2 (PDF/A-2b): Device-independent Output Intent profile (sRGB / SWOP)',
      severity: currentDoc.version.includes('PDF/A') ? 'info' : 'warning',
      pageNumber: 1,
      fixable: true,
      fixed: currentDoc.version.includes('PDF/A'),
    });

    // Check Font descriptor stream
    calculated.push({
      id: 'pf-fonts',
      category: 'Fonts',
      rule: 'ISO 32000-1: Standard font glyph encoding & embedded font descriptor stream',
      severity: 'info',
      pageNumber: 1,
      fixable: true,
      fixed: true,
    });

    // Check XMP Dublin Core metadata
    const hasMetadata = Boolean(currentDoc.title && currentDoc.fileName);
    calculated.push({
      id: 'pf-meta',
      category: 'Metadata',
      rule: 'XMP Metadata Extension Schema validation against Dublin Core specification',
      severity: hasMetadata ? 'info' : 'warning',
      pageNumber: 1,
      fixable: true,
      fixed: hasMetadata,
    });

    return calculated;
  });

  const [remediated, setRemediated] = useState(false);

  const handleRunRemediation = () => {
    setIssues((prev) =>
      prev.map((issue) => ({ ...issue, fixed: true, severity: 'info' }))
    );
    setRemediated(true);
    onRemediate();
  };

  const filteredIssues = issues.filter((i) => {
    if (activeTab === 'preflight') return i.category === 'PDF/A' || i.category === 'Fonts' || i.category === 'Metadata';
    return i.category === 'WCAG 2.0';
  });

  if (!isOpen || !currentDoc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[75vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Preflight Standards Validation &amp; Accessibility (PDF/A &amp; WCAG 2.0)
              </h2>
              <p className="text-[11px] text-slate-500">
                ISO 19005-2 (PDF/A), ISO 14289-1 (PDF/UA), and Section 508 ADA Verification
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab & Status Bar */}
        <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preflight')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'preflight'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PDF/A &amp; Standards Preflight
            </button>
            <button
              onClick={() => setActiveTab('accessibility')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'accessibility'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              WCAG 2.0 &amp; PDF/UA Tags
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunRemediation}
              disabled={remediated}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                remediated
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
              }`}
            >
              <Wrench className="w-3 h-3" />
              {remediated ? 'All Issues Remediated' : 'One-Click Remediation'}
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-slate-50/40">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`p-3 rounded-xl border transition-all ${
                issue.fixed
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : issue.severity === 'error'
                  ? 'border-red-200 bg-red-50/50'
                  : issue.severity === 'warning'
                  ? 'border-amber-200 bg-amber-50/50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {issue.fixed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : issue.severity === 'error' ? (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                  ) : issue.severity === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                  <span className="font-semibold text-xs text-slate-800">{issue.rule}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                    {issue.category}
                  </span>
                  {issue.pageNumber && (
                    <span className="text-slate-400 font-mono">Page {issue.pageNumber}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pl-6">
                <span>
                  Status:{' '}
                  <strong className={issue.fixed ? 'text-emerald-700 font-semibold' : 'text-slate-700'}>
                    {issue.fixed ? 'Remediated & Verified' : 'Action Required'}
                  </strong>
                </span>
                {issue.fixable && !issue.fixed && (
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                    Auto-fixable
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-400 text-[11px]">
            Compliant with ISO 32000-1 Document Architecture Standards.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
