'use client';

import { useAuthContext } from '@/providers/AuthProvider';

export function useCurrentUser() {
  const { userDoc, loading } = useAuthContext();
  return {
    user: userDoc,
    loading,
  };
}
