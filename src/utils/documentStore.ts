import { PdfDocument, AccountTier } from '../types/chad-omnidpdf';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

const DB_NAME = 'Chad-OmniPDFEnterpriseDB';
const DB_VERSION = 1;
const STORE_NAME = 'documents';
const ACTIVE_DOC_KEY = 'chad-omnidpdf_active_doc_id';
const ACTIVE_TIER_KEY = 'chad-omnidpdf_active_tier';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Loads all documents from IndexedDB with LocalStorage fallback, remote docId sync, and default seed.
 */
export async function loadDocumentsFromStore(): Promise<PdfDocument[]> {
  // Check if a shared document ID is requested via URL parameter
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const docIdParam = urlParams?.get('docId');

  if (docIdParam) {
    try {
      const res = await fetch(`/api/v1/documents/${docIdParam}`);
      if (res.ok) {
        const docData = await res.json();
        const remoteDoc = docData.document || docData;
        if (remoteDoc && remoteDoc.pages) {
          const localDocs = await loadLocalDocumentsOnly();
          const combined = [remoteDoc, ...localDocs.filter((d) => d.id !== remoteDoc.id)];
          saveDocumentsToStore(combined);
          return combined;
        }
      }
    } catch (err) {
      console.warn('Could not fetch remote document from server:', err);
    }
  }

  return loadLocalDocumentsOnly();
}

async function loadLocalDocumentsOnly(): Promise<PdfDocument[]> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const stored = request.result as PdfDocument[];
        const validStored = (stored || []).filter((d) => Boolean(d && typeof d === 'object' && d.id));
        if (validStored.length > 0) {
          resolve(validStored);
        } else {
          // Fallback to localStorage
          const localJson = localStorage.getItem('chad-omnidpdf_docs_fallback');
          if (localJson) {
            try {
              const parsed = JSON.parse(localJson);
              if (Array.isArray(parsed)) {
                const validParsed = parsed.filter((d: any) => Boolean(d && typeof d === 'object' && d.id));
                if (validParsed.length > 0) {
                  // Seed IndexedDB in background
                  saveDocumentsToStore(validParsed);
                  resolve(validParsed);
                  return;
                }
              }
            } catch (e) {
              console.warn('Failed to parse localStorage fallback', e);
            }
          }
          // Seed with default SAMPLE_DOCUMENTS so user has interactive suite ready to select
          saveDocumentsToStore(SAMPLE_DOCUMENTS);
          resolve(SAMPLE_DOCUMENTS);
        }
      };

      request.onerror = () => {
        resolve(SAMPLE_DOCUMENTS);
      };
    });
  } catch (err) {
    // If IndexedDB fails, use localStorage
    const localJson = localStorage.getItem('chad-omnidpdf_docs_fallback');
    if (localJson) {
      try {
        const parsed = JSON.parse(localJson);
        if (Array.isArray(parsed)) {
          const validParsed = parsed.filter((d: any) => Boolean(d && typeof d === 'object' && d.id));
          if (validParsed.length > 0) return validParsed;
        }
      } catch {}
    }
    return SAMPLE_DOCUMENTS;
  }
}

/**
 * Persists documents asynchronously to IndexedDB, LocalStorage, and server backend.
 */
export async function saveDocumentsToStore(docs: PdfDocument[]): Promise<void> {
  // Always update localStorage snapshot for instant read
  try {
    localStorage.setItem('chad-omnidpdf_docs_fallback', JSON.stringify(docs));
  } catch (e) {
    // LocalStorage quota may be exceeded for large docs, ignore
  }

  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Clear existing and write updated set
    store.clear();
    docs.forEach((doc) => {
      store.put(doc);
    });
  } catch (err) {
    console.warn('IndexedDB persistence error:', err);
  }

  // Background sync all documents to server
  try {
    for (const doc of docs) {
      fetch('/api/v1/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: doc.id,
          file_name: doc.fileName,
          title: doc.title,
          page_count: doc.pageCount,
          document: doc,
        }),
      }).catch((error) => {
        console.warn('Failed to sync document to server:', doc.id, error);
      });
    }
  } catch (error) {
    console.warn('Error initiating background sync:', error);
  }
}

/**
 * Persists and retrieves the active document ID
 */
export function getSavedActiveDocId(defaultId: string): string {
  return localStorage.getItem(ACTIVE_DOC_KEY) || defaultId;
}

export function saveActiveDocId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_DOC_KEY, id);
  } catch {}
}

/**
 * Persists and retrieves the active account tier
 */
export function getSavedAccountTier(defaultTier: AccountTier): AccountTier {
  const val = localStorage.getItem(ACTIVE_TIER_KEY) as AccountTier;
  return val || defaultTier;
}

export function saveAccountTier(tier: AccountTier): void {
  try {
    localStorage.setItem(ACTIVE_TIER_KEY, tier);
  } catch {}
}

const PREFERENCES_KEY = 'chad-omnidpdf_user_preferences';

export function getSavedPreferences<T>(defaultPrefs: T): T {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (raw) {
      return { ...defaultPrefs, ...JSON.parse(raw) };
    }
  } catch {}
  return defaultPrefs;
}

export function savePreferencesToStore<T>(prefs: T): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  } catch {}
}

