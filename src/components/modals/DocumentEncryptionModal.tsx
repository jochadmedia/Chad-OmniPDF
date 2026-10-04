import React, { useState } from 'react';
import {
  Lock,
  X,
  Check,
  ShieldCheck,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface DocumentEncryptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onApplyEncryption: (password: string, permissions: { allowPrinting: boolean; allowCopying: boolean }) => void;
}

export const DocumentEncryptionModal: React.FC<DocumentEncryptionModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onApplyEncryption,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [permissions, setPermissions] = useState({
    allowPrinting: true,
    allowCopying: false,
  });

  if (!isOpen || !currentDoc) return null;

  const isMatched = password.length >= 6 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMatched) {
      onApplyEncryption(password, permissions);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-amber-50">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Password &amp; AES-256 Symmetric Encryption
              </h2>
              <p className="text-[11px] text-slate-500">
                FIPS 140-2 Level 3 compliant encryption at rest
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Document Encryption Password (min 6 characters):
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong encryption password"
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 pr-8 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Confirm Password:
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {password && confirmPassword && !isMatched && (
              <span className="text-[10px] text-red-600 mt-1 block">Passwords do not match</span>
            )}
          </div>

          {/* Granular Permissions */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Restricted Permissions
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.allowPrinting}
                onChange={(e) => setPermissions({ ...permissions, allowPrinting: e.target.checked })}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span className="text-slate-700">Allow high-resolution document printing</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.allowCopying}
                onChange={(e) => setPermissions({ ...permissions, allowCopying: e.target.checked })}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span className="text-slate-700">Allow copying text, images, and content streams</span>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isMatched}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Encrypt Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
