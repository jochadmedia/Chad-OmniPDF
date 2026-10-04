import React, { useState } from 'react';
import {
  Wand2,
  X,
  Play,
  CheckCircle2,
  ListOrdered,
  ArrowRight,
  ShieldAlert,
  Tag,
  FileCheck,
  RotateCw,
  Stamp,
  Layers
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface ActionWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onExecuteAction: (actionRecipeId: string) => void;
}

export const ActionWizardModal: React.FC<ActionWizardModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onExecuteAction,
}) => {
  const [selectedAction, setSelectedAction] = useState('legal_prep');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const recipes = [
    {
      id: 'legal_prep',
      name: 'Legal Discovery & Trial Preparation',
      desc: 'Standard legal package: OCR raster scans, stamp sequential Bates numbers, and sanitize hidden metadata.',
      steps: [
        'Run OCR glyph recognition on all pages',
        'Apply Bates numbering series LIT-2026-000001',
        'Sanitize metadata, attachments, and private comments',
        'Generate PAdES audit log verification record'
      ]
    },
    {
      id: 'confidential_purge',
      name: 'Confidential Redaction & Data Purge',
      desc: 'Scan regex SSN/Credit cards, permanently purge streams, and watermark as CONFIDENTIAL.',
      steps: [
        'Scan text streams for Social Security & Credit Card regex',
        'Execute physical permanent stream purge',
        'Apply diagonal CONFIDENTIAL watermark across all pages',
        'Enforce AES-256 bit symmetric security encryption'
      ]
    },
    {
      id: 'pdfa_archive',
      name: 'ISO 19005-2 PDF/A Long-Term Archival',
      desc: 'Embed device-independent ICC color profiles, repair font descriptors, and validate WCAG tags.',
      steps: [
        'Validate ISO 19005-2 PDF/A-2b compliance profile',
        'Embed standard sRGB / CMYK output intents',
        'Remediate heading structure tags for WCAG 2.0 Level AA',
        'Lock document with tamper-evident digital seal'
      ]
    },
    {
      id: 'biz_intel',
      name: 'Strategic Business Intelligence Briefing',
      desc: 'Generate executive conversational podcasts and high-stakes intelligence summaries for commutes.',
      steps: [
        'Extract core covenants and operational milestones',
        'Identify risk parameters and multi-jurisdictional conflicts',
        'Generate AI Dual-Host Podcast Script',
        'Synthesize high-fidelity neural audio brief'
      ]
    }
  ];

  const activeRecipe = recipes.find((r) => r.id === selectedAction) || recipes[0];

  const handleRun = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setCompleted(false);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= activeRecipe.steps.length) {
        clearInterval(interval);
        setIsRunning(false);
        setCompleted(true);
        onExecuteAction(selectedAction);
      } else {
        setCurrentStepIndex(step);
      }
    }, 700);
  };

  if (!isOpen || !currentDoc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[75vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-purple-50">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-800">Action Wizard (Batch Automation)</h2>
                <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-1.5 py-0.2 rounded-full">
                  Chad-OmniPDF Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Execute automated multi-step processing pipelines across documents
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Recipe List */}
          <div className="w-64 border-r border-slate-200 p-3 bg-slate-50 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Action Recipe
            </div>
            {recipes.map((r) => (
              <button
                key={r.id}
                disabled={isRunning}
                onClick={() => {
                  setSelectedAction(r.id);
                  setCompleted(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                  selectedAction === r.id
                    ? 'bg-white border-purple-400 shadow-xs ring-1 ring-purple-400'
                    : 'bg-transparent border-transparent hover:bg-slate-200/50 text-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-slate-900 mb-0.5">{r.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{r.desc}</div>
              </button>
            ))}
          </div>

          {/* Right: Recipe Steps Execution View */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{activeRecipe.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{activeRecipe.desc}</p>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Target: {currentDoc.fileName}</div>
              </div>

              {/* Steps Progress Checklist */}
              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Sequential Execution Steps ({activeRecipe.steps.length})
                </div>
                {activeRecipe.steps.map((st, i) => {
                  const isDone = completed || (isRunning && i < currentStepIndex);
                  const isCurrent = isRunning && i === currentStepIndex;

                  return (
                    <div
                      key={i}
                      className={`p-2 rounded-lg border transition-all flex items-center justify-between text-xs ${
                        isDone
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-900 font-medium'
                          : isCurrent
                          ? 'border-purple-400 bg-purple-50 text-purple-900 font-semibold ring-1 ring-purple-400'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] w-4 text-center">{i + 1}.</span>
                        <span>{st}</span>
                      </div>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {completed && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong>Action Completed Successfully!</strong> All pipeline steps applied to{' '}
                    {currentDoc.fileName}.
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isRunning ? 'Running Action Wizard...' : 'Execute Action Pipeline'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
