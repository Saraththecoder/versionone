'use client';

import Link from 'next/link';
import { CheckCircle2, Clock, Navigation, ChevronRight } from 'lucide-react';

export default function DriverTripSummary() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-[400px] apple-card rounded-[28px] p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#34C759]/14 text-[#248A3D] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>
          <h1 className="font-heading text-[24px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
            Ride Completed
          </h1>
          <p className="text-[13px] text-[#8E8E93]">GPS broadcast stopped safely.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F2F2F7] p-4 rounded-[16px]">
            <span className="text-[11px] font-medium text-[#8E8E93] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#007AFF]" /> Duration
            </span>
            <p className="font-display text-[20px] font-bold text-[#1C1C1E] mt-1 tabular-nums">
              42 min
            </p>
          </div>

          <div className="bg-[#F2F2F7] p-4 rounded-[16px]">
            <span className="text-[11px] font-medium text-[#8E8E93] flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-[#34C759]" /> Avg Speed
            </span>
            <p className="font-display text-[20px] font-bold text-[#1C1C1E] mt-1 tabular-nums">
              36 km/h
            </p>
          </div>
        </div>

        <div className="bg-[#F2F2F7] rounded-[16px] overflow-hidden divide-y divide-black/[0.06] text-[13px]">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[#8E8E93]">Stops Covered</span>
            <span className="font-semibold text-[#1C1C1E] tabular-nums">6 of 6</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[#8E8E93]">Destination</span>
            <span className="font-semibold text-[#248A3D]">AITS Main Gate</span>
          </div>
        </div>

        <Link href="/driver" className="block">
          <button className="w-full h-12 bg-[#007AFF] hover:bg-[#0066D6] text-white font-heading font-semibold text-[15px] rounded-[14px] flex items-center justify-center gap-1 motion-press cursor-pointer">
            <span>Done</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
