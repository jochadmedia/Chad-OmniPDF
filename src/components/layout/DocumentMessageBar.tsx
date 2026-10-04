import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  FileSignature,
  FileCheck,
  CheckCircle2,
  Lock,
  X,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface DocumentMessageBarProps {
  currentDoc: PdfDocument;
  highlightFields: boolean;
  onToggleHighlightFields: () => void;
  onVerifySignatures: () => void;
  onOpenSecurityDetails: () => void;
}

export const DocumentMessageBar: React.FC<DocumentMessageBarProps> = ({
  currentDoc,
  highlightFields,
  onToggleHighlightFields,
  onVerifySignatures,
  onOpenSecurityDetails,
}) => {
  if (!currentDoc) return null;

  // Determine banner mode:
  // Purple: Form fillable
  // Blue: Certified PDF (AATL)
  // Yellow: Sensitive / Review document
  // Green: Protected View Sandboxed

  if (currentDoc.formStatus === 'fillable' && currentDoc.formFields.length > 0) {
    return (
      <div className="bg-[#6b21a8] text-white px-3 py-1.5 text-xs flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-2">
          <FileSignature className="w-4 h-4 text-purple-200 shrink-0" />
          <span className="font-medium">
            Please fill out the following form. You can edit interactive fields and sign before saving or exporting.
          </span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onToggleHighlightFields}
            className={`px-2 py-0.5 rounded text-[11px] font-medium border border-purple-300 transition-colors ${
              highlightFields
                ? 'bg-purple-800 text-white'
                : 'bg-purple-700/60 hover:bg-purple-700 text-purple-100'
            }`}
          >
            {highlightFields ? 'Hide Existing Fields' : 'Highlight Existing Fields'}
          </button>
          <button
            onClick={onVerifySignatures}
            className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-purple-900 hover:bg-purple-50 transition-colors"
          >
            Signature Panel
          </button>
        </div>
      </div>
    );
  }

  if (currentDoc.isCertified) {
    return (
      <div className="bg-[#0369a1] text-white px-3 py-1.5 text-xs flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-200 shrink-0" />
          <span>
            <strong className="font-semibold">Certified by Adobe AATL:</strong> {currentDoc.certificationAuthority || 'Valid tamper-evident digital seal conforming to PAdES specifications.'}
          </span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onVerifySignatures}
            className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-sky-900 hover:bg-sky-50 transition-colors"
          >
            Signature Properties
          </button>
        </div>
      </div>
    );
  }

  if (currentDoc.sensitivityLabel === 'Highly Confidential (MIP)' || currentDoc.isEncrypted) {
    return (
      <div className="bg-[#92400e] text-white px-3 py-1.5 text-xs flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-200 shrink-0" />
          <span>
            <strong className="font-semibold">Microsoft Purview MIP Protected:</strong> {currentDoc.sensitivityLabel} - Access is audited under tenant compliance policy.
          </span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenSecurityDetails}
            className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/80 hover:bg-amber-950 text-amber-100 transition-colors"
          >
            Inspect Permissions
          </button>
        </div>
      </div>
    );
  }

  // Default: Protected Mode AppContainer Active
  return (
    <div className="bg-[#0f766e] text-white px-3 py-1 text-[11px] flex items-center justify-between shadow-xs select-none">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-200 shrink-0" />
        <span>
          <strong className="font-medium">Protected View Active:</strong> Untrusted PDF execution isolated within secure OS AppContainer sandbox.
        </span>
      </div>
      <div className="text-[10px] text-teal-200">
        AES-256 Verified
      </div>
    </div>
  );
};
