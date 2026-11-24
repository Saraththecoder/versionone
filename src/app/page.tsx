'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bus, ChevronRight, Shield } from 'lucide-react';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { triggerFeedback } from '@/lib/feedback';

export default function Home() {
  const router = useRouter();

  const navigateWithFeedback = (path: string, type: 'tap' | 'select' = 'select') => {
    triggerFeedback(type);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] font-sans flex flex-col justify-between">
      {/* 1. APPLE FROSTED NAVIGATION BAR */}
      <header className="sticky top-0 z-50 apple-glass border-b border-black/[0.06]">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" onClick={() => triggerFeedback('tap')} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[#007AFF] text-white flex items-center justify-center shadow-xs">
              <Bus className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-heading font-semibold text-[15px] tracking-[-0.01em] text-[#1C1C1E]">
              AITS Transit
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <SoundToggle />
            <Link
              href="/admin"
              onClick={() => triggerFeedback('tap')}
              className="text-[13px] font-medium text-[#007AFF] hover:opacity-75 flex items-center gap-1 transition-opacity"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. CENTERED APPLE MOBILE VIEW */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] space-y-5">
          {/* Small Intro Hero Card */}
          <div className="apple-card rounded-[28px] p-6 text-center space-y-4">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 bg-[#34C759]/12 text-[#248A3D] px-3 py-1 rounded-full text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                Live GPS Active
              </span>
            </div>

            <div className="w-40 h-28 mx-auto flex items-center justify-center">
              <img
                src="/images/splash-bus.png"
                alt="AITS School Bus"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>

            <div className="space-y-1.5">
              <h1 className="font-heading text-[26px] font-bold tracking-[-0.025em] text-[#1C1C1E] leading-tight">
                Campus Bus Tracking
              </h1>
              <p className="text-[13px] text-[#8E8E93] leading-snug max-w-[280px] mx-auto">
                Real-time shuttle locations, stop timings, and effortless daily boarding.
              </p>
            </div>
          </div>

          {/* Two Role Options Side-by-Side with 3D Avatars */}
          <div className="space-y-2.5">
            <div className="text-center">
              <h2 className="font-heading text-[16px] font-semibold text-[#1C1C1E]">
                Who are you?
              </h2>
              <p className="text-[12px] text-[#8E8E93]">Choose an option below to get started</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: I am a Student */}
              <button
                onClick={() => navigateWithFeedback('/student', 'select')}
                className="apple-card bg-[#FFF5F7] hover:bg-[#FFEBEF] border border-[#FFD6DF] rounded-[24px] p-4 flex flex-col items-center justify-between text-center min-h-[168px] motion-press cursor-pointer group"
              >
                <div className="w-20 h-20 flex items-center justify-center mb-1">
                  <img
                    src="/images/icon-student.png"
                    alt="I am a Student"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-150"
                  />
                </div>
                <div className="w-full">
                  <div className="font-heading text-[14px] font-semibold text-[#1C1C1E] flex items-center justify-center gap-1">
                    <span>I am a Student</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8E8E93] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5">Track Bus & Map</p>
                </div>
              </button>

              {/* Option 2: I am a Driver */}
              <button
                onClick={() => navigateWithFeedback('/driver', 'select')}
                className="apple-card bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FED7AA] rounded-[24px] p-4 flex flex-col items-center justify-between text-center min-h-[168px] motion-press cursor-pointer group"
              >
                <div className="w-20 h-20 flex items-center justify-center mb-1">
                  <img
                    src="/images/icon-driver.png"
                    alt="I am a Driver"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-150"
                  />
                </div>
                <div className="w-full">
                  <div className="font-heading text-[14px] font-semibold text-[#1C1C1E] flex items-center justify-center gap-1">
                    <span>I am a Driver</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8E8E93] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-[#8E8E93] mt-0.5">Start & End Ride</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. MINIMAL APPLE FOOTER */}
      <footer className="py-4 text-center">
        <p className="text-[11px] text-[#8E8E93] font-medium">
          Annamacharya Institute of Technology and Sciences
        </p>
      </footer>
    </div>
  );
}
