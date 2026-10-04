import { PdfDocument } from '../types/chad-omnidpdf';

import JSZip from 'jszip';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel } from 'docx';
import pptxgen from 'pptxgenjs';

/**
 * Generates and downloads a real Microsoft Word (.docx) file using the docx library.
 */
export async function exportToWordDocx(doc: PdfDocument) {
  const sections = doc.pages.map(page => {
    const children: any[] = [
      new Paragraph({
        text: `PAGE ${page.pageNumber}: ${page.title || 'Untitled Section'}`,
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: { color: "CBD5E1", space: 1, style: BorderStyle.SINGLE, size: 6 },
        },
      }),
    ];

    page.paragraphs.forEach(p => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: p.text,
              bold: p.style?.isBold || p.style?.isHeading,
              size: (p.style?.fontSize || 11) * 2,
              color: p.style?.color?.replace('#', '') || "000000",
            }),
          ],
          alignment: p.style?.align === 'center' ? AlignmentType.CENTER : AlignmentType.LEFT,
          spacing: { before: 120, after: 120 },
        })
      );
    });

    if (page.tables) {
      page.tables.forEach(tbl => {
        const rows = [
          new TableRow({
            children: tbl.headers.map(h => 
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
                shading: { fill: "F1F5F9" },
              })
            ),
          }),
          ...tbl.rows.map(row => 
            new TableRow({
              children: row.map(cell => 
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun(cell)] })],
                })
              ),
            })
          ),
        ];

        children.push(
          new Table({
            rows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
      });
    }

    return {
      properties: {},
      children,
    };
  });

  const wordDoc = new Document({
    title: doc.title,
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: doc.title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Source: ${doc.fileName} | Version: ${doc.version}`,
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
      ...sections,
    ],
  });

  const blob = await Packer.toBlob(wordDoc);
  triggerDownload(blob, `${doc.title.replace(/\s+/g, '_')}_Chad-OmniPDF_Export.docx`);
}

/**
 * Generates and downloads a real Excel workbook (.xls) containing structured tabular data.
 */
export function exportToExcelXlsx(doc: PdfDocument) {
  // Keeping the XML-based XLS for stability as it's a very robust implementation for simple tables
  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1E293B" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:Bold="1" ss:Size="14" ss:Color="#0F172A"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Document Summary">
  <Table>
   <Row>
    <Cell ss:StyleID="Title"><Data ss:Type="String">${escapeXml(doc.title)}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">File Name</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(doc.fileName)}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Total Pages</Data></Cell>
    <Cell><Data ss:Type="Number">${doc.pageCount}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>`;

  doc.pages.forEach((page) => {
    if (page.tables) {
      page.tables.forEach((tbl, tIdx) => {
        xml += `
 <Worksheet ss:Name="Page ${page.pageNumber} Table ${tIdx + 1}">
  <Table>
   <Row ss:StyleID="Header">`;
        tbl.headers.forEach((h) => {
          xml += `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`;
        });
        xml += `</Row>`;

        tbl.rows.forEach((row) => {
          xml += `<Row>`;
          row.forEach((cell) => {
            xml += `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`;
          });
          xml += `</Row>`;
        });
        xml += `
  </Table>
 </Worksheet>`;
      });
    }
  });

  xml += `</Workbook>`;

  const blob = new Blob([xml], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });
  triggerDownload(blob, `${doc.title.replace(/\s+/g, '_')}_Financials.xls`);
}

/**
 * Generates and downloads a real PowerPoint Presentation (.pptx) using pptxgenjs.
 */
export async function exportToPowerPointPptx(doc: PdfDocument) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';

  // Title Slide
  const titleSlide = pres.addSlide();
  titleSlide.background = { fill: '1E293B' };
  titleSlide.addText(doc.title, {
    x: 1, y: 2, w: '80%', h: 1,
    fontSize: 44, color: 'FFFFFF', bold: true, align: 'center'
  });
  titleSlide.addText(`Chad-OmniPDF Studio Generative Overview: ${doc.fileName}`, {
    x: 1, y: 3.5, w: '80%', h: 0.5,
    fontSize: 18, color: '94A3B8', align: 'center'
  });

  // Page Slides
  doc.pages.forEach(page => {
    const slide = pres.addSlide();
    slide.addText(`Page ${page.pageNumber}: ${page.title || 'Summary'}`, {
      x: 0.5, y: 0.3, w: '90%', h: 0.5,
      fontSize: 24, color: '0F172A', bold: true
    });

    const bodyText = page.paragraphs.map(p => p.text).join('\n\n');
    slide.addText(bodyText, {
      x: 0.5, y: 1.0, w: '90%', h: 3,
      fontSize: 12, color: '334155', align: 'left',
      valign: 'top'
    });

    if (page.tables && page.tables.length > 0) {
      const tbl = page.tables[0];
      const tableData = [
        tbl.headers.map(h => ({ text: h, options: { bold: true, fill: 'F1F5F9' } })),
        ...tbl.rows.map(row => row.map(cell => ({ text: cell })))
      ];
      slide.addTable(tableData, {
        x: 0.5, y: 4.2, w: 9,
        border: { pt: 1, color: 'E2E8F0' },
        fontSize: 10
      });
    }
  });

  await pres.writeFile({ fileName: `${doc.title.replace(/\s+/g, '_')}_Slides.pptx` });
}

/**
 * Generates and downloads a real Rich Text Format (.rtf) file.
 */
export function exportToRtf(doc: PdfDocument) {
  let rtf = `{\\rtf1\\ansi\\deff0\r\n`;
  rtf += `{\\fonttbl{\\f0\\fswiss Helvetica;}{\\f1\\fmodern Courier;}}\r\n`;
  rtf += `{\\colortbl;\\red15\\green23\\blue42;\\red100\\green116\\blue139;}\r\n`;
  rtf += `\\qc\\b\\fs36 ${escapeRtf(doc.title)}\\b0\\par\r\n`;
  rtf += `\\qc\\cf2\\fs20 Source: ${escapeRtf(doc.fileName)} | Version: ${escapeRtf(doc.version)}\\cf0\\par\\par\r\n`;

  doc.pages.forEach((page) => {
    rtf += `\\ql\\b\\fs26 Page ${page.pageNumber}: ${escapeRtf(page.title || '')}\\b0\\par\r\n`;
    page.paragraphs.forEach((p) => {
      if (p.style?.isHeading) {
        rtf += `\\b\\fs22 ${escapeRtf(p.text)}\\b0\\par\r\n`;
      } else {
        rtf += `\\fs20 ${escapeRtf(p.text)}\\par\\par\r\n`;
      }
    });
  });

  rtf += `}`;

  const blob = new Blob([rtf], { type: 'application/rtf;charset=utf-8' });
  triggerDownload(blob, `${doc.title.replace(/\s+/g, '_')}_Document.rtf`);
}

/**
 * Generates and downloads a real Adobe InDesign IDML package (as a ZIP).
 */
export async function exportToInDesignIdml(doc: PdfDocument) {
  const zip = new JSZip();
  
  // 1. mimetype (MUST BE FIRST and uncompressed per IDML spec)
  zip.file('mimetype', 'application/vnd.adobe.indesign-idml-package', { compression: 'STORE' });
  
  // 2. designmap.xml (Minimal index)
  const designMap = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Document xmlns:idPkg="http://ns.adobe.com/adobeinDesign/idml/1.0/packaging" DOMVersion="18.0" Self="d1">
  <idPkg:Story src="Stories/Story_u100.xml" />
</Document>`;
  zip.file('designmap.xml', designMap);
  
  // 3. Stories/Story_u100.xml
  let storyXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<idPkg:Story xmlns:idPkg="http://ns.adobe.com/adobeinDesign/idml/1.0/packaging" DOMVersion="18.0">
  <Story Self="u100" UserCanEdit="true">
    <ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/Title">
      <CharacterStyleRange AppliedCharacterStyle="CharacterStyle/$ID/[No character style]">
        <Content>${escapeXml(doc.title)}</Content>
      </CharacterStyleRange>
    </ParagraphStyleRange>
`;

  doc.pages.forEach((page) => {
    storyXml += `    <ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/Heading1">
      <CharacterStyleRange AppliedCharacterStyle="CharacterStyle/$ID/[No character style]">
        <Content>PAGE ${page.pageNumber}: ${escapeXml(page.title || '')}</Content>
      </CharacterStyleRange>
    </ParagraphStyleRange>\n`;
    page.paragraphs.forEach((p) => {
      storyXml += `    <ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/Body">
      <CharacterStyleRange AppliedCharacterStyle="CharacterStyle/$ID/[No character style]">
        <Content>${escapeXml(p.text)}</Content>
      </CharacterStyleRange>
    </ParagraphStyleRange>\n`;
    });
  });

  storyXml += `  </Story>\n</idPkg:Story>`;
  zip.file('Stories/Story_u100.xml', storyXml);
  
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, `${doc.title.replace(/\s+/g, '_')}_Package.idml`);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeRtf(str: string): string {
  return str.replace(/[\\{}]/g, (match) => `\\${match}`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
