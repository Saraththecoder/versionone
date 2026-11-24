'use client';

import { HealthStatus } from '@/hooks/useDriverTracking';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export function HealthCheckPanel({ health }: { health: HealthStatus }) {
  const items = [
    { label: 'Internet Connection', valid: health.isOnline },
    { label: 'GPS Permission', valid: health.gpsEnabled },
    { label: 'Location Accuracy', valid: health.accuracyAcceptable },
  ];

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
        <h3 className="font-bold text-neutral-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
          <span>Device Readiness</span>
        </h3>
        <span className="text-[10px] font-bold uppercase text-amber-900 bg-amber-100 border border-amber-300/80 px-2 py-0.5 rounded-full">
          Pre-Trip Check
        </span>
      </div>

      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 bg-neutral-50/70 border border-neutral-200/60 rounded-xl"
          >
            <span className="text-xs font-medium text-neutral-700">{item.label}</span>
            {item.valid ? (
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
              </span>
            ) : (
              <span className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-600" /> FAIL
              </span>
            )}
          </div>
        ))}
      </div>

      {health.error && (
        <p className="text-xs text-red-800 bg-red-50 border border-red-200 p-2.5 rounded-xl font-medium">
          {health.error}
        </p>
      )}
    </div>
  );
}
