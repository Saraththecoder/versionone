'use client';

import { AuthService } from '@/services/AuthService';
import { useAuthContext } from '@/providers/AuthProvider';
import { UserRole } from '@/lib/schemas';
import { isDemoModeEnabled } from '@/lib/security';

export function useAuth() {
  const { loading, user, userDoc, loginWithDemo, setActiveSession, clearDemo } = useAuthContext();

  const login = async (role: UserRole) => {
    return AuthService.loginWithGoogle(role);
  };

  const loginStaff = async (email: string, password: string, role: 'admin' | 'driver') => {
    const doc = await AuthService.loginStaffWithCredentials(email, password, role);
    setActiveSession(doc);
    return doc;
  };

  const guardedDemoLogin = (role: UserRole) => {
    if (!isDemoModeEnabled()) {
      throw new Error('Demo access is disabled in production.');
    }
    return loginWithDemo(role);
  };

  const logout = async () => {
    clearDemo();
    try {
      await AuthService.logout();
    } catch (err) {
      console.warn('Firebase logout error ignored:', err);
    }
  };

  return {
    isAuthenticated: !!user || !!userDoc,
    loading,
    login,
    loginStaff,
    loginWithDemo: guardedDemoLogin,
    setActiveSession,
    logout,
  };
}
