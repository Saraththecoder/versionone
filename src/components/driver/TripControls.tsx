'use client';

import { HealthStatus } from '@/hooks/useDriverTracking';
import { Play, Square } from 'lucide-react';
import { triggerFeedback } from '@/lib/feedback';

interface TripControlsProps {
  isTracking: boolean;
  health: HealthStatus;
  selectedBusId: string | null;
  onStart: () => void;
  onStop: () => void;
}

export function TripControls({
  isTracking,
  health,
  selectedBusId,
  onStart,
  onStop,
}: TripControlsProps) {
  const isHealthy = health.gpsEnabled && health.accuracyAcceptable;
  const canStart = !isTracking && selectedBusId && isHealthy;

  return (
    <div className="space-y-2">
      {!isTracking ? (
        <button
          onClick={() => {
            triggerFeedback('success');
            onStart();
          }}
          disabled={!canStart}
          className="w-full h-12 text-[15px] font-heading font-semibold bg-[#34C759] hover:bg-[#2DB84D] text-white rounded-[14px] shadow-xs flex items-center justify-center gap-2 motion-press disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Ride</span>
        </button>
      ) : (
        <button
          onClick={() => {
            triggerFeedback('stop');
            onStop();
          }}
          className="w-full h-12 text-[15px] font-heading font-semibold bg-[#FF3B30] hover:bg-[#E53429] text-white rounded-[14px] shadow-xs flex items-center justify-center gap-2 motion-press cursor-pointer"
        >
          <Square className="w-4 h-4 fill-white" />
          <span>End Ride</span>
        </button>
      )}

      {!isHealthy && !isTracking && (
        <p className="text-center text-[11px] text-[#FF3B30] font-medium">
          Allow Location Services access to broadcast GPS.
        </p>
      )}
      {!selectedBusId && isHealthy && !isTracking && (
        <p className="text-center text-[11px] text-[#8E8E93] font-medium">
          Select an assigned bus above.
        </p>
      )}
    </div>
  );
}
