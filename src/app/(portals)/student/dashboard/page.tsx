'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useFirestoreDocument } from '@/hooks/useFirestoreDocument';
import { BusDocument, StudentDocument } from '@/lib/schemas';
import { useRealtimeLocation } from '@/hooks/useRealtimeLocation';
import { useBusRoute } from '@/hooks/useBusRoute';
import {
  BusFront,
  MapPin,
  Navigation,
  Clock,
  Phone,
  AlertTriangle,
  ChevronRight,
  Compass,
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useCurrentUser();
  const studentUser = user as StudentDocument | null;
  const busId = studentUser?.assignedBusId || null;

  const { data: bus } = useFirestoreDocument<BusDocument>('buses', busId);
  const { location, loading: locLoading } = useRealtimeLocation(busId);
  const { route, stops } = useBusRoute(busId);

  if (!user) return null;

  return (
    <div className="p-4 space-y-5 pt-5 bg-[#F2F2F7] min-h-screen">
      {/* 1. Apple Large Title Header */}
      <header className="flex items-center justify-between px-1">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8E8E93]">
            AITS Transit
          </p>
          <h1 className="font-heading text-[28px] font-bold tracking-[-0.025em] text-[#1C1C1E] leading-tight">
            Hello, {studentUser?.rollNo || user.name.split(' ')[0]}
          </h1>
        </div>

        <Link href="/student/profile">
          <div className="w-10 h-10 rounded-full bg-[#007AFF] text-white font-heading font-semibold flex items-center justify-center text-[13px] shadow-xs motion-press">
            {(studentUser?.rollNo || user.name).slice(0, 2)}
          </div>
        </Link>
      </header>

      {/* 2. Assigned Bus Widget */}
      {!busId ? (
        <div className="apple-card rounded-[24px] p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-[#1C1C1E]">
            <AlertTriangle className="w-5 h-5 text-[#FF9500]" />
            <h2 className="font-heading text-[16px] font-semibold">No Bus Assigned</h2>
          </div>
          <p className="text-[13px] text-[#8E8E93] leading-snug">
            You do not have a bus allocated yet. Select a bus on the map or browse timetables.
          </p>
          <Link href="/student/map" className="block pt-1">
            <button className="w-full h-11 bg-[#007AFF] text-white font-heading font-semibold text-[14px] rounded-[12px] motion-press cursor-pointer">
              Choose Bus on Map
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main Bus Status Card */}
          <div className="apple-card rounded-[24px] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#007AFF]/12 text-[#007AFF] rounded-2xl flex items-center justify-center">
                  <BusFront className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase text-[#8E8E93] tracking-wide">
                    Assigned Shuttle
                  </span>
                  <h3 className="font-heading text-[17px] font-bold text-[#1C1C1E] leading-tight">
                    {bus?.registrationNumber || busId}
                  </h3>
                </div>
              </div>

              {locLoading ? (
                <span className="bg-[#F2F2F7] text-[#8E8E93] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  Syncing
                </span>
              ) : location?.active ? (
                <span className="bg-[#34C759]/14 text-[#248A3D] text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="bg-[#F2F2F7] text-[#8E8E93] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  At Rest
                </span>
              )}
            </div>

            {/* Active Route Row */}
            <div className="flex items-center gap-2.5 bg-[#F2F2F7] p-3 rounded-[14px]">
              <Compass className="w-4 h-4 text-[#007AFF] shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-[#8E8E93] uppercase">Active Route</p>
                <h4 className="font-heading text-[13px] font-semibold text-[#1C1C1E] truncate">
                  {route?.name || 'Route 02: Tirupati Bypass → AITS'}
                </h4>
              </div>
            </div>

            {/* Live Telemetry Widgets */}
            {location && location.active ? (
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#F2F2F7] p-3.5 rounded-[14px]">
                  <span className="text-[11px] font-medium text-[#8E8E93] flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[#34C759]" /> Speed
                  </span>
                  <p className="font-display text-[22px] font-bold text-[#1C1C1E] mt-0.5 tabular-nums">
                    {Math.round((location.speed || 0) * 3.6)}{' '}
                    <span className="text-[12px] font-medium text-[#8E8E93]">km/h</span>
                  </p>
                </div>

                <div className="bg-[#F2F2F7] p-3.5 rounded-[14px]">
                  <span className="text-[11px] font-medium text-[#8E8E93] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#007AFF]" /> Last Sync
                  </span>
                  <p className="font-heading text-[15px] font-semibold text-[#1C1C1E] mt-1.5 tabular-nums">
                    {new Date(location.updatedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#F2F2F7] p-3 rounded-[14px] text-center">
                <p className="text-[12px] text-[#8E8E93] font-medium">
                  Trip not active yet. Morning pickup starts at 07:15 AM.
                </p>
              </div>
            )}

            <Link href="/student/map" className="block">
              <button className="w-full h-11 bg-[#007AFF] hover:bg-[#0066D6] text-white font-heading font-semibold text-[15px] rounded-[13px] shadow-xs flex items-center justify-center gap-2 motion-press cursor-pointer">
                <MapPin className="w-4 h-4" />
                <span>Track Bus Live</span>
              </button>
            </Link>
          </div>

          {/* 3. Grouped Inset Stops List */}
          {stops.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-3">
                <h3 className="text-[12px] font-semibold uppercase tracking-wide text-[#8E8E93]">
                  Route Stops ({stops.length})
                </h3>
                <Link
                  href="/student/routes"
                  className="text-[12px] font-medium text-[#007AFF] hover:opacity-75"
                >
                  All Timetables
                </Link>
              </div>

              <div className="apple-card rounded-[20px] overflow-hidden divide-y divide-black/[0.06]">
                {stops.slice(0, 4).map((stop, index) => (
                  <div key={stop.stopId} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#F2F2F7] text-[#1C1C1E] flex items-center justify-center text-[11px] font-semibold tabular-nums">
                        {index + 1}
                      </span>
                      <span className="font-medium text-[14px] text-[#1C1C1E]">{stop.name}</span>
                    </div>
                    <span className="text-[12px] text-[#8E8E93]">Scheduled</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Transport Desk Contact Card */}
          <div className="apple-card rounded-[20px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#34C759]/14 text-[#248A3D] flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#8E8E93]">Transport Desk</p>
                <p className="font-heading text-[14px] font-semibold text-[#1C1C1E] tabular-nums">
                  +91 98480 22334
                </p>
              </div>
            </div>
            <a
              href="tel:+919848022334"
              className="bg-[#34C759] hover:bg-[#2DB84D] text-white font-heading font-semibold text-[13px] px-4 py-1.5 rounded-full motion-press flex items-center gap-1"
            >
              <span>Call</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
