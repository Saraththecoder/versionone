import { db } from '@/lib/firebase/firestore';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  QueryConstraint,
  DocumentData,
  WithFieldValue,
  UpdateData,
} from 'firebase/firestore';

export class FirestoreService {
  /**
   * Fetch a single document by its ID
   */
  static async getDocument<T = DocumentData>(path: string, id: string): Promise<T | null> {
    if (!db) return null;
    const docRef = doc(db, path, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  }

  /**
   * Fetch multiple documents from a collection
   */
  static async getDocuments<T = DocumentData>(
    path: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    if (!db) return [];
    const q = query(collection(db, path), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as T);
  }

  /**
   * Set a document (creates if not exists, overwrites if exists unless merge=true)
   */
  static async setDocument<T extends WithFieldValue<DocumentData>>(
    path: string,
    id: string,
    data: Partial<T>,
    merge = true
  ): Promise<void> {
    if (!db) return;
    const docRef = doc(db, path, id);
    await setDoc(docRef, data, { merge });
  }

  /**
   * Update an existing document
   */
  static async updateDocument<T extends DocumentData>(
    path: string,
    id: string,
    data: UpdateData<T>
  ): Promise<void> {
    if (!db) return;
    const docRef = doc(db, path, id);
    await updateDoc(docRef, data as UpdateData<DocumentData>);
  }

  /**
   * Delete a document
   */
  static async deleteDocument(path: string, id: string): Promise<void> {
    if (!db) return;
    const docRef = doc(db, path, id);
    await deleteDoc(docRef);
  }
}
