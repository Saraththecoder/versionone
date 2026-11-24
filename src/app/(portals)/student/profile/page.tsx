'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuth } from '@/hooks/useAuth';
import { StudentDocument } from '@/lib/schemas';
import { LogOut, Mail, Bus, QrCode, CheckCircle2, Calendar, Hash } from 'lucide-react';

export default function StudentProfile() {
  const { user } = useCurrentUser();
  const { logout } = useAuth();

  if (!user) return null;
  const studentUser = user as StudentDocument;

  return (
    <div className="p-4 pt-5 space-y-5 bg-[#F2F2F7] min-h-screen">
      {/* Apple Large Title Header */}
      <header className="px-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8E8E93]">
          Apple Wallet Style
        </p>
        <h1 className="font-heading text-[28px] font-bold tracking-[-0.025em] text-[#1C1C1E]">
          Bus Pass
        </h1>
      </header>

      {/* Apple Wallet Pass Card */}
      <div className="apple-card rounded-[28px] p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#007AFF] text-white font-heading font-bold rounded-full flex items-center justify-center text-[18px]">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-heading text-[16px] font-semibold text-[#1C1C1E]">{user.name}</h2>
              <div className="flex items-center gap-1 text-[12px] text-[#8E8E93] mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate max-w-[170px]">{user.email}</span>
              </div>
            </div>
          </div>

          <span className="bg-[#34C759]/14 text-[#248A3D] text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#F2F2F7] p-3.5 rounded-[14px] space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#8E8E93]">
              <Bus className="w-3.5 h-3.5 text-[#007AFF]" />
              <span>Bus</span>
            </div>
            <p className="font-heading text-[14px] font-semibold text-[#1C1C1E]">
              {studentUser.assignedBusId || 'AP 04 TX 4589'}
            </p>
          </div>

          <div className="bg-[#F2F2F7] p-3.5 rounded-[14px] space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#8E8E93]">
              <Calendar className="w-3.5 h-3.5 text-[#FF9500]" />
              <span>Valid</span>
            </div>
            <p className="font-heading text-[14px] font-semibold text-[#1C1C1E] tabular-nums">
              2026 – 2027
            </p>
          </div>
        </div>

        <div className="p-5 bg-[#F2F2F7] rounded-[20px] flex flex-col items-center justify-center space-y-2 text-center">
          <div className="w-32 h-32 bg-white rounded-[18px] flex items-center justify-center p-2 shadow-xs">
            <QrCode className="w-24 h-24 text-[#1C1C1E] stroke-[1.4]" />
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8E8E93] tabular-nums">
            <Hash className="w-3 h-3" />
            <span>AITS-TRAN-2026-X992</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#248A3D]">
          <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
          <span>Verified Annual Pass</span>
        </div>
      </div>

      {/* Sign Out Card */}
      <button
        onClick={logout}
        className="w-full h-12 apple-card rounded-[16px] text-[#FF3B30] font-heading font-semibold text-[15px] flex items-center justify-center gap-2 motion-press cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
}
