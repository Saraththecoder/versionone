import { auth } from '@/lib/firebase/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { FirestoreService } from './FirestoreService';
import { AnyUserDocument, UserRole } from '@/lib/schemas';

export class AuthService {
  private static provider = new GoogleAuthProvider();

  static async loginWithGoogle(role: UserRole = 'student'): Promise<AnyUserDocument> {
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

    // Determine collection
    const collectionName = role + 's'; // "students", "drivers", "admins"

    // Check if user document exists in that collection
    let userDoc = await FirestoreService.getDocument<AnyUserDocument>(collectionName, user.uid);

    if (!userDoc) {
      // Create new document if it doesn't exist
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

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  /**
   * Fetches the user document from Firestore across all collections
   * to determine their role if we only have their UID from Firebase Auth.
   * This is useful for persistent sessions where we just have auth.currentUser.
   */
  static async resolveUserDocument(uid: string): Promise<AnyUserDocument | null> {
    // Try admin
    let user = await FirestoreService.getDocument<AnyUserDocument>('admins', uid);
    if (user) return user;

    // Try driver
    user = await FirestoreService.getDocument<AnyUserDocument>('drivers', uid);
    if (user) return user;

    // Try student
    user = await FirestoreService.getDocument<AnyUserDocument>('students', uid);
    if (user) return user;

    return null;
  }
}
