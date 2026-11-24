'use client';

export type FeedbackType = 'tap' | 'select' | 'success' | 'stop' | 'warning' | 'error';

const SOUND_STORAGE_KEY = 'aits_sound_enabled';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextCtor) {
      audioCtx = new AudioContextCtor();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(SOUND_STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
    window.dispatchEvent(new CustomEvent('aits-sound-change', { detail: enabled }));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Triggers native mobile haptic vibration where supported.
 */
export function triggerHaptic(type: FeedbackType = 'tap'): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    switch (type) {
      case 'tap':
        navigator.vibrate(8);
        break;
      case 'select':
        navigator.vibrate(14);
        break;
      case 'success':
        navigator.vibrate([12, 40, 22]);
        break;
      case 'stop':
        navigator.vibrate([18, 35, 14]);
        break;
      case 'warning':
        navigator.vibrate([20, 40, 20]);
        break;
      case 'error':
        navigator.vibrate([30, 35, 30, 35, 45]);
        break;
    }
  } catch {
    // Vibration blocked or unsupported
  }
}

function playTone(
  ctx: AudioContext,
  freqStart: number,
  freqEnd: number,
  durationMs: number,
  delayMs = 0,
  volume = 0.06,
  wave: OscillatorType = 'sine'
) {
  const startTime = ctx.currentTime + delayMs / 1000;
  const endTime = startTime + durationMs / 1000;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = wave;
  osc.frequency.setValueAtTime(freqStart, startTime);
  if (freqEnd !== freqStart) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), endTime);
  }

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(endTime + 0.01);
}

/**
 * Plays soft Apple-inspired acoustic sound effects using the Web Audio API.
 */
export function playSound(type: FeedbackType = 'tap'): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    switch (type) {
      case 'tap':
        // Soft subtle iOS keyboard/tock pop
        playTone(ctx, 520, 260, 28, 0, 0.045, 'sine');
        break;
      case 'select':
        // Crisp upward bubble pop (bus number / option select)
        playTone(ctx, 580, 880, 48, 0, 0.06, 'sine');
        break;
      case 'success':
        // Clean Apple Pay style two-note major chime (C6 -> E6)
        playTone(ctx, 1046.5, 1046.5, 95, 0, 0.065, 'sine');
        playTone(ctx, 1318.5, 1318.5, 160, 75, 0.07, 'sine');
        break;
      case 'stop':
        // Warm descending completion tone (G5 -> C5)
        playTone(ctx, 783.99, 783.99, 85, 0, 0.065, 'sine');
        playTone(ctx, 523.25, 523.25, 150, 75, 0.065, 'sine');
        break;
      case 'warning':
        // Soft alert double ping
        playTone(ctx, 880, 880, 70, 0, 0.06, 'triangle');
        playTone(ctx, 880, 880, 90, 100, 0.06, 'triangle');
        break;
      case 'error':
        // Soft low thud double pulse
        playTone(ctx, 220, 150, 90, 0, 0.07, 'triangle');
        playTone(ctx, 180, 120, 120, 100, 0.07, 'triangle');
        break;
    }
  } catch {
    // Ignore audio context errors
  }
}

/**
 * Combined Haptic Touch + Sound Effect feedback for UI interactions.
 */
export function triggerFeedback(type: FeedbackType = 'tap'): void {
  triggerHaptic(type);
  playSound(type);
}
