import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { PdfDocument } from '../types/chad-omnidpdf';
import { auth } from '../firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile Sync
export async function syncUserProfile(uid: string, displayName: string, email: string, photoURL: string) {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    
    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        uid,
        displayName,
        email,
        photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(userDocRef, {
        displayName,
        email,
        photoURL,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save document to Firestore
export async function saveDocumentToFirestore(userId: string, pdfDoc: PdfDocument) {
  const path = `users/${userId}/documents/${pdfDoc.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'documents', pdfDoc.id);
    
    // Clean document data to prevent unsupported Firestore types
    const cleanDoc = JSON.parse(JSON.stringify(pdfDoc));
    cleanDoc.ownerId = userId;
    
    await setDoc(docRef, cleanDoc);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Load documents from Firestore
export async function loadDocumentsFromFirestore(userId: string): Promise<PdfDocument[]> {
  const path = `users/${userId}/documents`;
  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'documents'));
    const docs: PdfDocument[] = [];
    querySnapshot.forEach((doc) => {
      docs.push(doc.data() as PdfDocument);
    });
    return docs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Delete document from Firestore
export async function deleteDocumentFromFirestore(userId: string, documentId: string) {
  const path = `users/${userId}/documents/${documentId}`;
  try {
    const docRef = doc(db, 'users', userId, 'documents', documentId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
