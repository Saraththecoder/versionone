import { getDatabase, Database } from 'firebase/database';
import { app, isFirebaseConfigured } from './config';

let rtdbInstance: Database | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    rtdbInstance = getDatabase(app);
  } catch (e) {
    console.warn('Firebase RTDB init skipped:', e);
  }
}

export const rtdb = rtdbInstance as Database;
