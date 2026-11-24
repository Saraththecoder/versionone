'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BusFront,
  Route,
  Bell,
  Users,
  MapPin,
  GraduationCap,
  Bus,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/buses', label: 'Fleet Buses', icon: BusFront },
    { href: '/admin/drivers', label: 'Drivers', icon: Users },
    { href: '/admin/routes', label: 'Routes', icon: Route },
    { href: '/admin/stops', label: 'Stops', icon: MapPin },
    { href: '/admin/students', label: 'Students', icon: GraduationCap },
    { href: '/admin/broadcasts', label: 'Broadcasts', icon: Bell },
  ];

  return (
    <aside className="w-60 border-r border-black/[0.06] apple-glass min-h-screen p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-5">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-[8px] bg-[#007AFF] text-white flex items-center justify-center shadow-xs">
            <Bus className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-heading font-semibold text-[15px] tracking-[-0.01em] text-[#1C1C1E]">
            AITS Transit
          </span>
        </Link>

        <nav className="space-y-1 text-[13px] font-medium">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] transition-all ${
                  isActive
                    ? 'bg-[#007AFF] text-white font-semibold shadow-xs'
                    : 'text-[#1C1C1E] hover:bg-black/[0.04]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white stroke-[2.2]' : 'text-[#8E8E93] stroke-[1.9]'
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="text-[11px] text-[#8E8E93] px-2 font-medium">
        AITS Transport &copy; {new Date().getFullYear()}
      </div>
    </aside>
  );
}
