import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-grid-pattern flex flex-col items-center justify-center p-4 font-sans selection:bg-neutral-900 selection:text-white">
      <div className="w-full max-w-md bg-white border border-neutral-200/90 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.05)] text-center space-y-4">
        <div className="w-12 h-12 bg-amber-50 border border-amber-300 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle className="w-6 h-6 stroke-[2.2]" />
        </div>
        <h2 className="text-3xl font-extrabold text-neutral-900">404</h2>
        <h3 className="text-base font-bold text-neutral-800">Page Not Found</h3>
        <p className="text-xs text-neutral-500 font-normal leading-relaxed">
          The transit stop or screen you are looking for has been relocated or does not exist.
        </p>
        <div className="pt-2">
          <Link href="/">
            <button className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-full shadow-xs flex items-center justify-center gap-2 transition-all">
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Return to Transit Home</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
