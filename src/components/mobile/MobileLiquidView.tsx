import React, { useState } from 'react';
import { PdfDocument, FormField } from '../../types/chad-omnidpdf';
import {
  Smartphone,
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  PenTool,
  CheckCircle,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface MobileLiquidViewProps {
  document?: PdfDocument;
  onUpdateParagraphText: (pageNumber: number, paragraphId: string, newText: string) => void;
  onUpdateFormField: (fieldId: string, value: any) => void;
  onOpenSignatureModal: (field: FormField) => void;
}

export const MobileLiquidView: React.FC<MobileLiquidViewProps> = ({
  document,
  onUpdateParagraphText,
  onUpdateFormField,
  onOpenSignatureModal,
}) => {
  const [fontSize, setFontSize] = useState<number>(15);
  const [collapsedPages, setCollapsedPages] = useState<Record<number, boolean>>({});
  const [editingParaId, setEditingParaId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No document reflowed</h3>
        <p className="text-xs text-slate-500 mt-1">Please select a document to view in Liquid Mode.</p>
      </div>
    );
  }

  const togglePageCollapse = (pageNum: number) => {
    setCollapsedPages((prev) => ({ ...prev, [pageNum]: !prev[pageNum] }));
  };

  const handleStartEdit = (paraId: string, currentText: string) => {
    setEditingParaId(paraId);
    setEditValue(currentText);
  };

  const handleSaveEdit = (pageNumber: number, paraId: string) => {
    if (editingParaId === paraId) {
      onUpdateParagraphText(pageNumber, paraId, editValue);
      setEditingParaId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 text-slate-800 animate-in fade-in duration-200">
      {/* Liquid Mode Control Header */}
      <div className="sticky top-12 z-20 bg-slate-900/90 backdrop-blur-md text-white rounded-xl p-3 mb-6 shadow-lg border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold leading-tight">Chad-OmniPDF Liquid Mode</h2>
            <p className="text-[10px] text-indigo-300">Reflowed for Mobile Touch</p>
          </div>
        </div>

        {/* Text Size Scale Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setFontSize((s) => Math.max(12, s - 1))}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-700 text-xs font-bold"
            title="Decrease text size"
          >
            A-
          </button>
          <span className="text-[11px] font-mono w-6 text-center tabular-nums">{fontSize}</span>
          <button
            onClick={() => setFontSize((s) => Math.min(22, s + 1))}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-700 text-xs font-bold"
            title="Increase text size"
          >
            A+
          </button>
        </div>
      </div>

      {/* Document Meta Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs">
        <h1 className="text-base font-bold text-slate-900 leading-snug">{document.title}</h1>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
          <span>{document.fileName}</span>
          <span aria-hidden="true">·</span>
          <span>{document.pageCount} Pages</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            AATL Certified
          </span>
        </div>
      </div>

      {/* Pages Reflow Loop */}
      <div className="space-y-6">
        {document.pages.map((page) => {
          const isCollapsed = collapsedPages[page.pageNumber];
          const pageFields = document.formFields.filter((f) => f.pageNumber === page.pageNumber);

          return (
            <section
              key={page.pageNumber}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Page Section Kicker */}
              <button
                onClick={() => togglePageCollapse(page.pageNumber)}
                className="w-full flex items-center justify-between p-3.5 bg-slate-50 border-b border-slate-100 text-left hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Section {page.pageNumber}
                  </span>
                  <span className="text-xs text-slate-400">· {page.paragraphs.length} blocks</span>
                </div>
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {!isCollapsed && (
                <div className="p-4 space-y-4">
                  {/* Paragraphs in reflowed flow */}
                  {page.paragraphs.map((para) => {
                    const isTitle = para.id.includes('title');
                    const isEditing = editingParaId === para.id;

                    if (isEditing) {
                      return (
                        <div key={para.id} className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingParaId(null)}
                              className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(page.pageNumber, para.id)}
                              className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={para.id}
                        onClick={() => handleStartEdit(para.id, para.text)}
                        className={`group cursor-pointer rounded-lg p-1.5 -mx-1.5 transition-colors hover:bg-slate-50 ${
                          isTitle ? 'font-bold text-slate-900 tracking-tight' : 'text-slate-700 leading-relaxed'
                        }`}
                        style={{ fontSize: isTitle ? `${fontSize + 3}px` : `${fontSize}px` }}
                      >
                        {para.text}
                      </div>
                    );
                  })}

                  {/* Reflowed Form Fields and Signatures for this page */}
                  {pageFields.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Interactive Form &amp; Signature Fields
                      </h4>
                      {pageFields.map((field) => (
                        <div
                          key={field.id}
                          className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5"
                        >
                          <label className="text-xs font-semibold text-slate-700 block">
                            {field.name}
                          </label>

                          {field.type === 'signature' ? (
                            <button
                              onClick={() => onOpenSignatureModal(field)}
                              className="w-full flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                                <span>{field.value ? 'Signed Digitally (Tap to re-sign)' : 'Tap to Sign Document'}</span>
                              </div>
                              {field.value && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                            </button>
                          ) : field.type === 'checkbox' ? (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!field.value}
                                onChange={(e) => onUpdateFormField(field.id, e.target.checked)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-xs text-slate-600">Acknowledge clause terms</span>
                            </label>
                          ) : (
                            <input
                              type="text"
                              value={typeof field.value === 'string' ? field.value : ''}
                              onChange={(e) => onUpdateFormField(field.id, e.target.value)}
                              placeholder={`Enter ${field.name}`}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
