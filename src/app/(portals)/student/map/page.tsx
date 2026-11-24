'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRealtimeLocation } from '@/hooks/useRealtimeLocation';
import { useBusRoute } from '@/hooks/useBusRoute';
import { StudentDocument } from '@/lib/schemas';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WifiOff, ChevronLeft, Phone, Bus, X } from 'lucide-react';
import Link from 'next/link';
import { triggerFeedback } from '@/lib/feedback';

const Map = dynamic(() => import('@/components/map/Map').then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#F2F2F7] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-7 h-7 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin mb-3" />
      <p className="font-heading font-medium text-[13px] text-[#8E8E93]">Loading Map...</p>
    </div>
  ),
});

interface BusOption {
  num: number;
  plate: string;
  route: string;
}

const BUSES: BusOption[] = [
  { num: 1, plate: 'AP 04 TX 1022', route: 'Route 01: Kadapa Central → AITS' },
  { num: 2, plate: 'AP 04 TX 4589', route: 'Route 02: Tirupati Bypass → AITS' },
  { num: 3, plate: 'AP 04 TX 8812', route: 'Route 03: Rayachoty Town → AITS' },
  { num: 4, plate: 'AP 04 TX 9044', route: 'Route 04: Badvel Route → AITS' },
  { num: 5, plate: 'AP 04 TX 3311', route: 'Route 05: Rajampet Local → AITS' },
  { num: 6, plate: 'AP 04 TX 7744', route: 'Route 06: Nandalur Shuttle → AITS' },
];

export default function StudentMapPage() {
  const { user } = useCurrentUser();
  const studentUser = user as StudentDocument | null;
  const initialPlate = studentUser?.assignedBusId || 'AP 04 TX 4589';

  const [selectedBus, setSelectedBus] = useState<BusOption>(
    BUSES.find((b) => b.plate === initialPlate) || BUSES[1]
  );
  const [showBusPicker, setShowBusPicker] = useState(false);
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const { location, loading: locLoading } = useRealtimeLocation(selectedBus.plate);
  const { route, stops } = useBusRoute(selectedBus.plate);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full bg-[#F2F2F7] flex flex-col overflow-hidden">
      {/* Apple Maps Floating Top Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex items-center justify-between pointer-events-none">
        <Link href="/student/dashboard" className="pointer-events-auto">
          <button className="w-10 h-10 apple-glass border border-black/[0.08] rounded-full flex items-center justify-center shadow-sm motion-press cursor-pointer">
            <ChevronLeft className="w-5 h-5 text-[#007AFF]" />
          </button>
        </Link>

        {/* Bus Selector Pill */}
        <button
          onClick={() => {
            triggerFeedback('tap');
            setShowBusPicker(!showBusPicker);
          }}
          className="pointer-events-auto apple-glass border border-black/[0.08] rounded-full px-3.5 py-1.5 shadow-sm flex items-center gap-2 cursor-pointer motion-press"
        >
          <span className="w-5 h-5 rounded-full bg-[#007AFF] text-white font-display font-bold text-[11px] tabular-nums flex items-center justify-center">
            {selectedBus.num}
          </span>
          <span className="font-heading text-[13px] font-semibold text-[#1C1C1E]">
            {selectedBus.plate}
          </span>
          {location?.active ? (
            <span className="text-[11px] text-[#248A3D] font-semibold tabular-nums">
              • {Math.round((location.speed || 0) * 3.6)} km/h
            </span>
          ) : (
            <span className="text-[11px] text-[#8E8E93] font-medium">• At Rest</span>
          )}
        </button>
      </div>

      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="absolute top-16 left-4 right-4 z-[500] bg-[#FF3B30] text-white p-2.5 rounded-[14px] shadow-sm flex items-center justify-center gap-2 font-semibold text-[12px]">
          <WifiOff className="w-3.5 h-3.5" />
          Offline • Showing Last Cached Location
        </div>
      )}

      {/* Map Surface */}
      <div className="flex-1 h-full w-full">
        <Map liveLocation={location} route={route} stops={stops} />
      </div>

      {/* Frosted Bottom Sheet Card */}
      <div className="absolute bottom-4 left-4 right-4 z-[500] apple-glass border border-black/[0.08] p-4 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 min-w-0 pr-2">
            <span className="text-[11px] font-semibold text-[#007AFF]">
              Bus {selectedBus.num} • {location?.active ? 'Live GPS' : 'Scheduled'}
            </span>
            <h3 className="font-heading font-semibold text-[15px] text-[#1C1C1E] truncate">
              {selectedBus.route}
            </h3>
            <p className="text-[12px] text-[#8E8E93]">
              {locLoading
                ? 'Syncing location...'
                : location?.active
                  ? 'Updating every 3 seconds'
                  : 'Awaiting driver start'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowBusPicker(true)}
              className="h-9 px-3.5 bg-[#007AFF] hover:bg-[#0066D6] text-white rounded-full flex items-center gap-1.5 font-heading font-semibold text-[12px] motion-press cursor-pointer"
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Bus No</span>
            </button>
            <a
              href="tel:+919848022334"
              className="w-9 h-9 bg-[#34C759]/14 text-[#248A3D] rounded-full flex items-center justify-center motion-press"
              title="Call Transport Desk"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Apple Sheet Modal: Choose Bus No (1-6) */}
      {showBusPicker && (
        <div className="absolute inset-0 z-[600] bg-black/30 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-sm bg-[#F2F2F7] rounded-[28px] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-heading text-[18px] font-bold text-[#1C1C1E]">Choose Bus No</h3>
                <p className="text-[12px] text-[#8E8E93]">Select bus number to view on map</p>
              </div>
              <button
                onClick={() => setShowBusPicker(false)}
                className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {BUSES.map((bus) => {
                const isSelected = selectedBus.num === bus.num;
                return (
                  <button
                    key={bus.num}
                    onClick={() => {
                      triggerFeedback('select');
                      setSelectedBus(bus);
                      setShowBusPicker(false);
                    }}
                    className={`apple-card flex flex-col items-center justify-center p-3.5 rounded-[20px] transition-all motion-press cursor-pointer ${
                      isSelected ? 'ring-2 ring-[#007AFF]' : ''
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full font-display font-bold text-[19px] tabular-nums flex items-center justify-center mb-2 ${
                        isSelected ? 'bg-[#007AFF] text-white' : 'bg-[#F2F2F7] text-[#1C1C1E]'
                      }`}
                    >
                      {bus.num}
                    </div>
                    <span className="font-heading text-[12px] font-semibold text-[#1C1C1E]">
                      {bus.plate}
                    </span>
                    <span className="text-[10px] text-[#8E8E93] truncate max-w-[120px]">
                      {bus.route.split(':')[1]?.trim() || bus.route}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
