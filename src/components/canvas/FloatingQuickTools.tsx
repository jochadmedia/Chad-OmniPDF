import React, { useState } from 'react';
import {
  MousePointer,
  Hand,
  Highlighter,
  Underline,
  Strikethrough,
  MessageSquare,
  Type,
  Pencil,
  Stamp,
  Eraser,
  Ruler,
  ShieldAlert,
  GripHorizontal,
  Pin,
  PinOff,
  ChevronDown
} from 'lucide-react';
import { QuickToolMode } from '../../types/chad-omnidpdf';

interface FloatingQuickToolsProps {
  currentMode: QuickToolMode;
  onSelectMode: (mode: QuickToolMode) => void;
  activeColor: string;
  onChangeColor: (color: string) => void;
  onApplyStamp: (stampText: string) => void;
}

export const FloatingQuickTools: React.FC<FloatingQuickToolsProps> = ({
  currentMode,
  onSelectMode,
  activeColor,
  onChangeColor,
  onApplyStamp,
}) => {
  const [position, setPosition] = useState({ 
    x: window.innerWidth < 768 ? 20 : 280, 
    y: window.innerWidth < 768 ? window.innerHeight - 180 : 70 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPinned, setIsPinned] = useState(false);
  const [stampMenuOpen, setStampMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const colors = [
    { name: 'Yellow', hex: '#fef08a' },
    { name: 'Green', hex: '#bbf7d0' },
    { name: 'Blue', hex: '#bae6fd' },
    { name: 'Pink', hex: '#fbcfe8' },
    { name: 'Red', hex: '#fecaca' },
  ];

  const stamps = ['APPROVED', 'CONFIDENTIAL', 'DRAFT', 'REVIEWED', 'FINAL SIGNED'];

  const handleDragStart = (clientX: number, clientY: number) => {
    if (isPinned) return;
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || isPinned) return;
    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 60, clientX - dragStart.x)),
      y: Math.max(10, Math.min(window.innerHeight - 60, clientY - dragStart.y)),
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX, e.clientY);
  const handleMouseUp = () => handleDragEnd();

  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchEnd = () => handleDragEnd();

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed z-40 bg-white/95 backdrop-blur-md border border-slate-300 shadow-xl rounded-xl p-1 flex md:flex-row flex-col items-center space-y-1 md:space-y-0 md:space-x-1 select-none transition-shadow hover:shadow-2xl max-h-[80vh] overflow-y-auto md:overflow-visible no-scrollbar"
    >
      {/* Drag Grip Handle */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`px-1.5 py-2 md:py-2 md:px-1.5 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing flex items-center justify-center ${
          isPinned ? 'cursor-not-allowed opacity-40' : ''
        }`}
        title={isPinned ? 'Widget Pinned' : 'Drag Quick Tools Widget'}
      >
        <GripHorizontal className="w-3.5 h-3.5 md:rotate-0 rotate-90" />
      </div>

      {/* Select (Cursor) */}
      <button
        onClick={() => onSelectMode('select')}
        className={`p-1.5 rounded-lg transition-colors ${
          currentMode === 'select' ? 'bg-red-50 text-red-600 font-semibold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
        }`}
        title="Select Tool (V)"
      >
        <MousePointer className="w-4 h-4" />
      </button>
      
      {/* Hand / Pan */}
      <button
        onClick={() => onSelectMode('hand')}
        className={`p-1.5 rounded-lg transition-colors ${
          currentMode === 'hand' ? 'bg-red-50 text-red-600 font-semibold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
        }`}
        title="Hand / Pan Tool (H)"
      >
        <Hand className="w-4 h-4" />
      </button>

      {/* Mobile Expand Toggle */}
      <button
        onClick={() => setMobileExpanded(!mobileExpanded)}
        className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-transform"
        style={{ transform: mobileExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      <div className={`md:flex items-center space-y-1 md:space-y-0 md:space-x-1 ${mobileExpanded ? 'flex flex-col' : 'hidden'}`}>
        <div className="md:w-px md:h-5 w-5 h-px bg-slate-200" />

        {/* Highlighter & Color Selector */}
        <div className="relative flex items-center">
          <button
            onClick={() => onSelectMode('highlight')}
            className={`p-1.5 rounded-l-lg transition-colors flex items-center gap-0.5 ${
              currentMode === 'highlight' ? 'bg-amber-100 text-amber-900 font-semibold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="Highlight Text (U)"
          >
            <Highlighter className="w-4 h-4 text-amber-500" />
          </button>
          <button
            onClick={() => setColorMenuOpen(!colorMenuOpen)}
            className="p-1 rounded-r-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 border-l border-slate-200"
            title="Change Highlight Color"
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-slate-400"
              style={{ backgroundColor: activeColor }}
            />
          </button>

          {colorMenuOpen && (
            <div className="absolute md:left-0 left-10 top-0 md:top-9 bg-white rounded-lg shadow-xl border border-slate-200 p-1.5 z-50 flex items-center gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    onChangeColor(c.hex);
                    setColorMenuOpen(false);
                  }}
                  className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 ${
                    activeColor === c.hex ? 'ring-2 ring-blue-600 scale-110 border-slate-400' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sticky Note */}
        <button
          onClick={() => onSelectMode('note')}
          className={`p-1.5 rounded-lg transition-colors ${
            currentMode === 'note' ? 'bg-amber-100 text-amber-900 font-semibold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Add Sticky Note (N)"
        >
          <MessageSquare className="w-4 h-4 text-amber-500" />
        </button>

        {/* Text Box */}
        <button
          onClick={() => onSelectMode('textbox')}
          className={`p-1.5 rounded-lg transition-colors ${
            currentMode === 'textbox' ? 'bg-blue-100 text-blue-900 font-semibold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Insert Text Box (T)"
        >
          <Type className="w-4 h-4 text-blue-600" />
        </button>

        {/* Freehand Drawing Pencil */}
        <button
          onClick={() => onSelectMode('pencil')}
          className={`p-1.5 rounded-lg transition-colors ${
            currentMode === 'pencil' ? 'bg-indigo-100 text-indigo-900 font-semibold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Freehand Pencil (D)"
        >
          <Pencil className="w-4 h-4 text-indigo-600" />
        </button>

        {/* Stamp Selector */}
        <div className="relative">
          <button
            onClick={() => setStampMenuOpen(!stampMenuOpen)}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-0.5"
            title="Stamps (Approved, Confidential, etc.)"
          >
            <Stamp className="w-4 h-4 text-red-600" />
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>

          {stampMenuOpen && (
            <div className="absolute md:left-0 left-10 top-0 md:top-9 bg-white rounded-lg shadow-xl border border-slate-200 py-1 w-36 z-50 text-xs">
              {stamps.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onApplyStamp(s);
                    setStampMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-slate-700 hover:text-red-700 font-semibold"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Redact Box Marker Shortcut */}
        <button
          onClick={() => onSelectMode('redact')}
          className={`p-1.5 rounded-lg transition-colors ${
            currentMode === 'redact' ? 'bg-black text-white font-semibold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Mark Area for Redaction"
        >
          <ShieldAlert className="w-4 h-4 text-red-600" />
        </button>

        {/* Measure Ruler Tool */}
        <button
          onClick={() => onSelectMode('measure')}
          className={`p-1.5 rounded-lg transition-colors ${
            currentMode === 'measure' ? 'bg-blue-100 text-blue-900 font-semibold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Measure Tool (Distance & Area Caliper)"
        >
          <Ruler className="w-4 h-4 text-slate-700" />
        </button>

        {/* Eraser */}
        <button
          onClick={() => onSelectMode('eraser')}
          className={`p-1.5 rounded-lg transition-colors ${
            currentMode === 'eraser' ? 'bg-rose-100 text-rose-900 font-semibold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Eraser (E)"
        >
          <Eraser className="w-4 h-4 text-rose-500" />
        </button>

        <div className="md:w-px md:h-5 w-5 h-px bg-slate-200" />

        {/* Pin / Unpin */}
        <button
          onClick={() => setIsPinned(!isPinned)}
          className={`p-1.5 rounded-lg transition-colors ${
            isPinned ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={isPinned ? 'Unpin Widget' : 'Pin Widget'}
        >
          {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
