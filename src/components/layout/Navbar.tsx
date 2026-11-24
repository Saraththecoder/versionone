import Link from 'next/link';
import { Bus, ChevronRight } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="h-14 apple-glass border-b border-black/[0.06] sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-[8px] bg-[#007AFF] text-white flex items-center justify-center shadow-xs">
          <Bus className="w-4 h-4 stroke-[2.2]" />
        </div>
        <span className="font-heading font-semibold text-[15px] tracking-[-0.01em] text-[#1C1C1E]">
          AITS Transit
        </span>
      </Link>

      <div className="flex items-center gap-5 text-[13px] font-medium text-[#8E8E93]">
        <Link
          href="/student/routes"
          className="hover:text-[#1C1C1E] transition-colors hidden sm:inline"
        >
          Timetables
        </Link>
        <Link
          href="/student/map"
          className="hover:text-[#1C1C1E] transition-colors hidden sm:inline"
        >
          Live Map
        </Link>
        <Link href="/login">
          <button className="bg-[#007AFF] hover:bg-[#0066D6] text-white text-[13px] font-semibold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-xs cursor-pointer motion-press">
            <span>Portals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </nav>
  );
}
