import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  X,
  Upload,
  Check,
  Move,
  Maximize2
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface ImagePlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onInsertImage: (pageNumber: number, imageUrl: string, caption?: string) => void;
}

export const ImagePlacementModal: React.FC<ImagePlacementModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  onInsertImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('Corporate Notary Seal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    if (selectedImage) {
      onInsertImage(currentPage, selectedImage, caption);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
        />

        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-blue-50/70">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">Add Image to Page {currentPage}</h2>
              <p className="text-[11px] text-slate-500">
                Insert PNG, JPG, or SVG corporate logo, notary seal, or diagram
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors"
            >
              <Upload className="w-8 h-8 text-blue-500 mb-2" />
              <div className="font-semibold text-slate-700">Click to upload image file</div>
              <div className="text-[10px] text-slate-400 mt-1">PNG, JPG, or SVG up to 10MB</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center justify-center max-h-48 overflow-hidden relative group">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-h-44 object-contain rounded shadow-2xs"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-medium"
                >
                  Change Image
                </button>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image Caption / Tag:</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedImage}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" /> Place on Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
