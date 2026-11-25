import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
} from 'firebase/firestore';
import { app, isFirebaseConfigured } from './config';

let dbInstance: Firestore | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    dbInstance = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } catch {
    try {
      dbInstance = getFirestore(app);
    } catch (e) {
      console.warn('Firebase Firestore init skipped:', e);
    }
  }
}

export const db = dbInstance as Firestore;
