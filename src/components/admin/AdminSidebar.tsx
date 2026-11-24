'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { LayoutDashboard, BusFront, Users, UserCog, Route, MapPin, Radio, Bus } from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Fleet Command', icon: LayoutDashboard },
    { href: '/admin/broadcasts', label: 'Broadcast Alerts', icon: Radio },
    { href: '/admin/buses', label: 'Fleet Buses', icon: BusFront },
    { href: '/admin/drivers', label: 'Driver Roster', icon: UserCog },
    { href: '/admin/students', label: 'Student Passes', icon: Users },
    { href: '/admin/routes', label: 'Routes & Polylines', icon: Route },
    { href: '/admin/stops', label: 'Geofenced Stops', icon: MapPin },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200/80 flex-shrink-0 min-h-screen hidden md:flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-neutral-200/80">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-xs">
              <Bus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 tracking-tight leading-tight">
                AITS Transit
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">Operations Center</p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold',
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                )}
              >
                <Icon
                  className={clsx('w-4 h-4', isActive ? 'text-amber-400' : 'text-neutral-400')}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-neutral-200/80 text-[11px] font-medium text-neutral-400 text-center">
        AITS Transport Dept &copy; {new Date().getFullYear()}
      </div>
    </aside>
  );
}
