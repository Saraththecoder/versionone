'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AnyUserDocument, UserRole } from '@/lib/schemas';
import { AuthService } from '@/services/AuthService';

const DEMO_USERS: Record<UserRole, AnyUserDocument> = {
  student: {
    uid: 'demo-student-101',
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
  clearDemo: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userDoc: null,
  loading: true,
  role: null,
  loginWithDemo: () => DEMO_USERS.student,
  clearDemo: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<AnyUserDocument | null>(null);
  const [loading, setLoading] = useState(true);

  const loginWithDemo = (role: UserRole): AnyUserDocument => {
    const doc = DEMO_USERS[role];
    setUserDoc(doc);
    setUser({
      uid: doc.uid,
      email: doc.email,
      displayName: doc.name,
    } as User);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aits_demo_role', role);
    }
    return doc;
  };

  const clearDemo = () => {
    setUser(null);
    setUserDoc(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aits_demo_role');
    }
  };

  useEffect(() => {
    // 1. Check if user activated demo session asynchronously so effect stays clean
    if (typeof window !== 'undefined') {
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
    }

    // 2. Listen to Firebase Auth state
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
        clearDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
