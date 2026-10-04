import React, { useState } from 'react';
import {
  Smartphone,
  X,
  ChevronDown,
  ChevronUp,
  Type,
  Sun,
  Moon,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface LiquidModeViewProps {
  currentDoc?: PdfDocument;
  onClose: () => void;
}

export const LiquidModeView: React.FC<LiquidModeViewProps> = ({
  currentDoc,
  onClose,
}) => {
  const [fontSizeOffset, setFontSizeOffset] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({});

  if (!currentDoc) return null;

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      {/* Smartphone Viewport Frame */}
      <div
        className={`w-full max-w-md h-[92vh] rounded-[36px] shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col transition-colors duration-200 ${
          isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
        }`}
      >
        {/* Smartphone Speaker & Camera Notch */}
        <div className="h-6 bg-slate-900 flex items-center justify-center shrink-0">
          <div className="w-16 h-3 bg-slate-800 rounded-full"></div>
        </div>

        {/* Liquid Mode Top Controls */}
        <div
          className={`px-4 py-2.5 border-b flex items-center justify-between select-none ${
            isDarkMode ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-blue-50/70'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-200/50 text-slate-600"
              title="Return to standard PDF view"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-xs">Liquid Mode</span>
              <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                AI Reflow
              </span>
            </div>
          </div>

          {/* Reading Customization Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFontSizeOffset((prev) => Math.max(-2, prev - 1))}
              className="px-1.5 py-0.5 text-xs font-semibold hover:bg-slate-200/60 rounded"
              title="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeOffset((prev) => Math.min(4, prev + 1))}
              className="px-1.5 py-0.5 text-xs font-semibold hover:bg-slate-200/60 rounded"
              title="Increase font size"
            >
              A+
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1 rounded hover:bg-slate-200/60"
              title="Toggle Dark Reading Mode"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            </button>
            <button onClick={onClose} className="p-1 rounded hover:bg-slate-200/60">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reflowed Document Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm leading-relaxed">
          {/* Reflow Header Card */}
          <div className="text-center pb-2 border-b border-slate-200/40">
            <h1 className="text-lg font-bold tracking-tight">{currentDoc.title}</h1>
            <p className="text-[11px] text-slate-400 mt-1">{currentDoc.fileName} • Reflowed across {currentDoc.pageCount} pages</p>
          </div>

          {/* Collapsible Sections & Cards */}
          {currentDoc.pages.map((page) => (
            <div key={page.pageNumber} className="space-y-3">
              <div
                onClick={() => toggleSection(`page-${page.pageNumber}`)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  isDarkMode ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <span className="font-semibold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  {page.title || `Section ${page.pageNumber}`}
                </span>
                {collapsedSections[`page-${page.pageNumber}`] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              {!collapsedSections[`page-${page.pageNumber}`] && (
                <div className="space-y-3 pl-1 pr-1">
                  {page.paragraphs.map((p) => (
                    <div
                      key={p.id}
                      style={{ fontSize: `${13 + fontSizeOffset}px` }}
                      className={p.style?.isHeading ? 'font-bold text-blue-600 mt-3 text-sm' : 'text-slate-600 dark:text-slate-300'}
                    >
                      {p.text}
                    </div>
                  ))}

                  {/* Reflowed Tables */}
                  {page.tables && page.tables.map((tbl) => (
                    <div
                      key={tbl.id}
                      className={`rounded-xl border p-2.5 overflow-x-auto my-2 text-xs ${
                        isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-300 font-semibold text-[11px]">
                            {tbl.headers.map((h, i) => (
                              <th key={i} className="pb-1 pr-2">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 text-[11px]">
                          {tbl.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="py-1 pr-2">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Smartphone Home Indicator Bar */}
        <div className="h-5 bg-slate-950 flex items-center justify-center shrink-0">
          <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
