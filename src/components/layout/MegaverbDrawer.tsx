import React from 'react';
import {
  Edit3,
  FileSpreadsheet,
  FileText,
  LayoutGrid,
  FileSignature,
  ShieldAlert,
  Sparkles,
  Layers,
  Search,
  Lock,
  Scissors,
  RotateCw,
  Trash2,
  PlusSquare,
  FileCheck,
  Type,
  Image as ImageIcon,
  Stamp,
  Mic,
  Presentation,
  FolderSync,
  Compass,
  FileDiff,
  Ruler,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Sliders,
  CheckCircle2,
  FileCode,
  Tag,
  Globe,
  Wand2
} from 'lucide-react';
import { MegaverbType, AccountTier, PdfDocument, QuickToolMode } from '../../types/chad-omnidpdf';

interface MegaverbDrawerProps {
  activeMegaverb: MegaverbType | null;
  onSelectMegaverb: (verb: MegaverbType | null) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  accountTier: AccountTier;
  currentDoc?: PdfDocument;
  onAction: (actionName: string, payload?: any) => void;
  toolMode: QuickToolMode;
  inlineEditActive: boolean;
  highlightFields: boolean;
}

export const MegaverbDrawer: React.FC<MegaverbDrawerProps> = ({
  activeMegaverb,
  onSelectMegaverb,
  isOpen,
  onToggleOpen,
  accountTier,
  currentDoc,
  onAction,
  toolMode,
  inlineEditActive,
  highlightFields,
}) => {
  const isReader = accountTier === 'reader';
  const isStandardOrAbove = accountTier !== 'reader';
  const isProOrAbove = accountTier === 'pro' || accountTier === 'studio' || accountTier === 'enterprise';
  const isStudioOrAbove = accountTier === 'studio' || accountTier === 'enterprise';

  const megaverbs: { id: MegaverbType; label: string; icon: React.ReactNode; badge?: string; tierReq?: string }[] = [
    { id: 'edit', label: 'Edit PDF', icon: <Edit3 className="w-4 h-4 text-blue-600" />, tierReq: 'Standard' },
    { id: 'convert', label: 'Create & Convert', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" />, tierReq: 'Standard' },
    { id: 'organize', label: 'Organize Pages', icon: <LayoutGrid className="w-4 h-4 text-amber-600" />, tierReq: 'Standard' },
    { id: 'forms', label: 'Forms & E-Sign', icon: <FileSignature className="w-4 h-4 text-indigo-600" /> },
    { id: 'protect', label: 'Protect & Redact', icon: <ShieldAlert className="w-4 h-4 text-red-600" />, tierReq: 'Pro' },
    { id: 'ai', label: 'AI Assistant & Spaces', icon: <Sparkles className="w-4 h-4 text-purple-600" />, badge: 'Studio', tierReq: 'Studio' },
    { id: 'pro', label: 'Pro Standards & Print', icon: <Printer className="w-4 h-4 text-slate-700" />, tierReq: 'Pro' },
    { id: 'admin', label: 'Admin & Compliance', icon: <ShieldCheck className="w-4 h-4 text-teal-700" />, tierReq: 'Enterprise' },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex transition-all duration-200 select-none z-30 ${
        isOpen ? 'w-80' : 'w-13'
      }`}
    >
      {/* Icon Rail (Always Visible) */}
      <div className="w-13 border-r border-slate-150 flex flex-col justify-between items-center py-2 shrink-0 bg-slate-50/70">
        <div className="flex flex-col items-center space-y-1 w-full px-1">
          <button
            onClick={onToggleOpen}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors w-full flex justify-center"
            title={isOpen ? 'Collapse All Tools Drawer' : 'Expand All Tools Drawer'}
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <div className="w-8 h-px bg-slate-200 my-1"></div>

          {megaverbs.map((item) => {
            const isActive = activeMegaverb === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isOpen) onToggleOpen();
                  onSelectMegaverb(isActive ? null : item.id);
                }}
                className={`w-full p-2.5 rounded-lg flex flex-col items-center justify-center relative transition-all group ${
                  isActive
                    ? 'bg-red-50 text-red-600 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
                title={item.label}
              >
                {item.icon}
                {item.badge && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Help / Status */}
        <div className="flex flex-col items-center space-y-1 w-full px-1">
          <button
            onClick={() => onAction('show_about')}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-md"
            title="System & Architecture Specs"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Drawer Pane */}
      {isOpen && (
        <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
          {/* Header */}
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              All Tools (Megaverbs)
            </h2>
            <button
              onClick={() => onSelectMegaverb(null)}
              className="text-[11px] text-slate-400 hover:text-slate-700"
            >
              Reset
            </button>
          </div>

          {/* Megaverb Content List */}
          <div className="p-3 space-y-4">
            {/* 1. EDIT MEGA-CATEGORY */}
            {(!activeMegaverb || activeMegaverb === 'edit') && (
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Edit PDF</span>
                  </div>
                  {!isStandardOrAbove && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Standard</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => onAction('toggle_inline_edit')}
                    className={`p-1.5 text-left rounded border transition-all active:scale-[0.97] flex items-center gap-1.5 ${
                      inlineEditActive 
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md' 
                        : 'bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border-slate-150'
                    }`}
                  >
                    <Type className={`w-3 h-3 ${inlineEditActive ? 'text-blue-100' : 'text-blue-500'}`} /> Edit Text &amp; Images
                  </button>
                  <button
                    onClick={() => onAction('add_text')}
                    className={`p-1.5 text-left rounded border transition-all active:scale-[0.97] flex items-center gap-1.5 ${
                      toolMode === 'textbox'
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                        : 'bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border-slate-150'
                    }`}
                  >
                    <PlusSquare className={`w-3 h-3 ${toolMode === 'textbox' ? 'text-blue-100' : 'text-blue-500'}`} /> Add Text Box
                  </button>
                  <button
                    onClick={() => onAction('add_image')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-150 transition-all active:scale-[0.97] flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3 h-3 text-blue-500" /> Add Image
                  </button>
                  <button
                    onClick={() => onAction('add_watermark')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-150 transition-all active:scale-[0.97] flex items-center gap-1.5"
                  >
                    <Stamp className="w-3 h-3 text-blue-500" /> Watermark
                  </button>
                  <button
                    onClick={() => onAction('crop_pages')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-150 transition-all active:scale-[0.97] flex items-center gap-1.5"
                  >
                    <Scissors className="w-3 h-3 text-blue-500" /> Crop Pages
                  </button>
                  <button
                    onClick={() => onAction('open_bates_modal')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-150 transition-all active:scale-[0.97] flex items-center gap-1.5"
                  >
                    <Tag className="w-3 h-3 text-blue-500" /> Bates Stamping
                  </button>
                </div>
              </div>
            )}

            {/* 2. CONVERT & EXPORT */}
            {(!activeMegaverb || activeMegaverb === 'convert') && (
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Create &amp; Convert</span>
                  </div>
                  {!isStandardOrAbove && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Standard</span>
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase pt-1">Export PDF To:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onAction('export_word')}
                      className="p-1.5 text-left rounded bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-150 active:scale-[0.97] transition-all flex items-center gap-1.5"
                    >
                      <FileText className="w-3 h-3 text-blue-600" /> Word (.docx)
                    </button>
                    <button
                      onClick={() => onAction('export_excel')}
                      className="p-1.5 text-left rounded bg-slate-50 hover:bg-emerald-50 text-slate-700 border border-slate-150 active:scale-[0.97] transition-all flex items-center gap-1.5"
                    >
                      <FileSpreadsheet className="w-3 h-3 text-emerald-600" /> Excel (.xlsx)
                    </button>
                    <button
                      onClick={() => onAction('export_powerpoint')}
                      className="p-1.5 text-left rounded bg-slate-50 hover:bg-amber-50 text-slate-700 border border-slate-150 active:scale-[0.97] transition-all flex items-center gap-1.5"
                    >
                      <Presentation className="w-3 h-3 text-amber-600" /> PowerPoint (.pptx)
                    </button>
                    <button
                      onClick={() => onAction('export_rtf')}
                      className="p-1.5 text-left rounded bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-150 active:scale-[0.97] transition-all flex items-center gap-1.5"
                    >
                      <FileText className="w-3 h-3 text-teal-600" /> Rich Text (.rtf)
                    </button>
                    <button
                      onClick={() => onAction('export_indesign')}
                      className="p-1.5 text-left rounded bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-150 active:scale-[0.97] transition-all flex items-center gap-1.5"
                    >
                      <FileCode className="w-3 h-3 text-orange-600" /> InDesign (.idml)
                    </button>
                    <button
                      onClick={() => onAction('open_web_capture')}
                      className="p-1.5 text-left rounded bg-slate-50 hover:bg-blue-50 text-slate-700 border border-slate-150 active:scale-[0.97] transition-all flex items-center gap-1.5"
                    >
                      <Globe className="w-3 h-3 text-blue-600" /> Web Capture (URL)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ORGANIZE PAGES */}
            {(!activeMegaverb || activeMegaverb === 'organize') && (
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
                    <span>Organize Pages</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => onAction('rotate_cw')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-amber-50 text-slate-700 border border-slate-150 active:scale-[0.97] transition-all flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3 h-3 text-amber-600" /> Rotate 90° CW
                  </button>
                  <button
                    onClick={() => onAction('delete_current_page')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-red-50 text-slate-700 border border-slate-150 active:scale-[0.97] transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" /> Delete Page
                  </button>
                  <button
                    onClick={() => onAction('insert_blank_page')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 active:scale-[0.97] transition-all flex items-center gap-1.5"
                  >
                    <PlusSquare className="w-3 h-3 text-slate-600" /> Insert Blank
                  </button>
                  <button
                    onClick={() => onAction('split_pdf')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 active:scale-[0.97] transition-all flex items-center gap-1.5"
                  >
                    <Scissors className="w-3 h-3 text-slate-600" /> Split Document
                  </button>
                </div>
              </div>
            )}

            {/* 4. FORMS & E-SIGN */}
            {(!activeMegaverb || activeMegaverb === 'forms') && (
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <FileSignature className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Forms &amp; E-Sign</span>
                  </div>
                  {currentDoc?.isCertified && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.2 rounded">AATL</span>
                  )}
                </div>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => onAction('prepare_form')}
                    className={`w-full p-1.5 text-left rounded border flex items-center justify-between transition-all ${
                      highlightFields 
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md' 
                        : 'bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 text-slate-700 border-slate-150'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Sliders className={`w-3 h-3 ${highlightFields ? 'text-indigo-100' : 'text-indigo-600'}`} /> Prepare Form Fields
                    </span>
                    <span className={`text-[10px] ${highlightFields ? 'text-indigo-200' : 'text-slate-400'}`}>Interactive</span>
                  </button>
                  <button
                    onClick={() => onAction('request_esign')}
                    className="w-full p-1.5 text-left rounded bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 text-slate-700 border border-slate-150 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="w-3 h-3 text-indigo-600" /> Request E-Signatures (Sign)
                    </span>
                    <span className="text-[10px] text-indigo-600 font-medium">Audit Trail</span>
                  </button>
                  <button
                    onClick={() => onAction('verify_digital_signature')}
                    className="w-full p-1.5 text-left rounded bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 text-slate-700 border border-slate-150 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verify AATL / EUTL Certificates
                  </button>
                </div>
              </div>
            )}

            {/* 5. PROTECT & REDACT */}
            {(!activeMegaverb || activeMegaverb === 'protect') && (
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                    <span>Protect &amp; Redact</span>
                  </div>
                  {!isProOrAbove && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Pro</span>
                  )}
                </div>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => onAction('open_redact_dialog')}
                    className="w-full p-1.5 text-left rounded bg-red-50/70 hover:bg-red-100 text-red-900 border border-red-200 flex items-center justify-between font-medium"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3 h-3 text-red-600" /> Auto-Detect &amp; Purge PII (SSN, CC)
                    </span>
                    <span className="text-[10px] bg-red-600 text-white px-1 rounded">Permanent</span>
                  </button>
                  <button
                    onClick={() => onAction('encrypt_password')}
                    className="w-full p-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-slate-600" /> Password &amp; AES-256 Encrypt
                    </span>
                    <span className="text-[10px] text-slate-400">FIPS 140</span>
                  </button>
                  <button
                    onClick={() => onAction('sanitize_document')}
                    className="w-full p-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-slate-600" /> Sanitize Hidden Metadata &amp; Layers
                  </button>
                </div>
              </div>
            )}

            {/* 6. AI ASSISTANT & SPACES (STUDIO TIER) */}
            {(!activeMegaverb || activeMegaverb === 'ai') && (
              <div className="rounded-lg border border-purple-200 bg-purple-50/40 p-2.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Assistant &amp; Spaces</span>
                  </div>
                  <span className="text-[10px] bg-purple-200/80 text-purple-800 font-semibold px-1.5 py-0.5 rounded">
                    Studio
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => onAction('open_ai_assistant')}
                    className="w-full p-1.5 text-left rounded bg-white hover:bg-purple-100 text-purple-950 border border-purple-200 flex items-center justify-between font-medium shadow-2xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-purple-600" /> Document Q&amp;A with Citations
                    </span>
                    <span className="text-[10px] text-purple-600">&lt; 3s</span>
                  </button>
                  <button
                    onClick={() => onAction('open_intel_lab')}
                    className="w-full p-1.5 text-left rounded bg-red-600 hover:bg-red-700 text-white border border-red-500 flex items-center justify-between font-bold shadow-md"
                  >
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-white" /> Intelligence Lab (Experimental)
                    </span>
                    <span className="text-[10px] bg-white text-red-600 px-1 rounded">Beta</span>
                  </button>
                  <button
                    onClick={() => onAction('open_podcast_modal')}
                    className="w-full p-1.5 text-left rounded bg-white hover:bg-purple-100 text-purple-950 border border-purple-200 flex items-center justify-between shadow-2xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <Mic className="w-3 h-3 text-purple-600" /> AI Audio Podcasts (Dual Host)
                    </span>
                    <span className="text-[10px] text-slate-400">Audio/TTS</span>
                  </button>
                  <button
                    onClick={() => onAction('open_presentation_modal')}
                    className="w-full p-1.5 text-left rounded bg-white hover:bg-purple-100 text-purple-950 border border-purple-200 flex items-center justify-between shadow-2xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <Presentation className="w-3 h-3 text-purple-600" /> Generative Slide Deck
                    </span>
                    <span className="text-[10px] text-slate-400">Express</span>
                  </button>
                  <button
                    onClick={() => onAction('open_pdf_spaces')}
                    className="w-full p-1.5 text-left rounded bg-white hover:bg-purple-100 text-purple-950 border border-purple-200 flex items-center justify-between shadow-2xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <FolderSync className="w-3 h-3 text-purple-600" /> PDF Spaces (Knowledge Hub)
                    </span>
                    <span className="text-[10px] text-slate-400">Multi-File</span>
                  </button>
                </div>
              </div>
            )}

            {/* 7. PRO STANDARDS & PRINT PRODUCTION */}
            {(!activeMegaverb || activeMegaverb === 'pro') && (
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Printer className="w-3.5 h-3.5 text-slate-700" />
                    <span>Pro Standards &amp; Print</span>
                  </div>
                  {!isProOrAbove && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Pro</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => onAction('open_ocr_modal')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 flex items-center gap-1.5"
                  >
                    <Search className="w-3 h-3 text-slate-600" /> OCR Scanned
                  </button>
                  <button
                    onClick={() => onAction('open_action_wizard')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-purple-50 text-slate-700 border border-slate-150 flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3 h-3 text-purple-600" /> Action Wizard
                  </button>
                  <button
                    onClick={() => onAction('open_compare_modal')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 flex items-center gap-1.5"
                  >
                    <FileDiff className="w-3 h-3 text-blue-600" /> Compare Files
                  </button>
                  <button
                    onClick={() => onAction('open_preflight_modal')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Preflight / PDF/A
                  </button>
                  <button
                    onClick={() => onAction('open_print_production')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 flex items-center gap-1.5"
                  >
                    <Printer className="w-3 h-3 text-slate-600" /> Output Preview
                  </button>
                  <button
                    onClick={() => onAction('toggle_measure_tool')}
                    className={`p-1.5 text-left rounded border transition-all flex items-center gap-1.5 ${
                      toolMode === 'measure'
                        ? 'bg-slate-700 text-white border-slate-800 shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150'
                    }`}
                  >
                    <Ruler className={`w-3 h-3 ${toolMode === 'measure' ? 'text-slate-200' : 'text-slate-600'}`} /> Measure Caliper
                  </button>
                  <button
                    onClick={() => onAction('open_accessibility_checker')}
                    className="p-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-150 flex items-center gap-1.5"
                  >
                    <Compass className="w-3 h-3 text-slate-600" /> Accessibility
                  </button>
                </div>
              </div>
            )}

            {/* 8. ADMIN & COMPLIANCE */}
            {(!activeMegaverb || activeMegaverb === 'admin') && (
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    <span>Admin &amp; Compliance</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Enterprise</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => onAction('open_admin_console')}
                    className="w-full p-1.5 text-left rounded bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-150 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-teal-700" /> Adobe Admin Console &amp; NUL
                    </span>
                    <span className="text-[10px] text-teal-700 font-medium">SSO/SAML</span>
                  </button>
                  <button
                    onClick={() => onAction('open_purview_labels')}
                    className="w-full p-1.5 text-left rounded bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-150 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-slate-600" /> Microsoft Purview MIP Labels
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold">{currentDoc?.sensitivityLabel || 'MIP'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
