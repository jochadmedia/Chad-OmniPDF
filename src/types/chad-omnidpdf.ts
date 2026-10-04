export type AccountTier = 'reader' | 'standard' | 'pro' | 'studio' | 'enterprise';

export type MegaverbType =
  | 'edit'
  | 'convert'
  | 'organize'
  | 'forms'
  | 'protect'
  | 'ai'
  | 'pro'
  | 'admin';

export type RightRailTab =
  | 'bookmarks'
  | 'thumbnails'
  | 'comments'
  | 'layers'
  | 'attachments';

export type QuickToolMode =
  | 'select'
  | 'hand'
  | 'highlight'
  | 'underline'
  | 'strikethrough'
  | 'note'
  | 'textbox'
  | 'pencil'
  | 'stamp'
  | 'eraser'
  | 'measure'
  | 'redact';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
}

export interface Annotation {
  id: string;
  documentId: string;
  pageNumber: number;
  type: 'highlight' | 'underline' | 'strikethrough' | 'sticky_note' | 'text_box' | 'stamp' | 'drawing' | 'redaction';
  box: BoundingBox;
  content?: string;
  author: string;
  color: string;
  opacity?: number;
  createdAt: string;
  points?: { x: number; y: number }[]; // for freehand drawings
  resolved?: boolean;
  replies?: { id: string; author: string; text: string; date: string }[];
}

export interface FormField {
  id: string;
  pageNumber: number;
  name: string;
  type: 'text' | 'checkbox' | 'radio' | 'dropdown' | 'signature' | 'date';
  box: BoundingBox;
  value: string | boolean;
  options?: string[];
  required?: boolean;
  signedBy?: string;
  signedDate?: string;
  signatureDataUrl?: string;
}

export interface DocumentBookmark {
  id: string;
  title: string;
  pageNumber: number;
  level: number;
  children?: DocumentBookmark[];
}

export interface DocumentLayer {
  id: string;
  name: string;
  visible: boolean;
  locked?: boolean;
}

export interface DocumentAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  contentSnippet?: string;
}

export interface PdfPage {
  pageNumber: number;
  rotation: 0 | 90 | 180 | 270;
  width: number; // pt (e.g. 612 for US Letter)
  height: number; // pt (e.g. 792 for US Letter)
  title?: string;
  bgDataUrl?: string; // High-DPI rendered page background canvas for authentic imported PDFs
  paragraphs: {
    id: string;
    text: string;
    box: BoundingBox;
    style?: {
      fontSize?: number;
      isBold?: boolean;
      isHeading?: boolean;
      color?: string;
      align?: 'left' | 'center' | 'right' | 'justify';
    };
  }[];
  images?: {
    id: string;
    url: string;
    box: BoundingBox;
    caption?: string;
  }[];
  tables?: {
    id: string;
    box: BoundingBox;
    headers: string[];
    rows: string[][];
  }[];
}

export interface PdfDocument {
  id: string;
  title: string;
  fileName: string;
  fileSizeBytes: number;
  pageCount: number;
  version: string;
  isEncrypted: boolean;
  isCertified: boolean;
  certificationAuthority?: string;
  securityMessage?: string;
  formStatus?: 'fillable' | 'signed' | 'locked' | 'none';
  sensitivityLabel?: 'Public' | 'General' | 'Confidential' | 'Highly Confidential (MIP)';
  batesPrefix?: string;
  batesStartNumber?: number;
  watermark?: string;
  pages: PdfPage[];
  bookmarks: DocumentBookmark[];
  layers: DocumentLayer[];
  attachments: DocumentAttachment[];
  annotations: Annotation[];
  formFields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface Citation {
  page: number;
  passageSnippet: string;
  targetId?: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  citations?: Citation[];
  suggestedActions?: { label: string; action: () => void }[];
}

export interface PdfSpace {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  lastUpdated: string;
  documents: { id: string; name: string; size: string; pages: number }[];
  tags: string[];
}

export interface PreflightIssue {
  id: string;
  category: 'PDF/A' | 'WCAG 2.0' | 'Fonts' | 'Color' | 'Metadata';
  rule: string;
  severity: 'error' | 'warning' | 'info';
  pageNumber?: number;
  fixable: boolean;
  fixed?: boolean;
}

export interface ComparisonDiff {
  type: 'addition' | 'deletion' | 'modification' | 'formatting';
  page: number;
  description: string;
  oldText?: string;
  newText?: string;
}
