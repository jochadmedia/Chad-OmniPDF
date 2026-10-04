import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Undo2,
  Redo2,
  Save,
  Printer,
  Share2,
  ChevronDown,
  User,
  ShieldCheck,
  Sparkles,
  FileText,
  FilePlus,
  Download,
  Check,
  FolderOpen,
  Settings,
  Layers,
  HelpCircle,
  Eye,
  Sliders,
  ChevronRight,
  Upload,
  Trash2
} from 'lucide-react';
import { AccountTier, PdfDocument } from '../../types/chad-omnidpdf';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface GlobalBarProps {
  currentDoc?: PdfDocument;
  documents: PdfDocument[];
  onSelectDoc: (docId: string) => void;
  onUploadDoc: (file: File) => void;
  onNewDoc: () => void;
  onDeleteDoc: (id: string) => void;
  accountTier: AccountTier;
  onTierChange: (tier: AccountTier) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPrint: () => void;
  onShare: () => void;
  onOpenSearch: () => void;
  onOpenAdminConsole: () => void;
  legacyUiActive: boolean;
  onToggleLegacyUi: () => void;
  onOpenPreferences?: () => void;
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const GlobalBar: React.FC<GlobalBarProps> = ({
  currentDoc,
  documents,
  onSelectDoc,
  onUploadDoc,
  onNewDoc,
  onDeleteDoc,
  accountTier,
  onTierChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onPrint,
  onShare,
  onOpenSearch,
  onOpenAdminConsole,
  legacyUiActive,
  onToggleLegacyUi,
  onOpenPreferences,
  user,
  onSignIn,
  onSignOut,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setDocDropdownOpen(false);
        setTierDropdownOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDoc(e.target.files[0]);
    }
  };

  const tierColors: Record<AccountTier, { bg: string; text: string; label: string }> = {
    reader: { bg: 'bg-slate-100 text-slate-700 border-slate-300', text: 'text-slate-700', label: 'Reader (Free)' },
    standard: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-700', label: 'Standard' },
    pro: { bg: 'bg-red-50 text-red-700 border-red-200', text: 'text-red-700', label: 'Pro' },
    studio: { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'text-purple-700', label: 'Studio & AI' },
    enterprise: { bg: 'bg-amber-50 text-amber-800 border-amber-300', text: 'text-amber-800', label: 'Enterprise' },
  };

  return (
    <header className="h-12 bg-white border-b border-slate-200 px-3 flex items-center justify-between select-none relative z-50 shadow-xs">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf,application/msword,image/*"
        className="hidden"
      />

      {/* LEFT SECTION: Hamburger Menu, Logo, Document Title */}
      <div className="flex items-center space-x-2.5 min-w-0" ref={menuRef}>
        {/* Hamburger Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-700 ${
              menuOpen ? 'bg-slate-100' : ''
            }`}
            title="Menu"
            aria-label="Application Menu"
          >
            <Menu className="w-4 h-4 text-slate-700" />
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-10 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-800">
              <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                File
              </div>
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-slate-500" /> Open / Upload PDF...
                </span>
                <span className="text-[10px] text-slate-400">Ctrl+O</span>
              </button>
              <button
                onClick={() => {
                  onNewDoc();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FilePlus className="w-3.5 h-3.5 text-slate-500" /> New Blank Document
                </span>
                <span className="text-[10px] text-slate-400">Ctrl+N</span>
              </button>
              <button
                onClick={() => {
                  onSave();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Save className="w-3.5 h-3.5 text-slate-500" /> Save As PDF...
                </span>
                <span className="text-[10px] text-slate-400">Ctrl+S</span>
              </button>
              <button
                onClick={() => {
                  onPrint();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Document
                </span>
                <span className="text-[10px] text-slate-400">Ctrl+P</span>
              </button>

              <div className="h-px bg-slate-150 my-1"></div>

              <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Edit &amp; History
              </div>
              <button
                disabled={!canUndo}
                onClick={() => {
                  onUndo();
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  canUndo ? 'hover:bg-slate-100 text-slate-700' : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Undo2 className="w-3.5 h-3.5" /> Undo
                </span>
                <span className="text-[10px]">Ctrl+Z</span>
              </button>
              <button
                disabled={!canRedo}
                onClick={() => {
                  onRedo();
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between ${
                  canRedo ? 'hover:bg-slate-100 text-slate-700' : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Redo2 className="w-3.5 h-3.5" /> Redo
                </span>
                <span className="text-[10px]">Ctrl+Y</span>
              </button>

              <div className="h-px bg-slate-150 my-1"></div>

              <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Enterprise &amp; View
              </div>
              <button
                onClick={() => {
                  onOpenAdminConsole();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Adobe Admin Console &amp; Licensing
              </button>
              <button
                onClick={() => {
                  onToggleLegacyUi();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between text-slate-600"
              >
                <span>{legacyUiActive ? 'Enable New Chad-OmniPDF UI' : 'Disable New Chad-OmniPDF (Legacy Mode)'}</span>
                {legacyUiActive && <Check className="w-3 h-3 text-red-600" />}
              </button>
              {onOpenPreferences && (
                <button
                  onClick={() => {
                    onOpenPreferences();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2 text-slate-700"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" /> Preferences...
                </button>
              )}
            </div>
          )}
        </div>

        {/* Chad-OmniPDF Iconic Brand Emblem */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
          <div className="w-6 h-6 rounded bg-[#ea1c24] flex items-center justify-center shadow-xs">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M14.07 3h4.63L23 21h-4.32l-2.43-6.61H7.75L5.32 21H1L5.3 3h4.63l2.07 5.92L14.07 3zm-3.13 8.35L12 8.44l1.06 2.91h-2.12z" />
            </svg>
          </div>
          <span className="font-semibold text-slate-900 text-xs tracking-tight hidden sm:inline">
            Chad-<span className="font-bold text-red-600">OmniPDF</span>
          </span>
        </div>

        {/* Document Selector & Title */}
        <div className="relative">
          <button
            onClick={() => setDocDropdownOpen(!docDropdownOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 text-left max-w-[260px] md:max-w-md transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="text-xs font-medium text-slate-900 truncate">
              {currentDoc?.fileName || currentDoc?.title || 'No Document Open'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {docDropdownOpen && (
            <div className="absolute left-0 top-9 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Active Document
              </div>
              {documents.length === 0 ? (
                <div className="px-3 py-4 text-center text-slate-400 italic">
                  No documents in library
                </div>
              ) : (
                documents.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        onSelectDoc(d.id);
                        setDocDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                        d.id === currentDoc?.id ? 'bg-red-50/50 text-red-900 font-medium' : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate pr-2 flex-1">
                        <div className="truncate font-medium">{d.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {d.pageCount} pages • {(d.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                          {d.isCertified ? ' • AATL Certified' : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {d.id === currentDoc?.id && <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Call the parent handler - will need to add it to props
                            onDeleteDoc?.(d.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                ))
              )}
              <div className="h-px bg-slate-100 my-1" />
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setDocDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-red-600 font-medium flex items-center gap-1.5"
              >
                <FolderOpen className="w-3.5 h-3.5" /> Upload Another PDF File...
              </button>
              <button
                onClick={() => {
                  onNewDoc();
                  setDocDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1.5"
              >
                <FilePlus className="w-3.5 h-3.5 text-slate-500" /> Start New Blank PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Unified Search Bar (Resolves UI Tools + In-Document Text) */}
      <div className="flex-1 max-w-md mx-3 hidden lg:block">
        <button
          onClick={onOpenSearch}
          className="w-full h-8 bg-slate-100 hover:bg-slate-150 border border-slate-200 rounded-md px-3 flex items-center justify-between text-xs text-slate-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            <span>Search tools, actions or in-document text...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-500 shadow-2xs font-mono">
            Ctrl+F / ⌘F
          </kbd>
        </button>
      </div>

      {/* RIGHT SECTION: Quick Actions (Undo, Redo, Save, Print, Share, Tier Switcher, Profile) */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
          title="Search tools and text"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center border-r border-slate-200 pr-1 mr-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-md ${
              canUndo ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-md ${
              canRedo ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Save */}
        <button
          disabled={!currentDoc}
          onClick={onSave}
          className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Save As / Export (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
        </button>

        {/* Print */}
        <button
          disabled={!currentDoc}
          onClick={onPrint}
          className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Print Document (Ctrl+P)"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* PWA / Windows Desktop Installation */}
        <PWAInstallButton />

        {/* Share Link */}
        <button
          disabled={!currentDoc}
          onClick={onShare}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Share Link for Real-time Review"
        >
          <Share2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden md:inline">Share</span>
        </button>

        {/* Account Tier Switcher */}
        <div className="relative">
          <button
            onClick={() => setTierDropdownOpen(!tierDropdownOpen)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border ${
              tierColors[accountTier].bg
            } transition-all`}
          >
            <span>{tierColors[accountTier].label}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {tierDropdownOpen && (
            <div className="absolute right-0 top-9 w-60 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Edition Tier
              </div>
              {(['reader', 'standard', 'pro', 'studio', 'enterprise'] as AccountTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTierChange(t);
                    setTierDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-all active:scale-[0.98] border-b border-slate-50 last:border-0 ${
                    accountTier === t ? 'bg-slate-50 font-bold text-red-600' : 'text-slate-700'
                  }`}
                >
                  <div className="pr-4">
                    <div className="capitalize text-xs">{t === 'studio' ? 'Chad-OmniPDF Studio & AI' : `Chad-OmniPDF ${t}`}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5 leading-tight">
                      {t === 'reader' && 'Free viewing, comments & liquid mode'}
                      {t === 'standard' && 'PDF edit, combine & MS Office export'}
                      {t === 'pro' && 'OCR, Redact, Compare, Preflight, Bates'}
                      {t === 'studio' && 'AI Assistant, Spaces, Podcasts, Firefly'}
                      {t === 'enterprise' && 'Admin Console, MIP, SSO & AppContainer'}
                    </div>
                  </div>
                  {accountTier === t && (
                    <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          {user ? (
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-7 h-7 rounded-full text-white flex items-center justify-center font-medium text-xs shadow-xs hover:ring-2 hover:ring-slate-300 overflow-hidden"
              title={`${user.displayName || 'User'} Profile`}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="User Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-red-600 text-white flex items-center justify-center font-bold">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={onSignIn}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-xs active:scale-95 transition-all flex items-center gap-1"
              title="Sign in with Google"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.68 0-8.5-3.82-8.5-8.5s3.82-8.5 8.5-8.5c2.14 0 3.99.775 5.435 2.15l3.225-3.225C18.66.72 15.68 0 12.24 0 5.58 0 0 5.58 0 12.24S5.58 24.48 12.24 24.48c6.96 0 12.24-4.89 12.24-12.24 0-.83-.075-1.43-.225-1.955H12.24z"/>
              </svg>
              <span>Login</span>
            </button>
          )}

          {profileOpen && user && (
            <div className="absolute right-0 top-9 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-50 text-xs">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="truncate">
                  <div className="font-semibold text-slate-800 truncate">{user.displayName || 'Google User'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                </div>
              </div>
              <div className="pt-2 text-[11px] space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Identity:</span>
                  <span className="font-medium">Google Account Auth</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Sandbox:</span>
                  <span className="text-emerald-600 font-medium">AppContainer Protected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Purview Label:</span>
                  <span className="font-medium text-amber-700">{currentDoc?.sensitivityLabel || 'General'}</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 space-y-1.5">
                <button
                  onClick={() => {
                    onOpenAdminConsole();
                    setProfileOpen(false);
                  }}
                  className="w-full text-center py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium transition-colors"
                >
                  Manage Admin Console
                </button>
                <button
                  onClick={() => {
                    onSignOut();
                    setProfileOpen(false);
                  }}
                  className="w-full text-center py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded font-bold transition-colors border border-red-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
