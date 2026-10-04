import React from 'react';
import { 
  X, 
  FileText, 
  Plus, 
  Search, 
  Clock, 
  Star, 
  Grid, 
  List as ListIcon,
  Trash2,
  MoreVertical,
  Check
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface HomeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  documents: PdfDocument[];
  currentDocId: string;
  onSelectDoc: (id: string) => void;
  onUploadDoc: () => void;
  onNewDoc: () => void;
  onLoadSamples?: () => void;
  onDeleteDoc: (id: string) => void;
}

export const HomeOverlay: React.FC<HomeOverlayProps> = ({
  isOpen,
  onClose,
  documents,
  currentDocId,
  onSelectDoc,
  onUploadDoc,
  onNewDoc,
  onLoadSamples,
  onDeleteDoc,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-50 w-full h-full md:max-w-6xl md:h-[85vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white shadow-sm">
               <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Chad-OmniPDF Home</h1>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar (Desktop) */}
          <div className="hidden md:flex w-64 border-r border-slate-200 bg-white flex-col py-6 px-4 space-y-8">
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 bg-red-50 text-red-700 rounded-lg font-semibold text-sm">
                <Clock className="w-4 h-4" /> Recent
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition-colors">
                <Star className="w-4 h-4" /> Starred
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition-colors">
                <FileText className="w-4 h-4" /> All Files
              </button>
            </div>

            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Connected Storage</div>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Chad-OmniPDF Cloud
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 cursor-not-allowed rounded-lg text-sm">
                <Plus className="w-4 h-4" /> Add Storage
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {/* Action Bar */}
            <div className="p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search your documents..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all shadow-sm"
                />
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={onNewDoc}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Create
                </button>
                <button 
                  onClick={onUploadDoc}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-600/20"
                >
                  <Plus className="w-4 h-4" /> Upload
                </button>
              </div>
            </div>

            {/* Document Grid */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900">Recent Documents</h2>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 shadow-xs"><ListIcon className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600"><Grid className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No documents yet</h3>
                  <p className="text-sm text-slate-500 max-w-sm mb-8">
                    Your workspace is clean. Upload your first PDF, create a new document, or load our pre-configured enterprise demonstration suite.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {onLoadSamples && (
                      <button 
                        onClick={() => {
                          onLoadSamples();
                          onClose();
                        }}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-900/20 active:scale-95 cursor-pointer"
                      >
                        Load Enterprise Demo Suite
                      </button>
                    )}
                    <button 
                      onClick={onUploadDoc}
                      className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 cursor-pointer"
                    >
                      Upload your first PDF
                    </button>
                    <button 
                      onClick={onNewDoc}
                      className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                    >
                      Create empty document
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {documents.map((doc) => {
                    const isSelected = doc.id === currentDocId;
                    return (
                    <div 
                        key={doc.id}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDoc(doc.id);
                          onClose();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectDoc(doc.id);
                            onClose();
                          }
                        }}
                        className={`group relative bg-white border rounded-2xl p-4 cursor-pointer text-left transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] outline-none focus:ring-2 focus:ring-red-500 ${
                          isSelected ? 'border-red-500 ring-2 ring-red-500/30 bg-red-50/10 shadow-md' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="aspect-[4/5] bg-slate-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-slate-150 relative">
                          {doc.pages[0]?.bgDataUrl ? (
                            <img src={doc.pages[0].bgDataUrl} alt={doc.title} className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-12 h-12 text-slate-300" />
                          )}
                          
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md animate-in zoom-in-50">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors pointer-events-none" />
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-red-600 transition-colors">
                              {doc.title}
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {doc.pageCount} pages • {(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                              {doc.isCertified ? ' • AATL' : ''}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Opened {new Date(doc.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteDoc(doc.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
