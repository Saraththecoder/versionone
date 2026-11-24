'use client';

import { useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, triggerFeedback } from '@/lib/feedback';

function subscribeSound(callback: () => void) {
  window.addEventListener('aits-sound-change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('aits-sound-change', callback);
    window.removeEventListener('storage', callback);
  };
}

export function SoundToggle() {
  const enabled = useSyncExternalStore(
    subscribeSound,
    () => isSoundEnabled(),
    () => true
  );

  const toggle = () => {
    const next = !enabled;
    setSoundEnabled(next);
    if (next) {
      triggerFeedback('select');
    } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(8);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? 'Mute sound effects' : 'Enable sound effects'}
      title={enabled ? 'Sound On' : 'Sound Muted'}
      className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-[#1C1C1E] transition-colors motion-press cursor-pointer"
    >
      {enabled ? (
        <Volume2 className="w-4 h-4 text-[#007AFF]" />
      ) : (
        <VolumeX className="w-4 h-4 text-[#8E8E93]" />
      )}
    </button>
  );
}
