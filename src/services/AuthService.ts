import { auth } from '@/lib/firebase/auth';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { FirestoreService } from './FirestoreService';
import { AnyUserDocument, UserRole } from '@/lib/schemas';

export class AuthService {
  private static provider = new GoogleAuthProvider();

  static async loginWithGoogle(role: UserRole = 'student'): Promise<AnyUserDocument> {
    if (!auth) {
      throw new Error('Firebase Auth is not configured.');
    }
    const result = await signInWithPopup(auth, this.provider);
    const user = result.user;

    // Check domain restriction if student
    if (role === 'student') {
      const allowedDomain = process.env.NEXT_PUBLIC_COLLEGE_DOMAIN;
      if (allowedDomain && !user.email?.endsWith(`@${allowedDomain}`)) {
        await this.logout();
        throw new Error(`Access denied. Students must use their @${allowedDomain} email address.`);
      }
    }

    const collectionName = role + 's'; // "students", "drivers", "admins"
    let userDoc = await FirestoreService.getDocument<AnyUserDocument>(collectionName, user.uid);

    if (!userDoc) {
      // Never auto-provision privileged Admin or Driver accounts
      if (role === 'admin' || role === 'driver') {
        await this.logout();
        throw new Error(`Access denied. This account is not registered as an authorized ${role}.`);
      }

      userDoc = {
        uid: user.uid,
        email: user.email!,
        name: user.displayName || 'Unknown',
        createdAt: Date.now(),
        role,
      } as AnyUserDocument;

      await FirestoreService.setDocument<AnyUserDocument>(collectionName, user.uid, userDoc);
    }

    return userDoc;
  }

  static async loginStaffWithCredentials(
    email: string,
    password: string,
    role: 'admin' | 'driver'
  ): Promise<AnyUserDocument> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Please enter both email and password.');
    }

    // 1. Prefer Firebase Auth + Firestore role verification when configured
    if (auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const collectionName = role + 's';
        const doc = await FirestoreService.getDocument<AnyUserDocument>(
          collectionName,
          cred.user.uid
        );
        if (!doc || doc.role !== role) {
          await this.logout();
          throw new Error(`Access denied. Account is not authorized in ${collectionName}.`);
        }
        return doc;
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code;
        if (
          code === 'auth/wrong-password' ||
          code === 'auth/invalid-credential' ||
          code === 'auth/user-not-found'
        ) {
          // Fall through to server env verification if configured, otherwise reject
        } else if (err instanceof Error && err.message.startsWith('Access denied')) {
          throw err;
        }
      }
    }

    // 2. Server-side credential verification (/api/auth/staff)
    const res = await fetch('/api/auth/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email: cleanEmail, password }),
    });

    const data = (await res.json()) as { user?: AnyUserDocument; error?: string };
    if (!res.ok || !data.user) {
      throw new Error(data.error || `Invalid ${role} credentials.`);
    }

    return data.user;
  }

  static async logout(): Promise<void> {
    if (!auth) return;
    await signOut(auth);
  }

  static async resolveUserDocument(uid: string): Promise<AnyUserDocument | null> {
    let user = await FirestoreService.getDocument<AnyUserDocument>('admins', uid);
    if (user) return user;

    user = await FirestoreService.getDocument<AnyUserDocument>('drivers', uid);
    if (user) return user;

    user = await FirestoreService.getDocument<AnyUserDocument>('students', uid);
    if (user) return user;

    return null;
  }
}
