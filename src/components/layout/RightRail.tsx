import React, { useState } from 'react';
import {
  Bookmark,
  Layers,
  MessageSquare,
  Paperclip,
  Image as ThumbnailIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  Download,
  Trash2,
  Send,
  CornerDownRight,
  Search,
  Filter
} from 'lucide-react';
import {
  RightRailTab,
  PdfDocument,
  DocumentBookmark,
  Annotation,
  DocumentLayer,
  DocumentAttachment
} from '../../types/chad-omnidpdf';

interface RightRailProps {
  currentDoc?: PdfDocument;
  activeTab: RightRailTab | null;
  onSelectTab: (tab: RightRailTab | null) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onFitWidth: () => void;
  onFitPage: () => void;
  liquidMode: boolean;
  onToggleLiquidMode: () => void;
  onToggleLayer: (layerId: string) => void;
  onAddComment: (pageNumber: number, text: string) => void;
  onDeleteAnnotation: (id: string) => void;
  onRotatePage: (pageNum: number) => void;
  onDeletePage: (pageNum: number) => void;
  onAddAttachment?: (att: DocumentAttachment) => void;
  onDeleteAttachment?: (id: string) => void;
}

export const RightRail: React.FC<RightRailProps> = ({
  currentDoc,
  activeTab,
  onSelectTab,
  currentPage,
  onPageChange,
  zoom,
  onZoomChange,
  onFitWidth,
  onFitPage,
  liquidMode,
  onToggleLiquidMode,
  onToggleLayer,
  onAddComment,
  onDeleteAnnotation,
  onRotatePage,
  onDeletePage,
  onAddAttachment,
  onDeleteAttachment,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [commentFilter, setCommentFilter] = useState<'all' | 'unresolved'>('all');
  const fileAttachmentInputRef = React.useRef<HTMLInputElement>(null);

  const tabs: { id: RightRailTab; label: string; icon: React.ReactNode; badgeCount?: number }[] = [
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'thumbnails', label: 'Page Thumbnails', icon: <ThumbnailIcon className="w-4 h-4" /> },
    {
      id: 'comments',
      label: 'Comments',
      icon: <MessageSquare className="w-4 h-4" />,
      badgeCount: currentDoc?.annotations.length || 0
    },
    { id: 'layers', label: 'Layers', icon: <Layers className="w-4 h-4" /> },
    {
      id: 'attachments',
      label: 'Attachments',
      icon: <Paperclip className="w-4 h-4" />,
      badgeCount: currentDoc?.attachments.length || 0
    },
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      onAddComment(currentPage, newCommentText.trim());
      setNewCommentText('');
    }
  };

  const filteredAnnotations = currentDoc?.annotations.filter((a) => {
    if (commentFilter === 'unresolved') return !a.resolved;
    return true;
  }) || [];

  return (
    <aside
      className={`bg-white border-l border-slate-200 flex flex-col justify-between transition-all duration-200 select-none z-30 ${
        activeTab ? 'w-80' : 'w-12'
      }`}
    >
      {/* TOP: Tab Navigation Buttons */}
      <div className="flex border-b border-slate-150 bg-slate-50/70">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(isActive ? null : tab.id)}
              className={`flex-1 py-2 flex flex-col items-center justify-center relative transition-colors ${
                isActive
                  ? 'bg-white text-red-600 font-semibold border-b-2 border-red-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={tab.label}
            >
              {tab.icon}
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <span className="absolute top-1 right-2 bg-slate-200 text-slate-700 text-[9px] font-bold px-1 rounded-full">
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CENTER: Tab Content Pane */}
      {activeTab && (
        <div className="flex-1 overflow-y-auto p-3 text-xs">
          {/* 1. BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider">
                  Document Bookmarks
                </span>
                <span className="text-[10px] text-slate-400">{currentDoc?.bookmarks.length || 0} items</span>
              </div>
              {!currentDoc || currentDoc.bookmarks.length === 0 ? (
                <div className="text-slate-400 italic py-6 text-center">No bookmarks found</div>
              ) : (
                <div className="space-y-1">
                  {currentDoc.bookmarks.map((bm) => (
                    <button
                      key={bm.id}
                      onClick={() => onPageChange(bm.pageNumber)}
                      className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors ${
                        currentPage === bm.pageNumber
                          ? 'bg-red-50 text-red-700 font-medium'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <Bookmark className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{bm.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">p. {bm.pageNumber}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. PAGE THUMBNAILS */}
          {activeTab === 'thumbnails' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider">
                  Page Thumbnails ({currentDoc?.pages.length || 0})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {currentDoc?.pages.map((p) => {
                  const isCurrent = currentPage === p.pageNumber;
                  return (
                    <div
                      key={p.pageNumber}
                      onClick={() => onPageChange(p.pageNumber)}
                      className={`group relative rounded border cursor-pointer p-1.5 transition-all ${
                        isCurrent
                          ? 'border-red-600 bg-red-50/30 shadow-xs ring-1 ring-red-600'
                          : 'border-slate-200 bg-white hover:border-slate-400'
                      }`}
                    >
                      {/* Mini Page Canvas Representation */}
                      <div className="aspect-[8.5/11] bg-white border border-slate-100 shadow-2xs rounded-xs p-1 flex flex-col justify-between overflow-hidden relative">
                        {p.bgDataUrl ? (
                          <img
                            src={p.bgDataUrl}
                            alt={`Page ${p.pageNumber}`}
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                          />
                        ) : (
                          <div className="space-y-1 opacity-70 p-1">
                            <div className="h-1 bg-slate-700 rounded w-2/3"></div>
                            <div className="h-0.5 bg-slate-300 rounded w-full"></div>
                            <div className="h-0.5 bg-slate-300 rounded w-4/5"></div>
                            <div className="h-0.5 bg-slate-200 rounded w-full"></div>
                            <div className="h-0.5 bg-slate-300 rounded w-3/4"></div>
                          </div>
                        )}
                        <div className="text-[8px] font-mono text-center text-slate-400 relative z-10 mt-auto">
                          {p.rotation !== 0 && `⟳ ${p.rotation}°`}
                        </div>
                      </div>

                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-slate-600">Page {p.pageNumber}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRotatePage(p.pageNumber);
                            }}
                            className="p-0.5 hover:bg-slate-200 rounded"
                            title="Rotate 90°"
                          >
                            <RotateCw className="w-2.5 h-2.5 text-slate-600" />
                          </button>
                          {currentDoc && currentDoc.pages.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeletePage(p.pageNumber);
                              }}
                              className="p-0.5 hover:bg-red-100 rounded text-red-600"
                              title="Delete Page"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. COMMENTS & MARKUPS */}
          {activeTab === 'comments' && (
            <div className="space-y-3 flex flex-col h-full">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider">
                  Comments &amp; Annotations
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentDoc?.annotations.length || 0} items
                </span>
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleCommentSubmit} className="relative">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Add comment on page ${currentPage}...`}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md pl-2 pr-7 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="absolute right-1.5 top-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-2 overflow-y-auto flex-1 max-h-[calc(100vh-280px)] pr-0.5">
                {!currentDoc || currentDoc.annotations.length === 0 ? (
                  <div className="text-slate-400 text-center py-6 italic">No comments or markups yet.</div>
                ) : (
                  currentDoc.annotations.map((ann) => (
                    <div
                      key={ann.id}
                      onClick={() => onPageChange(ann.pageNumber)}
                      className="p-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs group"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: ann.color || '#eab308' }}
                          />
                          {ann.author}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">p. {ann.pageNumber}</span>
                      </div>
                      <p className="text-slate-600 text-xs mb-1.5 leading-relaxed">{ann.content || `[${ann.type}]`}</p>

                      {ann.replies && ann.replies.length > 0 && (
                        <div className="ml-2 pl-2 border-l border-slate-200 space-y-1 my-1">
                          {ann.replies.map((rep) => (
                            <div key={rep.id} className="text-[10px] text-slate-500">
                              <span className="font-semibold text-slate-700">{rep.author}:</span> {rep.text}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAnnotation(ann.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. LAYERS (OCG) */}
          {activeTab === 'layers' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider">
                  PDF Optional Content Layers (OCG)
                </span>
              </div>
              <div className="space-y-1">
                {currentDoc?.layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200"
                  >
                    <span className="text-slate-700 truncate pr-2">{layer.name}</span>
                    <button
                      onClick={() => onToggleLayer(layer.id)}
                      className={`p-1 rounded transition-colors ${
                        layer.visible ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-300 hover:bg-slate-100'
                      }`}
                      title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                    >
                      {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. ATTACHMENTS */}
          {activeTab === 'attachments' && (
            <div className="space-y-2">
              <input
                type="file"
                ref={fileAttachmentInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const newAtt: DocumentAttachment = {
                    id: `att-${Date.now()}`,
                    name: file.name,
                    size: `${(file.size / 1024).toFixed(1)} KB`,
                    date: new Date().toISOString().split('T')[0],
                    type: file.type || 'application/octet-stream',
                    contentSnippet: `Embedded attachment: ${file.name} (${file.type || 'file'}) attached directly to document stream.`,
                  };
                  onAddAttachment?.(newAtt);
                  e.target.value = '';
                }}
                className="hidden"
              />

              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider">
                  Embedded File Attachments
                </span>
                <button
                  onClick={() => fileAttachmentInputRef.current?.click()}
                  className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] font-semibold border border-blue-200 transition-colors flex items-center gap-1"
                >
                  + Attach File
                </button>
              </div>

              {!currentDoc || currentDoc.attachments.length === 0 ? (
                <div className="text-slate-400 text-center py-6 italic text-xs">
                  <div>No attachments in this document.</div>
                  <button
                    disabled={!currentDoc}
                    onClick={() => fileAttachmentInputRef.current?.click()}
                    className="mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-[11px] disabled:opacity-30"
                  >
                    Attach First File
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentDoc.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center justify-between font-medium text-slate-800 mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          {att.name.endsWith('.xlsx') ? (
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          )}
                          <span className="truncate">{att.name}</span>
                        </div>
                        {onDeleteAttachment && (
                          <button
                            onClick={() => onDeleteAttachment(att.id)}
                            className="text-slate-400 hover:text-red-600 p-0.5 rounded transition-colors"
                            title="Remove attachment"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                        <span>{att.size}</span>
                        <span>{att.date}</span>
                      </div>
                      {att.contentSnippet && (
                        <p className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded mb-1.5 line-clamp-2">
                          {att.contentSnippet}
                        </p>
                      )}
                      <button
                        onClick={() => {
                          const content = att.contentSnippet || `Content of ${att.name} embedded in ${currentDoc.title}`;
                          const blob = new Blob([content], { type: att.type || 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = att.name;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="w-full text-center py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-[10px] flex items-center justify-center gap-1 transition-colors"
                      >
                        <Download className="w-2.5 h-2.5" /> Download Attached File
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* BOTTOM: Viewing Controls & Page Navigation */}
      <div className="border-t border-slate-200 p-2 bg-slate-50/80 space-y-1.5">
        {/* Mobile Liquid Mode Switch */}
        <button
          onClick={onToggleLiquidMode}
          className={`w-full py-1 px-1.5 rounded-md flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${
            liquidMode
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
          title="Liquid Mode (AI/ML Reading Reflow for Smartphones)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          {activeTab && <span>{liquidMode ? 'Liquid Mode ON' : 'Liquid Mode (Reflow)'}</span>}
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-0.5">
          <button
            onClick={() => onZoomChange(Math.max(50, zoom - 15))}
            className="p-1 text-slate-600 hover:bg-slate-100 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-[11px] font-semibold text-slate-700 font-mono px-1">
            {zoom}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(300, zoom + 15))}
            className="p-1 text-slate-600 hover:bg-slate-100 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        {/* Fit Width / Fit Page */}
        {activeTab && (
          <div className="flex items-center space-x-1">
            <button
              onClick={onFitWidth}
              className="flex-1 py-1 text-[10px] bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-600 font-medium"
            >
              Fit Width
            </button>
            <button
              onClick={onFitPage}
              className="flex-1 py-1 text-[10px] bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-600 font-medium"
            >
              Fit Page
            </button>
          </div>
        )}

        {/* Page Nav: Previous / Next & Jump */}
        <div className="flex items-center justify-between text-xs pt-1">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-1 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-30"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium font-mono">
            <span>{currentPage}</span>
            <span className="text-slate-400">/</span>
            <span>{currentDoc?.pageCount || 1}</span>
          </div>
          <button
            disabled={!currentDoc || currentPage >= currentDoc.pageCount}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1 text-slate-600 hover:bg-slate-200 rounded disabled:opacity-30"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
