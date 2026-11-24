'use client';

import { BusDocument } from '@/lib/schemas';
import { Bus } from 'lucide-react';

interface BusSelectionProps {
  buses: BusDocument[];
  selectedBusId: string | null;
  onSelect: (busId: string) => void;
  isLocked: boolean;
}

export function BusSelection({ buses, selectedBusId, onSelect, isLocked }: BusSelectionProps) {
  if (buses.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
        <p className="text-xs font-semibold text-amber-900">
          No buses assigned to your driver ID today.
        </p>
      </div>
    );
  }

  if (buses.length === 1 || isLocked) {
    const bus = buses.find((b) => b.busId === selectedBusId) || buses[0];
    return (
      <div className="bg-white border border-neutral-200/90 p-4 rounded-2xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400 text-neutral-950 rounded-xl flex items-center justify-center font-bold shadow-xs">
            <Bus className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              Assigned Fleet Bus
            </p>
            <p className="text-base font-bold text-neutral-900">{bus.registrationNumber}</p>
          </div>
        </div>
        {isLocked && (
          <span className="text-[10px] font-bold bg-neutral-900 text-white px-2.5 py-1 rounded-full uppercase">
            Locked
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-xs space-y-2">
      <label htmlFor="bus-select" className="block text-xs font-bold uppercase text-neutral-600">
        Select Bus for this Shift
      </label>
      <select
        id="bus-select"
        value={selectedBusId || ''}
        onChange={(e) => onSelect(e.target.value)}
        disabled={isLocked}
        className="block w-full rounded-xl border border-neutral-300 text-xs font-medium p-3 bg-neutral-50/70 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="" disabled>
          -- Choose a Bus --
        </option>
        {buses.map((bus) => (
          <option key={bus.busId} value={bus.busId}>
            {bus.registrationNumber} ({bus.capacity} seats)
          </option>
        ))}
      </select>
    </div>
  );
}
