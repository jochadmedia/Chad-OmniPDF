import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { PdfDocument } from '../types/chad-omnidpdf';

export async function exportDocumentToPdfBlob(doc: PdfDocument): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 0; i < doc.pages.length; i++) {
    const pageData = doc.pages[i];
    const page = pdfDoc.addPage([pageData.width, pageData.height]);
    
    if (pageData.rotation) {
      page.setRotation(degrees(pageData.rotation));
    }

    const { width, height } = page.getSize();

    // 1. Embed authentic page background bitmap if present (from imported PDF/scan)
    if (pageData.bgDataUrl) {
      try {
        const isPng = pageData.bgDataUrl.startsWith('data:image/png');
        const imgBytes = Buffer.from(pageData.bgDataUrl.split(',')[1], 'base64');
        const embeddedImg = isPng
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);
        page.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width,
          height,
        });
      } catch (err) {
        console.warn('Failed to embed page background image in PDF export:', err);
      }
    }

    // 2. Embed user-placed images if present
    if (pageData.images) {
      for (const img of pageData.images) {
        if (img.url) {
          try {
            const isPng = img.url.startsWith('data:image/png');
            const imgBytes = Buffer.from(img.url.split(',')[1], 'base64');
            const embeddedImg = isPng
              ? await pdfDoc.embedPng(imgBytes)
              : await pdfDoc.embedJpg(imgBytes);
            const ix = (img.box.x / 100) * width;
            const iy = height - ((img.box.y / 100) * height) - ((img.box.height / 100) * height);
            const iw = (img.box.width / 100) * width;
            const ih = (img.box.height / 100) * height;
            page.drawImage(embeddedImg, {
              x: ix,
              y: iy,
              width: iw,
              height: ih,
            });
          } catch (e) {
            console.warn('Could not embed placed image:', e);
          }
        }
      }
    }

    // Render Watermark if present
    if (doc.watermark) {
      page.drawText(doc.watermark, {
        x: width / 4,
        y: height / 2,
        size: 48,
        font: helveticaBold,
        color: rgb(0.85, 0.85, 0.85),
        rotate: degrees(45),
      });
    }

    // Render Bates Numbering if present
    if (doc.batesPrefix && doc.batesStartNumber !== undefined) {
      const batesNum = `${doc.batesPrefix}${String(doc.batesStartNumber + i).padStart(6, '0')}`;
      page.drawText(batesNum, {
        x: width - 180,
        y: 20,
        size: 9,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    // Render Paragraphs
    for (const p of pageData.paragraphs) {
      const fontSize = p.style?.fontSize ? Math.max(8, p.style.fontSize) : 10;
      const isBold = p.style?.isBold;
      const font = isBold ? helveticaBold : helvetica;
      
      const x = (p.box.x / 100) * width;
      const y = height - ((p.box.y / 100) * height) - fontSize;

      // Wrap text simply for PDF export
      const maxWidth = (p.box.width / 100) * width;
      const words = p.text.split(' ');
      let currentLine = '';
      let lineY = y;

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && currentLine) {
          page.drawText(currentLine, {
            x,
            y: lineY,
            size: fontSize,
            font,
            color: p.style?.color === '#b91c1c' ? rgb(0.7, 0.1, 0.1) : rgb(0.1, 0.15, 0.2),
          });
          currentLine = word;
          lineY -= fontSize * 1.25;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        page.drawText(currentLine, {
          x,
          y: lineY,
          size: fontSize,
          font,
          color: p.style?.color === '#b91c1c' ? rgb(0.7, 0.1, 0.1) : rgb(0.1, 0.15, 0.2),
        });
      }
    }

    // Render Tables if present
    if (pageData.tables) {
      for (const tbl of pageData.tables) {
        let tblY = height - ((tbl.box.y / 100) * height);
        const colWidth = ((tbl.box.width / 100) * width) / tbl.headers.length;
        const startX = (tbl.box.x / 100) * width;

        // Draw headers
        tbl.headers.forEach((h, colIdx) => {
          page.drawText(h, {
            x: startX + colIdx * colWidth,
            y: tblY,
            size: 9,
            font: helveticaBold,
            color: rgb(0.1, 0.1, 0.1),
          });
        });
        tblY -= 14;

        // Draw rows
        for (const row of tbl.rows) {
          row.forEach((cell, colIdx) => {
            page.drawText(cell, {
              x: startX + colIdx * colWidth,
              y: tblY,
              size: 8.5,
              font: helvetica,
              color: rgb(0.2, 0.2, 0.2),
            });
          });
          tblY -= 12;
        }
      }
    }

    // Render Redactions (physical black purge rectangles)
    const redactions = doc.annotations.filter(
      (a) => a.pageNumber === pageData.pageNumber && a.type === 'redaction'
    );
    for (const r of redactions) {
      const rx = (r.box.x / 100) * width;
      const ry = height - ((r.box.y / 100) * height) - ((r.box.height / 100) * height);
      const rw = (r.box.width / 100) * width;
      const rh = (r.box.height / 100) * height;

      page.drawRectangle({
        x: rx,
        y: ry,
        width: rw,
        height: rh,
        color: rgb(0, 0, 0),
      });

      page.drawText('REDACTED', {
        x: rx + 4,
        y: ry + (rh / 2) - 4,
        size: 7,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
    }

    // Render Stamps or Notes
    const stamps = doc.annotations.filter(
      (a) => a.pageNumber === pageData.pageNumber && a.type === 'stamp'
    );
    for (const s of stamps) {
      const sx = (s.box.x / 100) * width;
      const sy = height - ((s.box.y / 100) * height);
      page.drawText(`[STAMP: ${s.content || 'APPROVED'}]`, {
        x: sx,
        y: sy,
        size: 14,
        font: helveticaBold,
        color: rgb(0.8, 0.1, 0.1),
      });
    }

    // Render Text Boxes
    const textBoxes = doc.annotations.filter(
      (a) => a.pageNumber === pageData.pageNumber && a.type === 'text_box'
    );
    for (const tb of textBoxes) {
      if (tb.content) {
        const tbx = (tb.box.x / 100) * width;
        const tby = height - ((tb.box.y / 100) * height) - 12;
        page.drawText(tb.content, {
          x: tbx,
          y: tby,
          size: 10,
          font: helvetica,
          color: rgb(0.1, 0.2, 0.6),
        });
      }
    }

    // Render Freehand Drawings
    const drawings = doc.annotations.filter(
      (a) => a.pageNumber === pageData.pageNumber && a.type === 'drawing' && a.points && a.points.length > 1
    );
    for (const drw of drawings) {
      const pts = drw.points!;
      for (let pIdx = 0; pIdx < pts.length - 1; pIdx++) {
        const p1 = pts[pIdx];
        const p2 = pts[pIdx + 1];
        page.drawLine({
          start: { x: (p1.x / 100) * width, y: height - (p1.y / 100) * height },
          end: { x: (p2.x / 100) * width, y: height - (p2.y / 100) * height },
          thickness: 1.5,
          color: rgb(0.15, 0.38, 0.92),
        });
      }
    }

    // Render Form Fields & Signatures
    const pageFields = doc.formFields.filter((f) => f.pageNumber === pageData.pageNumber);
    for (const f of pageFields) {
      const fx = (f.box.x / 100) * width;
      const fy = height - ((f.box.y / 100) * height) - ((f.box.height / 100) * height);
      const fw = (f.box.width / 100) * width;
      const fh = (f.box.height / 100) * height;

      if (f.type === 'signature' && f.signatureDataUrl) {
        try {
          const imgBytes = Buffer.from(f.signatureDataUrl.split(',')[1], 'base64');
          const sigImg = await pdfDoc.embedPng(imgBytes);
          page.drawImage(sigImg, {
            x: fx,
            y: fy,
            width: fw,
            height: fh,
          });
        } catch {}
      } else if (f.value) {
        page.drawText(String(f.value), {
          x: fx + 2,
          y: fy + fh / 2 - 4,
          size: 9,
          font: helvetica,
          color: rgb(0.1, 0.1, 0.1),
        });
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function downloadPdfDocument(doc: PdfDocument) {
  const blob = await exportDocumentToPdfBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = doc.fileName || `${doc.title.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
