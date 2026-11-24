'use client';

import { useAuth } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { StudentBottomNav } from '@/components/student/StudentBottomNav';

export default function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const { user } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && pathname !== '/student') {
        router.push('/student');
      } else if (isAuthenticated && user?.role !== 'student' && pathname !== '/student') {
        router.push('/not-authorized');
      }
    }
  }, [isAuthenticated, loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-grid-pattern text-neutral-900 font-medium">
        <div className="w-8 h-8 border-3 border-neutral-800 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-bold text-sm">Loading Student Portal...</p>
      </div>
    );
  }

  // On the main student flow screen (/student), render the complete 5-stage student experience
  if (pathname === '/student') {
    return <>{children}</>;
  }

  // If authenticated and authorized student
  if (isAuthenticated && user?.role === 'student') {
    return (
      <div className="min-h-screen bg-[#F2F2F7] max-w-md mx-auto border-x border-black/[0.06] relative flex flex-col font-sans selection:bg-[#007AFF] selection:text-white">
        <main className="pb-20 flex-1">{children}</main>
        <StudentBottomNav />
      </div>
    );
  }

  return null;
}
