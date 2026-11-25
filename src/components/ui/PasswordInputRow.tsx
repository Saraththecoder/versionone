'use client';

import { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { triggerFeedback } from '@/lib/feedback';

interface PasswordInputRowProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInputRow = forwardRef<HTMLInputElement, PasswordInputRowProps>(
  function PasswordInputRow({ className = '', ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex items-center px-4 h-12 gap-3">
        <Lock className="w-4 h-4 text-[#8E8E93] shrink-0" />
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={`w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => {
            triggerFeedback('tap');
            setVisible((v) => !v);
          }}
          className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-black/[0.04] transition-colors shrink-0 cursor-pointer"
          aria-label={visible ? 'Hide password' : 'Show password'}
          title={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    );
  }
);
