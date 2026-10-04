import * as pdfjsLib from 'pdfjs-dist';
import { PdfDocument, PdfPage, FormField, DocumentBookmark } from '../types/chad-omnidpdf';

// Initialize PDF.js worker using local bundled asset for Point 5 compliance (Offline/Secure environments)
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

/**
 * Parses an authentic PDF binary and renders all pages to high-DPI canvas
 * while extracting real text streams, bounding coordinates, and form fields.
 */
export async function parseAndRenderPdfFile(file: File): Promise<PdfDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const pages: PdfPage[] = [];
  const formFields: FormField[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    // 1.5x scale provides crisp high-DPI display on retina screens
    const viewport = page.getViewport({ scale: 1.5 });

    // 1. Render actual page graphics, typography, diagrams & stamps onto offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      await page.render({ canvasContext: ctx, viewport }).promise;
    }
    const bgDataUrl = canvas.toDataURL('image/png');

    // 2. Extract authentic text content
    const textContent = await page.getTextContent();
    const items = textContent.items as Array<{
      str: string;
      transform: number[];
      width: number;
      height: number;
    }>;

    const rawLines: { y: number; text: string; x: number; width: number; height: number }[] = [];
    const filteredItems = items.filter((it) => it.str && it.str.trim().length > 0);

    let currentY: number | null = null;
    let currentLine = '';
    let startX = 0;
    let totalWidth = 0;
    let maxHeight = 10;

    for (const item of filteredItems) {
      const itemY = Math.round(item.transform[5]);
      const itemX = item.transform[4];

      if (currentY === null || Math.abs(currentY - itemY) > 8) {
        if (currentLine.trim()) {
          rawLines.push({
            y: currentY ?? 0,
            text: currentLine.trim(),
            x: startX,
            width: totalWidth,
            height: maxHeight,
          });
        }
        currentY = itemY;
        currentLine = item.str;
        startX = itemX;
        totalWidth = item.width;
        maxHeight = Math.max(10, item.height || 10);
      } else {
        currentLine += ' ' + item.str;
        totalWidth += item.width + 4;
        maxHeight = Math.max(maxHeight, item.height || 10);
      }
    }

    if (currentLine.trim()) {
      rawLines.push({
        y: currentY ?? 0,
        text: currentLine.trim(),
        x: startX,
        width: totalWidth,
        height: maxHeight,
      });
    }

    // Convert lines into editable paragraphs with percentage bounding boxes
    const paragraphs = rawLines.map((line, idx) => {
      // In PDF coordinate space, (0,0) is bottom-left. Convert to top-left percentage.
      const percentY = Math.max(2, Math.min(95, 100 - (line.y / viewport.height) * 100));
      const percentX = Math.max(2, Math.min(90, (line.x / viewport.width) * 100));
      const isHeading =
        line.height > 14 || (line.text.toUpperCase() === line.text && line.text.length < 60);

      return {
        id: `p-${pageNum}-${idx + 1}`,
        text: line.text,
        box: {
          x: Math.round(percentX),
          y: Math.round(percentY),
          width: Math.min(90, Math.max(20, Math.round((line.width / viewport.width) * 100))),
          height: Math.min(15, Math.max(3, Math.round((line.height / viewport.height) * 100))),
        },
        style: {
          fontSize: Math.round(line.height) || 11,
          isBold: isHeading,
          isHeading,
          color: '#0f172a',
          align: 'left' as const,
        },
      };
    });

    if (paragraphs.length === 0) {
      paragraphs.push({
        id: `p-${pageNum}-scanned`,
        text: `[Page ${pageNum}: Scanned Visual Content - Use OCR in Pro tools to generate text layer]`,
        box: { x: 5, y: 5, width: 90, height: 4 },
        style: { fontSize: 10, isBold: false, isHeading: false, color: '#64748b', align: 'left' as const },
      });
    }

    // Extract native form annotations if present
    try {
      const annotations = await page.getAnnotations();
      annotations.forEach((annot: any, aIdx: number) => {
        if (annot.subtype === 'Widget' && annot.fieldName) {
          const rect = annot.rect;
          if (rect && rect.length === 4) {
            const x = Math.max(0, (rect[0] / viewport.width) * 100);
            const y = Math.max(0, 100 - (rect[3] / viewport.height) * 100);
            const w = Math.max(5, ((rect[2] - rect[0]) / viewport.width) * 100);
            const h = Math.max(2, ((rect[3] - rect[1]) / viewport.height) * 100);

            const isSig =
              annot.fieldType === 'Sig' || annot.fieldName.toLowerCase().includes('sign');
            formFields.push({
              id: `field-${pageNum}-${aIdx}`,
              pageNumber: pageNum,
              name: annot.fieldName || `Field ${aIdx + 1}`,
              type: isSig ? 'signature' : annot.fieldType === 'Btn' ? 'checkbox' : 'text',
              box: { x: Math.round(x), y: Math.round(y), width: Math.round(w), height: Math.round(h) },
              value: annot.fieldValue || '',
            });
          }
        }
      });
    } catch (e) {
      // Some documents do not have annotation dictionaries
    }

    pages.push({
      pageNumber: pageNum,
      rotation: 0,
      width: Math.round(viewport.width / 1.5),
      height: Math.round(viewport.height / 1.5),
      title: `Page ${pageNum}`,
      bgDataUrl,
      paragraphs,
    });
  }

  // Extract outline / bookmarks
  const bookmarks: DocumentBookmark[] = [];
  try {
    const outline = await pdfDoc.getOutline();
    if (outline && outline.length > 0) {
      outline.forEach((item: any, bIdx: number) => {
        bookmarks.push({
          id: `bm-${bIdx}`,
          title: item.title,
          pageNumber: 1,
          level: 1,
        });
      });
    }
  } catch (e) {}

  if (bookmarks.length === 0) {
    bookmarks.push({
      id: 'bm-root',
      title: '1. Document Root',
      pageNumber: 1,
      level: 1,
    });
  }

  return {
    id: `upload-${Date.now()}`,
    title: file.name.replace(/\.pdf$/i, ''),
    fileName: file.name,
    fileSizeBytes: file.size,
    pageCount: numPages,
    version: '1.7',
    isEncrypted: false,
    isCertified: false,
    formStatus: formFields.length > 0 ? 'fillable' : 'none',
    watermark: '',
    layers: [
      { id: 'l1', name: 'Document Content & Graphics', visible: true },
      { id: 'l2', name: 'Annotations & Signatures', visible: true },
    ],
    attachments: [],
    bookmarks,
    annotations: [],
    formFields,
    pages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
