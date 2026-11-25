'use client';

import { useEffect, useState } from 'react';
import { useAdminLiveTracking } from '@/hooks/useAdminLiveTracking';
import { BusRepository } from '@/repositories/BusRepository';
import { getActiveBusInviteCode, rotateBusInviteCode } from '@/lib/inviteCode';
import { triggerFeedback } from '@/lib/feedback';
import dynamic from 'next/dynamic';
import {
  Activity,
  Bus,
  Users,
  Map as MapIcon,
  Radio,
  BellRing,
  ChevronRight,
  KeyRound,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const AdminLiveMap = dynamic(
  () => import('@/components/map/AdminLiveMap').then((mod) => mod.AdminLiveMap),
  { ssr: false }
);

export default function AdminDashboard() {
  const { locations, loading: locLoading } = useAdminLiveTracking();
  const [totalBuses, setTotalBuses] = useState(0);
  const [inviteCode, setInviteCode] = useState('...');
  const [rotatingCode, setRotatingCode] = useState(false);

  useEffect(() => {
    BusRepository.getAllBuses()
      .then((buses) => setTotalBuses(buses.length))
      .catch(console.error);
    getActiveBusInviteCode().then(setInviteCode).catch(console.error);
  }, []);

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard?.writeText(inviteCode);
      triggerFeedback('select');
      toast.success(`Copied invite code ${inviteCode}`);
    } catch {
      toast.info(`Active code: ${inviteCode}`);
    }
  };

  const handleRotateInviteCode = async () => {
    setRotatingCode(true);
    try {
      const next = await rotateBusInviteCode();
      setInviteCode(next);
      triggerFeedback('success');
      toast.success(`Rotated Bus Invite Code to ${next}`);
    } catch {
      triggerFeedback('error');
      toast.error('Failed to rotate invite code.');
    } finally {
      setRotatingCode(false);
    }
  };

  const activeTripsCount = Object.values(locations).filter((loc) => loc.active).length;

  return (
    <div className="space-y-6">
      {/* 1. macOS / iPadOS Header */}
      <div className="apple-card rounded-[24px] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#34C759]/14 text-[#248A3D] px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
            <span>Fleet Telemetry Online</span>
          </div>
          <h1 className="font-heading text-[28px] font-bold tracking-[-0.025em] text-[#1C1C1E]">
            Fleet Command
          </h1>
          <p className="text-[13px] text-[#8E8E93]">
            Monitoring active college buses across Rayachoty, Kadapa, and Tirupati routes
          </p>
        </div>

        <Link href="/admin/broadcasts">
          <button className="bg-[#007AFF] hover:bg-[#0066D6] text-white font-heading font-semibold text-[13px] px-4 py-2.5 rounded-full shadow-xs flex items-center gap-2 motion-press cursor-pointer">
            <BellRing className="w-4 h-4" />
            <span>Dispatch Broadcast</span>
          </button>
        </Link>
      </div>

      {/* 2. Apple Health / Summary Widget Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card rounded-[22px] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#8E8E93]">Active Trips</span>
            <div className="w-8 h-8 rounded-full bg-[#34C759]/14 text-[#248A3D] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-[32px] font-bold text-[#1C1C1E] tabular-nums">
            {locLoading ? '–' : activeTripsCount}
          </div>
          <p className="text-[12px] text-[#8E8E93]">Broadcasting GPS live</p>
        </div>

        <div className="apple-card rounded-[22px] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#8E8E93]">Total Fleet</span>
            <div className="w-8 h-8 rounded-full bg-[#007AFF]/14 text-[#007AFF] flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-[32px] font-bold text-[#1C1C1E] tabular-nums">
            {totalBuses || 18}
          </div>
          <p className="text-[12px] text-[#8E8E93]">Registered buses</p>
        </div>

        <Link href="/admin/drivers" className="block group">
          <div className="apple-card rounded-[22px] p-5 space-y-2 hover:ring-2 hover:ring-[#007AFF]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#8E8E93]">Drivers</span>
              <div className="w-8 h-8 rounded-full bg-[#FF9500]/14 text-[#FF9500] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="font-heading text-[18px] font-semibold text-[#1C1C1E] flex items-center gap-1 pt-1">
              <span>Roster</span>
              <ChevronRight className="w-4 h-4 text-[#C7C7CC] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[12px] text-[#8E8E93]">Duty allocations</p>
          </div>
        </Link>

        <Link href="/admin/routes" className="block group">
          <div className="apple-card rounded-[22px] p-5 space-y-2 hover:ring-2 hover:ring-[#007AFF]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#8E8E93]">Routes</span>
              <div className="w-8 h-8 rounded-full bg-[#5856D6]/14 text-[#5856D6] flex items-center justify-center">
                <MapIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="font-heading text-[18px] font-semibold text-[#1C1C1E] flex items-center gap-1 pt-1">
              <span>Network</span>
              <ChevronRight className="w-4 h-4 text-[#C7C7CC] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-[12px] text-[#8E8E93]">Stops & timetables</p>
          </div>
        </Link>
      </div>

      {/* 3. Rotating Bus Invite Code Control */}
      <div className="apple-card rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FF9500]/14 text-[#FF9500] flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">
              Student Signup Gate
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="font-display text-[20px] font-bold tracking-wide text-[#1C1C1E] tabular-nums">
                {inviteCode}
              </h3>
              <span className="text-[10px] font-semibold text-[#248A3D] bg-[#34C759]/12 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[12px] text-[#8E8E93]">
              Share on bus notice boards; rotate anytime to block outsiders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyInviteCode}
            className="h-10 px-4 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] text-[13px] font-semibold flex items-center gap-1.5 motion-press cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
          <button
            type="button"
            disabled={rotatingCode}
            onClick={handleRotateInviteCode}
            className="h-10 px-4 rounded-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white text-[13px] font-semibold flex items-center gap-1.5 motion-press cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${rotatingCode ? 'animate-spin' : ''}`} />
            <span>Rotate Code</span>
          </button>
        </div>
      </div>

      {/* 4. Live Telemetry Map */}
      <div className="apple-card rounded-[24px] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#007AFF] text-white rounded-full flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading text-[15px] font-semibold text-[#1C1C1E]">
                Live Fleet Map
              </h3>
              <p className="text-[12px] text-[#8E8E93]">
                Real-time GPS coordinates via Firebase RTDB
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold bg-[#34C759]/14 text-[#248A3D] px-3 py-1 rounded-full tabular-nums">
            {activeTripsCount} Active
          </span>
        </div>
        <div className="p-0">
          <AdminLiveMap locations={locations} />
        </div>
      </div>
    </div>
  );
}
