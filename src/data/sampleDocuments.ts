import { PdfDocument } from '../types/chad-omnidpdf';

export const SAMPLE_DOCUMENTS: PdfDocument[] = [
  {
    id: 'doc-msa-2026',
    title: 'Enterprise Master Services Agreement (MSA)',
    fileName: 'Enterprise_MSA_ApexGlobal_v4.2.pdf',
    fileSizeBytes: 2450890,
    pageCount: 4,
    version: '1.7 (Chad-OmniPDF 8.x)',
    isEncrypted: false,
    isCertified: true,
    certificationAuthority: 'Adobe Approved Trust List (AATL) - DigiCert Global Root CA',
    securityMessage: 'This certified document contains a valid tamper-evident digital signature conforming to PAdES standards.',
    formStatus: 'fillable',
    sensitivityLabel: 'Confidential',
    watermark: '',
    layers: [
      { id: 'layer-1', name: 'Document Text & Headings', visible: true, locked: false },
      { id: 'layer-2', name: 'Legal Footnotes & Citations', visible: true, locked: false },
      { id: 'layer-3', name: 'Draft Watermark (Optional)', visible: false, locked: false },
      { id: 'layer-4', name: 'Signatures & Notary Stamp', visible: true, locked: true },
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'Exhibit_A_SLA_Schedule.xlsx',
        size: '142 KB',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        date: '2026-09-15',
        contentSnippet: '99.99% Uptime commitment, Tier-1 priority resolution SLA, liquidated damages matrix.'
      },
      {
        id: 'att-2',
        name: 'Data_Protection_Addendum_DPA.pdf',
        size: '512 KB',
        type: 'application/pdf',
        date: '2026-09-18',
        contentSnippet: 'Standard Contractual Clauses (SCCs), GDPR Article 28 data processor obligations, subprocessor audit list.'
      }
    ],
    bookmarks: [
      { id: 'bm-1', title: '1. Parties and Engagement Scope', pageNumber: 1, level: 1 },
      { id: 'bm-2', title: '2. Payment Terms & Billing Accounts', pageNumber: 2, level: 1 },
      { id: 'bm-3', title: '3. Confidentiality, PII & Data Security', pageNumber: 3, level: 1 },
      { id: 'bm-4', title: '4. Indemnification & Limitation of Liability', pageNumber: 3, level: 1 },
      { id: 'bm-5', title: '5. Execution & Authorized Signatures', pageNumber: 4, level: 1 },
    ],
    pages: [
      {
        pageNumber: 1,
        rotation: 0,
        width: 612,
        height: 792,
        title: 'MASTER SERVICES AGREEMENT',
        paragraphs: [
          {
            id: 'p1-title',
            text: 'MASTER SERVICES AGREEMENT (ENTERPRISE EDITION)',
            box: { x: 8, y: 7, width: 84, height: 4 },
            style: { fontSize: 18, isBold: true, isHeading: true, align: 'center', color: '#1e293b' }
          },
          {
            id: 'p1-meta',
            text: 'Contract Ref: MSA-2026-APX-8891 | Effective Date: October 1, 2026 | Governing Law: State of Delaware',
            box: { x: 8, y: 12, width: 84, height: 3 },
            style: { fontSize: 10, isBold: false, align: 'center', color: '#64748b' }
          },
          {
            id: 'p1-sec1',
            text: '1. PARTIES AND PURPOSE',
            box: { x: 8, y: 18, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'p1-text1',
            text: 'This Master Services Agreement ("Agreement") is entered into as of the Effective Date between Apex Global Technologies Inc., a Delaware corporation with its principal office at 500 Enterprise Way, Suite 400, San Francisco, CA 94105 ("Provider"), and the Client entity identified in the Schedule ("Client").',
            box: { x: 8, y: 22, width: 84, height: 8 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          },
          {
            id: 'p1-sec2',
            text: '2. SCOPE OF SERVICES & SERVICE LEVEL AGREEMENT',
            box: { x: 8, y: 32, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'p1-text2',
            text: 'Provider shall deliver cloud-native infrastructure automation, machine-learning document processing pipelines, and 24/7 technical incident remediation as defined under Statement of Work #01. Provider commits to 99.95% monthly service availability, excluding scheduled maintenance windows pre-notified by not less than 72 hours.',
            box: { x: 8, y: 36, width: 84, height: 10 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          },
          {
            id: 'p1-sec3',
            text: '3. INTELLECTUAL PROPERTY & WORK PRODUCT',
            box: { x: 8, y: 48, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'p1-text3',
            text: 'All pre-existing intellectual property, proprietary algorithms, and developer toolkits owned by Provider shall remain solely with Provider. Client shall own all right, title, and interest in and to bespoke deliverables, client data pipelines, and processed artifacts generated explicitly under this engagement upon full payment of applicable fees.',
            box: { x: 8, y: 52, width: 84, height: 11 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          },
          {
            id: 'p1-note',
            text: 'Confidential - Strictly for Internal Corporate Review and Execution',
            box: { x: 8, y: 92, width: 84, height: 3 },
            style: { fontSize: 8, align: 'center', color: '#94a3b8' }
          }
        ]
      },
      {
        pageNumber: 2,
        rotation: 0,
        width: 612,
        height: 792,
        title: 'PAYMENT TERMS & FINANCIAL CONTROLS',
        paragraphs: [
          {
            id: 'p2-sec4',
            text: '4. FEES, INVOICING, AND PAYMENT TERMS',
            box: { x: 8, y: 7, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'p2-text4',
            text: 'Client agrees to remit monthly recurring service fees according to the tier schedule below. Invoices are issued electronically on the first business day of each calendar month and are payable Net 30 days from invoice dispatch.',
            box: { x: 8, y: 11, width: 84, height: 6 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          },
          {
            id: 'p2-sec-pii',
            text: '4.3 PRIMARY BILLING ACCOUNT & ESCROW CREDENTIALS (SENSITIVE PII)',
            box: { x: 8, y: 35, width: 84, height: 3 },
            style: { fontSize: 11, isBold: true, isHeading: true, color: '#b91c1c' }
          },
          {
            id: 'p2-pii-body',
            text: 'Authorized Billing Representative: Marcus Vance | Taxpayer ID / SSN: 123-45-6789 | Direct Corporate Card: 4532-8921-3940-1284 | Security Expiry: 08/28 | Billing Verification Email: m.vance@apexglobal-ops.net. NOTE: All sensitive payment and social security records must be permanently redacted before public distribution.',
            box: { x: 8, y: 39, width: 84, height: 9 },
            style: { fontSize: 9.5, align: 'left', color: '#7f1d1d' }
          },
          {
            id: 'p2-sec5',
            text: '5. TAXES AND REGULATORY LEVIES',
            box: { x: 8, y: 52, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'p2-text5',
            text: 'All amounts payable under this Agreement are exclusive of any sales, value-added, goods and services, or withholding taxes levied by federal or municipal authorities. Client will provide valid tax exemption certificates where applicable prior to billing execution.',
            box: { x: 8, y: 56, width: 84, height: 8 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          }
        ],
        tables: [
          {
            id: 'tbl-pricing',
            box: { x: 8, y: 18, width: 84, height: 14 },
            headers: ['Service Component', 'Resource Tier', 'Monthly Commitment', 'SLA Target'],
            rows: [
              ['Document AI Ingestion Pipeline', 'High Throughput (10M pgs)', '$14,500.00', '99.95%'],
              ['Multi-Region AppContainer Cluster', 'Dedicated VPC Nodes', '$8,250.00', '99.99%'],
              ['Enterprise Cryptographic HSM Key', 'FIPS 140-2 Level 3', '$3,100.00', '100.00%'],
              ['24/7 Dedicated Support Engineering', 'Platinum SLA (<15m)', '$4,000.00', '24x7x365']
            ]
          }
        ]
      },
      {
        pageNumber: 3,
        rotation: 0,
        width: 612,
        height: 792,
        title: 'DATA PROTECTION & RISK INDEMNIFICATION',
        paragraphs: [
          {
            id: 'p3-sec6',
            text: '6. CONFIDENTIAL INFORMATION & FEDRAMP / HIPAA COMPLIANCE',
            box: { x: 8, y: 7, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'p3-text6',
            text: 'Each party agrees that all software code, business plans, financial models, customer lists, and system security architectures disclosed by one party to the other constitute "Confidential Information". Provider warrants full compliance with FedRAMP Tailored, HIPAA, SOC 2 Type II, and ISO 27001 standards. Zero customer document data will be used to train external foundational AI models.',
            box: { x: 8, y: 11, width: 84, height: 11 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          },
          {
            id: 'p3-sec7',
            text: '7. INDEMNIFICATION & INTELLECTUAL PROPERTY DEFENSE',
            box: { x: 8, y: 24, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'p3-text7',
            text: 'Provider shall defend, indemnify, and hold harmless Client, its officers, directors, and employees against any third-party claim, suit, or proceeding alleging that the Services infringe any patent, copyright, or trademark of a third party, subject to prompt written notification and sole control of defense.',
            box: { x: 8, y: 28, width: 84, height: 10 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          },
          {
            id: 'p3-sec8',
            text: '8. LIMITATION OF LIABILITY',
            box: { x: 8, y: 40, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'p3-text8',
            text: 'EXCEPT FOR GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR BREACHES OF SECTION 6 (CONFIDENTIALITY), NEITHER PARTY SHALL BE LIABLE FOR ANY CONSEQUENTIAL, INDIRECT, INCIDENTAL, OR PUNITIVE DAMAGES. TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID IN THE PRECEDING TWELVE (12) MONTHS.',
            box: { x: 8, y: 44, width: 84, height: 10 },
            style: { fontSize: 9.5, align: 'justify', color: '#475569' }
          },
          {
            id: 'p3-sec9',
            text: '9. TERM AND TERMINATION',
            box: { x: 8, y: 56, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'p3-text9',
            text: 'The initial term shall be thirty-six (36) months commencing on the Effective Date. Either party may terminate this Agreement upon ninety (90) days prior written notice before the expiration of the current term, or immediately upon material breach uncured after thirty (30) days.',
            box: { x: 8, y: 60, width: 84, height: 8 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          }
        ]
      },
      {
        pageNumber: 4,
        rotation: 0,
        width: 612,
        height: 792,
        title: 'EXECUTION & E-SIGNATURES',
        paragraphs: [
          {
            id: 'p4-sec10',
            text: '10. SIGNATURES AND ACKNOWLEDGMENT',
            box: { x: 8, y: 7, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'p4-text10',
            text: 'IN WITNESS WHEREOF, the parties hereto have executed this Master Services Agreement by their duly authorized representatives as of the dates set forth below. Electronic signatures captured herein conform to the ESIGN Act and UETA regulations.',
            box: { x: 8, y: 11, width: 84, height: 6 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          }
        ]
      }
    ],
    formFields: [
      {
        id: 'fld-client-name',
        pageNumber: 4,
        name: 'Client Legal Entity Name',
        type: 'text',
        box: { x: 8, y: 22, width: 38, height: 4 },
        value: 'Starlight Global Holdings LLC',
        required: true
      },
      {
        id: 'fld-provider-name',
        pageNumber: 4,
        name: 'Provider Representative',
        type: 'text',
        box: { x: 54, y: 22, width: 38, height: 4 },
        value: 'Apex Global Technologies Inc.',
        required: true
      },
      {
        id: 'fld-client-signatory',
        pageNumber: 4,
        name: 'Client Signatory Name & Title',
        type: 'text',
        box: { x: 8, y: 30, width: 38, height: 4 },
        value: 'Eleanor Vance, Chief Operating Officer',
        required: true
      },
      {
        id: 'fld-provider-signatory',
        pageNumber: 4,
        name: 'Provider Signatory Name & Title',
        type: 'text',
        box: { x: 54, y: 30, width: 38, height: 4 },
        value: 'David Chen, VP Enterprise Engineering',
        required: true
      },
      {
        id: 'fld-client-sig',
        pageNumber: 4,
        name: 'Client Signature Pad',
        type: 'signature',
        box: { x: 8, y: 38, width: 38, height: 10 },
        value: 'Eleanor Vance',
        signedBy: 'Eleanor Vance (eleanor.vance@starlight-holdings.com)',
        signedDate: '2026-09-28T14:22:00Z',
        required: true
      },
      {
        id: 'fld-provider-sig',
        pageNumber: 4,
        name: 'Provider Signature Pad',
        type: 'signature',
        box: { x: 54, y: 38, width: 38, height: 10 },
        value: 'David Chen',
        signedBy: 'David Chen (d.chen@apexglobal.com)',
        signedDate: '2026-09-28T15:05:12Z',
        required: true
      },
      {
        id: 'fld-audit-checkbox',
        pageNumber: 4,
        name: 'Consent to Digital Audit Trail and AATL Seal Verification',
        type: 'checkbox',
        box: { x: 8, y: 52, width: 4, height: 3 },
        value: true,
        required: true
      },
      {
        id: 'fld-tier-select',
        pageNumber: 4,
        name: 'Support Tier Level Selection',
        type: 'dropdown',
        box: { x: 8, y: 60, width: 38, height: 4 },
        value: 'Enterprise Platinum 24/7',
        options: ['Standard 9x5 Support', 'Priority Silver Support', 'Enterprise Platinum 24/7'],
        required: true
      }
    ],
    annotations: [
      {
        id: 'ann-1',
        documentId: 'doc-msa-2026',
        pageNumber: 1,
        type: 'highlight',
        box: { x: 8, y: 36, width: 84, height: 4 },
        content: 'Verify 99.95% vs our standard 99.99% cloud SLA requirement with VP of Ops.',
        author: 'Sarah Jenkins (Legal Counsel)',
        color: '#fef08a',
        createdAt: '2026-09-29T10:15:00Z',
        replies: [
          {
            id: 'rep-1',
            author: 'Marcus Vance',
            text: 'Tier 1 nodes offer 99.99% as detailed in attached Exhibit A SLA schedule.',
            date: '2026-09-29T11:02:00Z'
          }
        ]
      },
      {
        id: 'ann-2',
        documentId: 'doc-msa-2026',
        pageNumber: 2,
        type: 'sticky_note',
        box: { x: 85, y: 34, width: 4, height: 4 },
        content: 'CRITICAL SECURITY: Please execute permanent redaction on SSN 123-45-6789 and Credit Card before exporting to external partners.',
        author: 'Security Officer (Audit)',
        color: '#f87171',
        createdAt: '2026-09-29T14:30:00Z'
      }
    ],
    createdAt: '2026-09-20T08:00:00Z',
    updatedAt: '2026-09-29T15:20:00Z'
  },
  {
    id: 'doc-financial-q4',
    title: 'Q4 Global Financial & Strategic Report',
    fileName: 'GlobalCorp_Q4_2026_Earnings_Report.pdf',
    fileSizeBytes: 4120890,
    pageCount: 3,
    version: '1.7',
    isEncrypted: false,
    isCertified: false,
    securityMessage: 'Review draft. Internal corporate strategy document.',
    formStatus: 'none',
    sensitivityLabel: 'Highly Confidential (MIP)',
    watermark: '',
    layers: [
      { id: 'l-fin-1', name: 'Financial Tables & Key Figures', visible: true, locked: false },
      { id: 'l-fin-2', name: 'Executive Commentary', visible: true, locked: false },
      { id: 'l-fin-3', name: 'Audit Disclosures', visible: true, locked: true },
    ],
    attachments: [
      {
        id: 'att-fin-1',
        name: 'Consolidated_Balance_Sheet.xlsx',
        size: '890 KB',
        type: 'application/vnd.ms-excel',
        date: '2026-09-25',
        contentSnippet: 'Full GAAP reconciliation across APAC, EMEA, and North America business units.'
      }
    ],
    bookmarks: [
      { id: 'bm-f1', title: '1. Executive Summary & Revenue Highlights', pageNumber: 1, level: 1 },
      { id: 'bm-f2', title: '2. Segment Breakdown (Cloud, Enterprise, Hardware)', pageNumber: 2, level: 1 },
      { id: 'bm-f3', title: '3. Forward-Looking Guidance & Risk Matrix', pageNumber: 3, level: 1 },
    ],
    pages: [
      {
        pageNumber: 1,
        rotation: 0,
        width: 612,
        height: 792,
        title: 'GLOBAL FINANCIAL PERFORMANCE - Q4 2026',
        paragraphs: [
          {
            id: 'pf1-h1',
            text: 'GLOBALCORP FINANCIAL PERFORMANCE REPORT (Q4 2026)',
            box: { x: 8, y: 8, width: 84, height: 4 },
            style: { fontSize: 18, isBold: true, isHeading: true, align: 'center', color: '#0f172a' }
          },
          {
            id: 'pf1-sub',
            text: 'Record Cloud Expansion Drives 32% Year-Over-Year Recurring Revenue Growth',
            box: { x: 8, y: 13, width: 84, height: 3 },
            style: { fontSize: 12, isBold: true, align: 'center', color: '#0369a1' }
          },
          {
            id: 'pf1-sec1',
            text: 'EXECUTIVE OVERVIEW',
            box: { x: 8, y: 19, width: 84, height: 3 },
            style: { fontSize: 12, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'pf1-p1',
            text: 'During the fourth quarter of fiscal 2026, GlobalCorp achieved consolidated net revenue of $4.82 Billion, representing a 24% increase compared to $3.89 Billion in Q4 2025. Operating cash flow stood at $1.34 Billion, with free cash flow margin expanding 340 basis points to 22.8%.',
            box: { x: 8, y: 23, width: 84, height: 8 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          }
        ],
        tables: [
          {
            id: 'tbl-fin-q4',
            box: { x: 8, y: 34, width: 84, height: 18 },
            headers: ['Segment Metric ($M)', 'Q4 2025', 'Q4 2026', 'YoY Growth', 'Operating Margin'],
            rows: [
              ['Cloud Document Intelligence', '$1,240M', '$1,890M', '+52.4%', '38.2%'],
              ['Enterprise Collaboration Suite', '$1,520M', '$1,740M', '+14.5%', '29.1%'],
              ['Security & Digital Trust (AATL)', '$680M', '$810M', '+19.1%', '42.0%'],
              ['Professional Services & Custom Dev', '$450M', '$380M', '-15.5%', '14.2%'],
              ['Consolidated Total Revenue', '$3,890M', '$4,820M', '+23.9%', '32.6%']
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        rotation: 0,
        width: 612,
        height: 792,
        title: 'SEGMENT HIGHLIGHTS & GEOGRAPHIC EXPANSION',
        paragraphs: [
          {
            id: 'pf2-h1',
            text: 'BUSINESS UNIT PERFORMANCE & REGIONAL TRENDS',
            box: { x: 8, y: 8, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'pf2-p1',
            text: 'North America revenue reached $2.65B (+21% YoY) anchored by large multi-year enterprise contracts. EMEA expanded 28% to $1.41B driven by sovereign cloud certifications. APAC witnessed rapid adoption with $760M (+31% YoY) particularly in Japan and Australia.',
            box: { x: 8, y: 12, width: 84, height: 8 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          },
          {
            id: 'pf2-h2',
            text: 'RESEARCH & DEVELOPMENT ACCELERATION',
            box: { x: 8, y: 22, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'pf2-p2',
            text: 'R&D expenditures rose to $612 Million (12.7% of total revenue), funding next-generation AppContainer WebAssembly runtimes, on-device neural OCR inference, and automated PII redaction engines.',
            box: { x: 8, y: 26, width: 84, height: 8 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          }
        ]
      },
      {
        pageNumber: 3,
        rotation: 0,
        width: 612,
        height: 792,
        title: 'FORWARD GUIDANCE & STRATEGIC OUTLOOK',
        paragraphs: [
          {
            id: 'pf3-h1',
            text: 'FY 2027 OUTLOOK & GUIDANCE SUMMARY',
            box: { x: 8, y: 8, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#0f172a' }
          },
          {
            id: 'pf3-p1',
            text: 'For the full year fiscal 2027, management projects consolidated revenue between $20.4 Billion and $20.9 Billion, representing 18-21% YoY expansion. Diluted non-GAAP EPS is forecasted at $16.40 to $16.80.',
            box: { x: 8, y: 12, width: 84, height: 8 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          },
          {
            id: 'pf3-h2',
            text: 'PRINCIPAL RISK FACTORS & MITIGATION STRATEGIES',
            box: { x: 8, y: 22, width: 84, height: 3 },
            style: { fontSize: 13, isBold: true, isHeading: true, color: '#b91c1c' }
          },
          {
            id: 'pf3-p2',
            text: 'Key risks include currency fluctuations across EMEA, evolving AI sovereign compliance directives (EU AI Act High-Risk systems classification), and semiconductor hardware lead times. Mitigation reserves totaling $450M remain uncommitted.',
            box: { x: 8, y: 26, width: 84, height: 8 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          }
        ]
      }
    ],
    formFields: [],
    annotations: [],
    createdAt: '2026-09-22T08:00:00Z',
    updatedAt: '2026-09-27T11:00:00Z'
  },
  {
    id: 'doc-medical-ocr',
    title: 'Scanned Medical Diagnostic & Billing Record',
    fileName: 'St_Jude_Medical_Billing_Record_OCR_Scan.pdf',
    fileSizeBytes: 1820900,
    pageCount: 2,
    version: '1.6',
    isEncrypted: false,
    isCertified: false,
    securityMessage: 'Protected Health Information (PHI). Strict HIPAA privacy rules apply.',
    formStatus: 'none',
    sensitivityLabel: 'Highly Confidential (MIP)',
    watermark: '',
    layers: [
      { id: 'l-med-1', name: 'Scanned Bitmap Background', visible: true, locked: true },
      { id: 'l-med-2', name: 'OCR Recognized Text Layer', visible: true, locked: false },
    ],
    attachments: [],
    bookmarks: [
      { id: 'bm-m1', title: 'Patient Admission & Diagnostic Codes', pageNumber: 1, level: 1 },
      { id: 'bm-m2', title: 'Itemized Lab Charges & Insurance Claim', pageNumber: 2, level: 1 },
    ],
    pages: [
      {
        pageNumber: 1,
        rotation: 0,
        width: 612,
        height: 792,
        title: 'HOSPITAL CLINICAL DIAGNOSTIC RECORD',
        paragraphs: [
          {
            id: 'pm1-h1',
            text: 'ST. JUDE MEMORIAL REGIONAL MEDICAL CENTER',
            box: { x: 8, y: 8, width: 84, height: 4 },
            style: { fontSize: 16, isBold: true, isHeading: true, align: 'center', color: '#1e3a8a' }
          },
          {
            id: 'pm1-sub',
            text: 'DEPARTMENT OF RADIOLOGY & CLINICAL GENOMICS',
            box: { x: 8, y: 13, width: 84, height: 3 },
            style: { fontSize: 11, isBold: true, align: 'center', color: '#475569' }
          },
          {
            id: 'pm1-pat',
            text: 'PATIENT CONFIDENTIAL IDENTIFIERS (PHI - HIPAA RESTRICTED)',
            box: { x: 8, y: 19, width: 84, height: 3 },
            style: { fontSize: 11, isBold: true, color: '#dc2626' }
          },
          {
            id: 'pm1-pinfo',
            text: 'Patient Name: Cassandra Miller | DOB: 1984-11-14 | SSN: 987-65-4321 | Medical Record #: MRN-9021-X | Attending Physician: Dr. Robert Zhang, MD (NPI: 1928374650) | Emergency Contact: (555) 839-2019',
            box: { x: 8, y: 23, width: 84, height: 7 },
            style: { fontSize: 9.5, color: '#1e293b' }
          },
          {
            id: 'pm1-diag',
            text: 'CLINICAL ADMISSION & PRIMARY DIAGNOSIS (ICD-10)',
            box: { x: 8, y: 32, width: 84, height: 3 },
            style: { fontSize: 11, isBold: true, color: '#0f172a' }
          },
          {
            id: 'pm1-dbody',
            text: 'Primary ICD-10 Code: J18.9 (Pneumonia, unspecified organism). Secondary Code: E11.9 (Type 2 diabetes mellitus without complications). Contrast chest CT demonstrated bilateral patchy alveolar infiltrates without pleural effusion. Patient was admitted to step-down unit for IV antibiotic regimen.',
            box: { x: 8, y: 36, width: 84, height: 10 },
            style: { fontSize: 10, align: 'justify', color: '#334155' }
          }
        ]
      },
      {
        pageNumber: 2,
        rotation: 0,
        width: 612,
        height: 792,
        title: 'ITEMIZED CHARGES & INSURANCE BILLING',
        paragraphs: [
          {
            id: 'pm2-h1',
            text: 'ITEMIZED CHARGES & MEDICAID / COMMERCIAL CARRIER CLAIM',
            box: { x: 8, y: 8, width: 84, height: 3 },
            style: { fontSize: 12, isBold: true, color: '#0f172a' }
          },
          {
            id: 'pm2-sub',
            text: 'Carrier Policy: Blue Shield Premier PPO | Policy ID: BC-44910298 | Primary Cardholder SSN: 987-65-4321 | Credit Card Copay on File: 4111-2222-3333-4444',
            box: { x: 8, y: 12, width: 84, height: 5 },
            style: { fontSize: 9.5, color: '#991b1b' }
          }
        ],
        tables: [
          {
            id: 'tbl-med-charges',
            box: { x: 8, y: 19, width: 84, height: 16 },
            headers: ['Service Description', 'CPT Code', 'Units', 'Billed Amount', 'Adjusted Amount'],
            rows: [
              ['Chest CT with IV Contrast', '71260', '1', '$1,850.00', '$420.00'],
              ['Comprehensive Metabolic Panel', '80053', '2', '$290.00', '$75.00'],
              ['IV Infusion Ceftriaxone 1g', '96365', '4', '$680.00', '$190.00'],
              ['Inpatient Step-Down Observation', '99222', '3 days', '$4,200.00', '$1,150.00'],
              ['Total Claim Charges', '', '', '$7,020.00', '$1,835.00']
            ]
          }
        ]
      }
    ],
    formFields: [],
    annotations: [],
    createdAt: '2026-09-24T09:00:00Z',
    updatedAt: '2026-09-28T16:00:00Z'
  }
];

export const SAMPLE_PDF_SPACES = [
  {
    id: 'space-legal-merger',
    name: 'M&A Due Diligence - Project Orion',
    description: 'Consolidated data room containing master contracts, tax disclosures, IP assignments, and compliance audits.',
    documentCount: 8,
    lastUpdated: '12 minutes ago',
    tags: ['M&A', 'Due Diligence', 'Legal', 'High Priority'],
    documents: [
      { id: 'doc-1', name: 'Apex_Global_Asset_Purchase_Agreement.pdf', size: '6.4 MB', pages: 84 },
      { id: 'doc-2', name: 'IP_Patents_Trademark_Schedule.pdf', size: '3.1 MB', pages: 28 },
      { id: 'doc-3', name: 'Employee_Retention_Plan_2026.docx', size: '1.2 MB', pages: 14 },
      { id: 'doc-4', name: 'Tax_EBITDA_Q1_Q4_Audit.xlsx', size: '2.8 MB', pages: 9 }
    ]
  },
  {
    id: 'space-q4-strategy',
    name: 'Enterprise Strategic Planning & Cloud AI',
    description: 'Product requirements, competitive positioning, and financial forecasts for next-generation Chad-OmniPDF AI suite.',
    documentCount: 5,
    lastUpdated: '1 hour ago',
    tags: ['Strategy', 'AI Engineering', 'FY27'],
    documents: [
      { id: 'doc-5', name: 'GlobalCorp_Q4_2026_Earnings_Report.pdf', size: '4.1 MB', pages: 12 },
      { id: 'doc-6', name: 'Chad-OmniPDF_Liquid_Mode_Whitepaper.pdf', size: '5.2 MB', pages: 36 },
      { id: 'doc-7', name: 'Market_Sizing_PDF_Spaces.pptx', size: '8.4 MB', pages: 22 }
    ]
  }
];
