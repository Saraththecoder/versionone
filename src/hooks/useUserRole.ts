'use client';

import { useAuthContext } from '@/providers/AuthProvider';

export function useUserRole() {
  const { role, loading } = useAuthContext();
  return {
    role,
    loading,
  };
}
