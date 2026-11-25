'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AnyUserDocument, UserRole } from '@/lib/schemas';
import { AuthService } from '@/services/AuthService';
import { isDemoModeEnabled, isDemoUid } from '@/lib/security';

const ACTIVE_USER_KEY = 'aits_active_user';

const DEMO_USERS: Record<UserRole, AnyUserDocument> = {
  student: {
    uid: 'demo-student-101',
    rollNo: '23701A0501',
    email: 'rahul.sharma@aits.ac.in',
    name: 'Rahul Sharma',
    createdAt: Date.now(),
    role: 'student',
    assignedBusId: 'AP 04 TX 4589',
  },
  driver: {
    uid: 'demo-driver-202',
    email: 'driver.venkat@aits.ac.in',
    name: 'K. Venkat',
    createdAt: Date.now(),
    role: 'driver',
    currentBusId: 'AP 04 TX 4589',
    licenseNumber: 'AP04 20180004921',
  },
  admin: {
    uid: 'demo-admin-303',
    email: 'transport.admin@aits.ac.in',
    name: 'Dr. C. Mohan',
    createdAt: Date.now(),
    role: 'admin',
  },
};

interface AuthContextType {
  user: User | null;
  userDoc: AnyUserDocument | null;
  loading: boolean;
  role: UserRole | null;
  loginWithDemo: (role: UserRole) => AnyUserDocument;
  setActiveSession: (doc: AnyUserDocument) => void;
  clearDemo: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userDoc: null,
  loading: true,
  role: null,
  loginWithDemo: () => DEMO_USERS.student,
  setActiveSession: () => {},
  clearDemo: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<AnyUserDocument | null>(null);
  const [loading, setLoading] = useState(true);

  const setActiveSession = (doc: AnyUserDocument): void => {
    setUserDoc(doc);
    setUser({
      uid: doc.uid,
      email: doc.email,
      displayName: doc.name,
    } as User);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(doc));
      localStorage.setItem('aits_demo_role', doc.role);
    }
  };

  const loginWithDemo = (role: UserRole): AnyUserDocument => {
    const doc = DEMO_USERS[role];
    setActiveSession(doc);
    return doc;
  };

  const clearDemo = () => {
    setUser(null);
    setUserDoc(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aits_demo_role');
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  };

  useEffect(() => {
    // 1. Check persisted session (registered student account or demo user)
    if (typeof window !== 'undefined') {
      const rawUser = localStorage.getItem(ACTIVE_USER_KEY);
      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser) as AnyUserDocument;
          const allowSession =
            parsed && parsed.uid && parsed.role && (!isDemoUid(parsed.uid) || isDemoModeEnabled());
          if (allowSession) {
            const timer = setTimeout(() => {
              setUserDoc(parsed);
              setUser({
                uid: parsed.uid,
                email: parsed.email,
                displayName: parsed.name,
              } as User);
              setLoading(false);
            }, 0);
            return () => clearTimeout(timer);
          } else {
            localStorage.removeItem(ACTIVE_USER_KEY);
          }
        } catch {
          localStorage.removeItem(ACTIVE_USER_KEY);
        }
      }

      if (isDemoModeEnabled()) {
        const storedRole = localStorage.getItem('aits_demo_role') as UserRole | null;
        if (storedRole && DEMO_USERS[storedRole]) {
          const doc = DEMO_USERS[storedRole];
          const timer = setTimeout(() => {
            setUserDoc(doc);
            setUser({
              uid: doc.uid,
              email: doc.email,
              displayName: doc.name,
            } as User);
            setLoading(false);
          }, 0);
          return () => clearTimeout(timer);
        }
      } else {
        localStorage.removeItem('aits_demo_role');
      }
    }

    // 2. Listen to Firebase Auth state (skip gracefully if Firebase is not configured)
    if (!auth) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const doc = await AuthService.resolveUserDocument(firebaseUser.uid);
          setUserDoc(doc);
        } catch (error) {
          console.error('Error resolving user document:', error);
          setUserDoc(null);
        }
      } else {
        setUserDoc(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userDoc,
        loading,
        role: userDoc?.role || null,
        loginWithDemo,
        setActiveSession,
        clearDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
