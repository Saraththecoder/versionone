import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotAuthorized() {
  return (
    <div className="min-h-screen bg-grid-pattern flex flex-col items-center justify-center p-4 font-sans selection:bg-neutral-900 selection:text-white">
      <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.05)] text-center space-y-4">
        <div className="w-12 h-12 bg-amber-50 border border-amber-300 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Access Restricted</h2>
        <p className="text-xs text-neutral-500 font-normal leading-relaxed">
          You do not have administrative or driver privileges to access this transit portal. Please
          switch to your authorized account.
        </p>
        <div className="pt-2">
          <Link href="/login">
            <button className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-full shadow-xs flex items-center justify-center gap-2 transition-all">
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Portal Selection</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
