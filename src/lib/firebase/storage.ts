import { getStorage, FirebaseStorage } from 'firebase/storage';
import { app, isFirebaseConfigured } from './config';

let storageInstance: FirebaseStorage | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    storageInstance = getStorage(app);
  } catch (e) {
    console.warn('Firebase Storage init skipped:', e);
  }
}

export const storage = storageInstance as FirebaseStorage;
