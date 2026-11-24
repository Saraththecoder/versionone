'use client';

import { useAuth } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DriverPortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const { user } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && pathname !== '/driver') {
        router.push('/driver');
      } else if (isAuthenticated && user?.role !== 'driver' && pathname !== '/driver') {
        router.push('/not-authorized');
      }
    }
  }, [isAuthenticated, loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-grid-pattern text-neutral-900 font-medium">
        <div className="w-8 h-8 border-3 border-neutral-800 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-heading font-bold text-sm">Loading Driver Portal...</p>
      </div>
    );
  }

  // On the main driver flow screen (/driver), render the complete 5-stage driver experience
  if (pathname === '/driver') {
    return <>{children}</>;
  }

  // If authenticated and authorized driver
  if (isAuthenticated && user?.role === 'driver') {
    return <>{children}</>;
  }

  return null;
}
