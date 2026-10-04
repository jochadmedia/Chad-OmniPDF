import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PdfDocument, PdfPage, BoundingBox, QuickToolMode, Annotation, FormField } from '../../types/chad-omnidpdf';

interface DocumentCanvasProps {
  currentDoc: PdfDocument;
  zoom: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  toolMode: QuickToolMode;
  activeColor: string;
  inlineEditActive: boolean;
  highlightFields: boolean;
  searchQuery: string;
  showGrid: boolean;
  units: string;
  onAddAnnotation: (ann: Omit<Annotation, 'id' | 'createdAt'>) => void;
  onUpdateFormField: (fieldId: string, value: any) => void;
  onSignField: (fieldId: string) => void;
  onUpdateParagraphText: (pageNumber: number, paragraphId: string, newText: string) => void;
  onDeleteAnnotation: (id: string) => void;
  onUpdateImage: (pageNumber: number, imageId: string, updates: any) => void;
  onDeleteImage: (pageNumber: number, imageId: string) => void;
  onUpdateTable?: (pageNumber: number, tableId: string, rowIndex: number, cellIndex: number, isHeader: boolean, newValue: string) => void;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  currentDoc,
  zoom,
  currentPage,
  onUpdateParagraphText,
  onUpdateTable,
  inlineEditActive, // New prop for global edit mode toggle
}) => {
  const [selectedCell, setSelectedCell] = useState<{ pageNumber: number; tableId: string; rowIndex: number; cellIndex: number; isHeader: boolean; value: string } | null>(null);
  const [editingParagraphId, setEditingParagraphId] = useState<string | null>(null); // State for inline paragraph editing
  const [paragraphInputValue, setParagraphInputValue] = useState<string>(''); // State for paragraph input value

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null); // Unified ref

  // Effect to focus input and adjust height when selectedCell or editingParagraphId changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();

      // Adjust height for textarea to fit content
      if (editingParagraphId && inputRef.current.tagName === 'TEXTAREA') {
        const textarea = inputRef.current as HTMLTextAreaElement;
        textarea.style.height = 'auto'; // Reset height first
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  }, [selectedCell, editingParagraphId, paragraphInputValue]);


  const handleCellClick = (pageNumber: number, tableId: string, rowIndex: number, cellIndex: number, isHeader: boolean, value: string) => {
    if (!inlineEditActive) return; // Only allow editing if inlineEditActive is true
    setEditingParagraphId(null); // Deselect any paragraph being edited
    setSelectedCell({ pageNumber, tableId, rowIndex, cellIndex, isHeader, value });
  };

  const handleTableInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedCell) {
      setSelectedCell({ ...selectedCell, value: e.target.value });
    }
  };

  const handleSaveTableEdit = () => {
    if (selectedCell && onUpdateTable) {
      onUpdateTable(selectedCell.pageNumber, selectedCell.tableId, selectedCell.rowIndex, selectedCell.cellIndex, selectedCell.isHeader, selectedCell.value);
    }
    setSelectedCell(null);
  };

  // Handlers for inline paragraph editing
  const handleParagraphClick = (pageNumber: number, paragraphId: string, currentText: string) => {
    if (!inlineEditActive) return;
    setSelectedCell(null); // Deselect any table cell being edited
    setEditingParagraphId(paragraphId);
    setParagraphInputValue(currentText);
  };

  const handleParagraphInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParagraphInputValue(e.target.value);
  };

  const handleSaveParagraphEdit = () => {
    if (editingParagraphId && onUpdateParagraphText) {
      onUpdateParagraphText(currentPage, editingParagraphId, paragraphInputValue);
    }
    setEditingParagraphId(null);
    setParagraphInputValue('');
  };

  const handleCancelParagraphEdit = () => {
    setEditingParagraphId(null);
    setParagraphInputValue('');
  };

  const page = currentDoc?.pages?.find((p) => p.pageNumber === currentPage);

  if (!page) return null;

  const scale = (zoom || 100) / 100;
  const canvasWidth = (page.width || 612) * scale;
  const canvasHeight = (page.height || 792) * scale;

  return (
    <div className="relative bg-white shadow-lg mx-auto transition-all duration-150" style={{ width: canvasWidth, height: canvasHeight }}>
      {/* Paragraphs */}
      {page.paragraphs?.map((para) => {
        if (!para || !para.box) return null;
        const isEditing = editingParagraphId === para.id;
        return (
          <div
            key={para.id}
            className={`absolute p-1 select-text ${inlineEditActive ? 'cursor-text hover:outline hover:outline-blue-300' : ''}`}
            style={{
              left: `${para.box.x || 0}%`,
              top: `${para.box.y || 0}%`,
              width: `${para.box.width || 0}%`,
              height: `${para.box.height || 0}%`,
              fontSize: para.style?.fontSize ? `${para.style.fontSize * scale}px` : `${12 * scale}px`,
              color: para.style?.color || '#000',
              textAlign: para.style?.align || 'left',
              zIndex: isEditing ? 10 : 1, // Ensure editor is on top
              padding: isEditing ? '0' : '0.25rem', // Adjust padding when editing
            }}
            onClick={() => handleParagraphClick(page.pageNumber, para.id, para.text || '')}
          >
            {isEditing ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={paragraphInputValue}
                onChange={handleParagraphInputChange}
                onBlur={handleSaveParagraphEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { // Save on Enter, allow Shift+Enter for new line
                    e.preventDefault();
                    handleSaveParagraphEdit();
                  }
                  if (e.key === 'Escape') handleCancelParagraphEdit();
                }}
                autoFocus
                className="w-full bg-white border border-blue-500 rounded resize-none focus:outline-none overflow-y-hidden"
                style={{
                  fontSize: para.style?.fontSize ? `${para.style.fontSize * scale}px` : `${12 * scale}px`,
                  lineHeight: `${(para.style?.fontSize ? para.style.fontSize * 1.2 : 14.4) * scale}px`,
                  height: 'auto', // Allow height to be auto
                  minHeight: `${(para.box.height || 0) * scale}px`, // Ensure it doesn't collapse
                }}
              />
            ) : (
              para.text || ''
            )}
          </div>
        );
      })}

      {/* Images */}
      {page.images?.map((img) => {
        if (!img || !img.box) return null;
        return (
          <img
            key={img.id}
            src={img.url}
            alt={img.caption || ''}
            className="absolute border border-transparent hover:border-blue-400 cursor-pointer"
            style={{
              left: `${img.box.x || 0}%`,
              top: `${img.box.y || 0}%`,
              width: `${img.box.width || 0}%`,
              height: `${img.box.height || 0}%`
            }}
          />
        );
      })}

      {/* Tables */}
      {page.tables?.map((tbl) => {
        if (!tbl || !tbl.box) return null;
        return (
          <div
            key={tbl.id}
            className="absolute bg-white border border-slate-300 rounded overflow-hidden shadow-xs"
            style={{
              left: `${tbl.box.x || 0}%`,
              top: `${tbl.box.y || 0}%`,
              width: `${tbl.box.width || 0}%`
            }}
          >
            <table className="w-full text-sm border-collapse" style={{ fontSize: `${9 * scale}px` }}>
              <thead>
                <tr className="bg-slate-50">
                  {tbl.headers?.map((h, i) => (
                    <th
                      key={i}
                      className="border border-slate-200 p-1.5 cursor-pointer font-semibold text-slate-700 text-left hover:bg-blue-50/50"
                      onClick={() => handleCellClick(page.pageNumber, tbl.id, -1, i, true, h || '')}
                    >
                      {selectedCell?.tableId === tbl.id && selectedCell.rowIndex === -1 && selectedCell.cellIndex === i ? (
                        <input
                          ref={inputRef}
                          value={selectedCell.value}
                          onChange={handleTableInputChange}
                          onBlur={handleSaveTableEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTableEdit();
                            if (e.key === 'Escape') setSelectedCell(null);
                          }}
                          autoFocus
                          className="w-full px-1 border border-blue-500 rounded focus:outline-none"
                        />
                      ) : (h || '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tbl.rows?.map((row, rIdx) => {
                  if (!row) return null;
                  return (
                    <tr key={rIdx} className="hover:bg-slate-50/50">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="border border-slate-200 p-1.5 cursor-pointer text-slate-600 hover:bg-blue-50/50"
                          onClick={() => handleCellClick(page.pageNumber, tbl.id, rIdx, cIdx, false, cell || '')}
                        >
                          {selectedCell?.tableId === tbl.id && selectedCell.rowIndex === rIdx && selectedCell.cellIndex === cIdx ? (
                            <input
                              ref={inputRef}
                              value={selectedCell.value}
                              onChange={handleTableInputChange}
                              onBlur={handleSaveTableEdit}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTableEdit();
                                if (e.key === 'Escape') setSelectedCell(null);
                              }}
                              autoFocus
                              className="w-full px-1 border border-blue-500 rounded focus:outline-none"
                            />
                          ) : (cell || '')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};
