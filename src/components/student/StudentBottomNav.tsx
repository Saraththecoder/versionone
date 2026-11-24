'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map as MapIcon, Route, Bell, CreditCard } from 'lucide-react';
import { triggerFeedback } from '@/lib/feedback';

export function StudentBottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/student/dashboard', label: 'Home', icon: Home },
    { href: '/student/map', label: 'Map', icon: MapIcon },
    { href: '/student/routes', label: 'Routes', icon: Route },
    { href: '/student/notifications', label: 'Alerts', icon: Bell },
    { href: '/student/profile', label: 'Pass', icon: CreditCard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 apple-glass border-t border-black/[0.08]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2 pb-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => triggerFeedback('tap')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors motion-press ${
                isActive ? 'text-[#007AFF]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] font-medium tracking-tight mt-0.5">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
