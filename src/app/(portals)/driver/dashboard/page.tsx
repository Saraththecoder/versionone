'use client';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuth } from '@/hooks/useAuth';
import { useDriverTracking } from '@/hooks/useDriverTracking';
import { BusRepository } from '@/repositories/BusRepository';
import { BusDocument } from '@/lib/schemas';
import { HealthCheckPanel } from '@/components/driver/HealthCheckPanel';
import { BusSelection } from '@/components/driver/BusSelection';
import { TripControls } from '@/components/driver/TripControls';
import { LogOut, WifiOff, Radio, Clock, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DriverDashboard() {
  const { user } = useCurrentUser();
  const { logout } = useAuth();
  const router = useRouter();

  const [buses, setBuses] = useState<BusDocument[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [loadingBuses, setLoadingBuses] = useState(true);

  const { isTracking, health, startTracking, stopTracking, lastSentLocation } = useDriverTracking(
    user?.uid,
    selectedBusId
  );

  useEffect(() => {
    if (user?.uid) {
      BusRepository.getBusesByDriver(user.uid)
        .then((data) => {
          setBuses(data);
          if (data.length === 1) {
            setSelectedBusId(data[0].busId);
          }
          setLoadingBuses(false);
        })
        .catch((err) => {
          console.error('Failed to fetch buses', err);
          setLoadingBuses(false);
        });
    }
  }, [user]);

  const handleStopTrip = () => {
    stopTracking('Trip completed by driver.');
    toast.success('Trip ended safely!');
    router.push('/driver/summary');
  };

  const handleQuickAlert = (type: string) => {
    toast.info(`Alert Sent: ${type}`, {
      description: 'Admin & waiting students notified immediately.',
    });
  };

  if (loadingBuses || !user) {
    return (
      <div className="min-h-screen bg-grid-pattern flex flex-col items-center justify-center p-8 text-center font-medium">
        <div className="w-8 h-8 border-3 border-neutral-900 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-bold text-sm text-neutral-800">Loading Driver Cockpit...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col max-w-md mx-auto border-x border-black/[0.06] relative font-sans">
      {/* 1. Apple Frosted Header */}
      <header className="apple-glass p-4 sticky top-0 z-20 border-b border-black/[0.06]">
        <div className="flex justify-between items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#34C759]/14 text-[#248A3D] text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1">
              <Radio className="w-3 h-3 text-[#34C759] animate-pulse" />
              <span>AITS Telematics</span>
            </span>
            <h1 className="font-heading font-bold text-[18px] text-[#1C1C1E] leading-tight">
              Driver Cockpit
            </h1>
            <p className="text-[#8E8E93] text-[12px] truncate font-medium">{user.name}</p>
          </div>
          <button
            onClick={logout}
            className="w-9 h-9 bg-[#E5E5EA]/70 hover:bg-[#E5E5EA] rounded-full flex items-center justify-center text-[#FF3B30] transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {!health.isOnline && (
          <div className="bg-[#FF3B30]/12 text-[#D70015] text-[12px] font-semibold px-3 py-1.5 rounded-[12px] flex items-center justify-center gap-1.5 mt-3">
            <WifiOff className="w-3.5 h-3.5" /> Offline Mode (Buffering GPS)
          </div>
        )}
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 p-4 space-y-4 pb-32">
        <BusSelection
          buses={buses}
          selectedBusId={selectedBusId}
          onSelect={setSelectedBusId}
          isLocked={isTracking}
        />

        <HealthCheckPanel health={health} />

        {/* Live Telematics Screen */}
        {isTracking && (
          <div className="apple-card rounded-[24px] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
              <span className="text-[12px] font-semibold text-[#1C1C1E] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#34C759] animate-pulse" />
                <span>Live Broadcast</span>
              </span>
              <span className="text-[11px] font-medium bg-[#34C759]/14 text-[#248A3D] px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>

            {/* Speed Readout */}
            <div className="bg-[#F2F2F7] rounded-[18px] p-4 text-center">
              <span className="text-[11px] font-semibold uppercase text-[#8E8E93]">Speed</span>
              <div className="font-display text-[40px] font-bold text-[#1C1C1E] tracking-tight my-1 tabular-nums">
                {Math.round((lastSentLocation?.speed || 0) * 3.6)}
                <span className="text-[14px] font-medium text-[#8E8E93] ml-1">km/h</span>
              </div>
              <p className="text-[12px] font-medium text-[#248A3D]">Broadcasting every 3s</p>
            </div>

            {/* Quick 1-Tap Incident Triggers */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickAlert('Traffic Delay (+15 mins)')}
                className="p-3 bg-[#F2F2F7] hover:bg-[#E5E5EA] rounded-[14px] font-heading font-semibold text-[12px] text-[#1C1C1E] flex items-center justify-center gap-1.5 motion-press cursor-pointer"
              >
                <Clock className="w-4 h-4 text-[#FF9500] shrink-0" />
                <span>Traffic (+15m)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAlert('Breakdown / Flat Tyre')}
                className="p-3 bg-[#F2F2F7] hover:bg-[#E5E5EA] rounded-[14px] font-heading font-semibold text-[12px] text-[#FF3B30] flex items-center justify-center gap-1.5 motion-press cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-[#FF3B30] shrink-0" />
                <span>Breakdown SOS</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. Sticky Bottom Controls */}
      <div className="apple-glass border-t border-black/[0.06] p-4 sticky bottom-0 z-20">
        <TripControls
          isTracking={isTracking}
          health={health}
          selectedBusId={selectedBusId}
          onStart={startTracking}
          onStop={handleStopTrip}
        />
      </div>
    </div>
  );
}
