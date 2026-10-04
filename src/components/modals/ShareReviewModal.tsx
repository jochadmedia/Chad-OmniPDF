import React, { useState } from 'react';
import {
  Share2,
  X,
  Copy,
  Check,
  Globe,
  Mail,
  Lock,
  UserCheck
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface ShareReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
}

export const ShareReviewModal: React.FC<ShareReviewModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
}) => {
  const [copied, setCopied] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [allowDownload, setAllowDownload] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?docId=${currentDoc?.id || ''}`
    : `https://chad-omnidoc.app/?docId=${currentDoc?.id || ''}`;

  React.useEffect(() => {
    if (isOpen && currentDoc) {
      fetch('/api/v1/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: currentDoc.id,
          file_name: currentDoc.fileName,
          title: currentDoc.title,
          page_count: currentDoc.pageCount,
          document: currentDoc,
        }),
      }).catch(() => {});
    }
  }, [isOpen, currentDoc]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    if (currentDoc) {
      fetch('/api/v1/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: currentDoc.id,
          file_name: currentDoc.fileName,
          title: currentDoc.title,
          page_count: currentDoc.pageCount,
          document: currentDoc,
        }),
      }).catch(() => {});
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientEmail && !invitedEmails.includes(recipientEmail)) {
      setInvitedEmails([...invitedEmails, recipientEmail]);
      setRecipientEmail('');
      setInviteSent(true);
      setTimeout(() => setInviteSent(false), 3000);
    }
  };

  if (!isOpen || !currentDoc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-blue-50/70">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Share for Review (No Login Required)
              </h2>
              <p className="text-[11px] text-slate-500">
                Recipients can view and comment across desktop, tablet, and mobile browsers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          {/* Link Box */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">Public Review Link:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded font-semibold flex items-center gap-1.5 transition-colors ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Email Invite Form */}
          <form onSubmit={handleInvite} className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">Invite Reviewers by Email:</label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="colleague@organization.com"
                className="flex-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={!recipientEmail}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white rounded font-medium"
              >
                Invite
              </button>
            </div>

            {invitedEmails.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {invitedEmails.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-[10px]"
                  >
                    <Mail className="w-2.5 h-2.5" /> {email}
                  </span>
                ))}
              </div>
            )}
          </form>

          {/* Permissions Options */}
          <div className="space-y-2 pt-2 border-t border-slate-150">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Reviewer Permissions
            </div>
            <label className="flex items-center justify-between p-2 rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="font-medium text-slate-800">Allow Comments Without Login</div>
                <div className="text-[10px] text-slate-400">Guests can annotate with their name</div>
              </div>
              <input
                type="checkbox"
                checked={allowComments}
                onChange={(e) => setAllowComments(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="font-medium text-slate-800">Allow Downloading Original PDF</div>
                <div className="text-[10px] text-slate-400">Viewers can download the document bytes</div>
              </div>
              <input
                type="checkbox"
                checked={allowDownload}
                onChange={(e) => setAllowDownload(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
