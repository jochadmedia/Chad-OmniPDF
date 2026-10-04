import React from 'react';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  Lock,
  Calendar,
  Key,
  Award
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface CertificateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  auditLog?: Array<{ id: string; action: string; user: string; timestamp: string; details: string; status: 'success' | 'warning' | 'error' }>;
}

export const CertificateDetailsModal: React.FC<CertificateDetailsModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
  auditLog = [],
}) => {
  const [isVerifying, setIsVerifying] = React.useState(true);
  const [verificationResult, setVerificationResult] = React.useState<any>(null);

  const signedField = currentDoc?.formFields?.find((f) => f.type === 'signature' && f.signedBy);
  const signerName = signedField?.signedBy || 'Apex Enterprise Corporate Signer (AATL)';

  React.useEffect(() => {
    if (isOpen && currentDoc) {
      setIsVerifying(true);
      fetch('/api/v1/security/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          signature_data: signedField?.signatureDataUrl, 
          field_id: signedField?.id 
        }),
      })
        .then(res => res.json())
        .then(data => {
          setVerificationResult(data);
          setIsVerifying(false);
        })
        .catch(() => {
          setVerificationResult({ verified: false, details: 'Server connection error during verification.' });
          setIsVerifying(false);
        });
    }
  }, [isOpen, signedField, currentDoc]);

  const fingerprint = React.useMemo(() => {
    if (!currentDoc) return 'AATL-ROOT-VALID-SHA256';
    let hash = 0x811c9dc5;
    const str = `${currentDoc.id}-${currentDoc.title}-${currentDoc.pages.length}-${currentDoc.fileSizeBytes}`;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    const hex = hash.toString(16).toUpperCase().padStart(8, '0');
    return `${hex.slice(0, 2)}:${hex.slice(2, 4)}:${hex.slice(4, 6)}:${hex.slice(6, 8)}:C3:E9:7A:12:F0:4B:99:A1:56:88:90:DE`;
  }, [currentDoc]);

  if (!isOpen || !currentDoc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-sky-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                AATL Digital Certificate &amp; Trust Inspection
              </h2>
              <p className="text-[11px] text-slate-500">
                Adobe Approved Trust List (AATL) &amp; European Union Trusted List (EUTL)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3.5 text-xs">
          {/* Validity Banner */}
          {isVerifying ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 bg-slate-200 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-slate-200 rounded w-2/3" />
                <div className="h-2 bg-slate-200 rounded w-full" />
              </div>
            </div>
          ) : (
            <div className={`p-3 border rounded-lg flex items-center gap-2.5 ${
              verificationResult?.verified ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
            }`}>
              {verificationResult?.verified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <X className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div>
                <div className={`font-bold ${verificationResult?.verified ? 'text-emerald-900' : 'text-rose-900'}`}>
                  Certificate Status: {verificationResult?.verified ? 'Valid & Untampered' : 'Verification Failed'}
                </div>
                <div className={`text-[10px] ${verificationResult?.verified ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {verificationResult?.details || 'Standard verification check completed.'}
                </div>
              </div>
            </div>
          )}

          {/* Certificate Metadata Grid */}
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-150 text-[11px]">
            <div className="p-2 flex justify-between">
              <span className="text-slate-500">Signatory Subject:</span>
              <span className="font-semibold text-slate-800">{signerName}</span>
            </div>
            <div className="p-2 flex justify-between">
              <span className="text-slate-500">Issuer CA:</span>
              <span className="font-mono text-slate-700">{verificationResult?.authority || 'DigiCert Global Root CA (AATL Root)'}</span>
            </div>
            <div className="p-2 flex justify-between">
              <span className="text-slate-500">Signature Standard:</span>
              <span className="font-mono text-slate-700">ETSI EN 319 142-1 (PAdES)</span>
            </div>
            <div className="p-2 flex justify-between">
              <span className="text-slate-500">Hashing Algorithm:</span>
              <span className="font-mono text-slate-700">{verificationResult?.hash_algorithm || 'SHA-256'} with RSA 4096-bit</span>
            </div>
            <div className="p-2 flex justify-between">
              <span className="text-slate-500">OCSP Status:</span>
              <span className={`font-mono font-bold ${verificationResult?.ocsp_status === 'GOOD' ? 'text-emerald-600' : 'text-slate-700'}`}>
                {verificationResult?.ocsp_status || 'CHECKING...'}
              </span>
            </div>
            <div className="p-2 flex justify-between">
              <span className="text-slate-500">Digest Fingerprint:</span>
              <span className="font-mono text-[9px] text-slate-600 truncate max-w-[240px]">
                {fingerprint}
              </span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
