import { getAuth, Auth } from 'firebase/auth';
import { app, isFirebaseConfigured } from './config';

let authInstance: Auth | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    authInstance = getAuth(app);
  } catch (e) {
    console.warn('Firebase Auth init skipped:', e);
  }
}

export const auth = authInstance as Auth;
