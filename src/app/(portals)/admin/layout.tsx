'use client';

import { useAuth } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, logout } = useAuth();
  const { user } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && pathname !== '/admin') {
        router.push('/admin');
      } else if (isAuthenticated && user?.role !== 'admin' && pathname !== '/admin') {
        router.push('/not-authorized');
      } else if (isAuthenticated && user?.role === 'admin' && pathname === '/admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [isAuthenticated, loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grid-pattern text-neutral-900 font-medium">
        <div className="w-8 h-8 border-3 border-neutral-800 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="font-bold text-sm">Loading Admin Command Center...</span>
      </div>
    );
  }

  // Login page fallback
  if (pathname === '/admin' && !isAuthenticated) {
    return <>{children}</>;
  }

  if (isAuthenticated && user?.role === 'admin') {
    return (
      <div className="min-h-screen flex bg-grid-pattern font-sans selection:bg-neutral-900 selection:text-white">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Mobile Header */}
          <header className="bg-white border-b border-neutral-200/80 h-16 flex items-center justify-between px-4 md:hidden">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger
                  render={
                    <button className="w-9 h-9 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-800">
                      <Menu className="w-4 h-4" />
                    </button>
                  }
                />
                <SheetContent
                  side="left"
                  className="p-0 bg-white border-r border-neutral-200 w-64 text-neutral-900"
                >
                  <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                  <div className="mt-2">
                    <AdminSidebar />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <h1 className="font-bold text-sm text-neutral-900">AITS Admin</h1>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-xs px-3 py-1.5 rounded-full border border-neutral-300"
            >
              Logout
            </button>
          </header>

          {/* Desktop Header Topbar */}
          <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200/80 h-16 hidden md:flex items-center justify-between px-8 z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-amber-900 bg-amber-100 border border-amber-300/80 px-2 py-0.5 rounded-full">
                  Admin Session
                </span>
                <h2 className="text-sm font-bold text-neutral-900">
                  AITS Transport Command Center
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-neutral-50 border border-neutral-200 px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-700">
                <span className="font-bold text-neutral-900">{user.name}</span> (Administrator)
              </div>
              <button
                onClick={logout}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-xs transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  return null;
}
