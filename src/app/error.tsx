'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-grid-pattern flex flex-col items-center justify-center p-4 font-sans selection:bg-neutral-900 selection:text-white">
      <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.05)] text-center space-y-4">
        <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Something went wrong</h2>
        <p className="text-xs text-neutral-500 font-normal leading-relaxed">
          An unexpected error occurred while rendering this transit screen.
        </p>
        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-full shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
