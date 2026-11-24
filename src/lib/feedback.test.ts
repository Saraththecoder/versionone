import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  triggerHaptic,
  playSound,
  triggerFeedback,
  isSoundEnabled,
  setSoundEnabled,
} from './feedback';

describe('feedback (haptics & sound)', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, val: string) => {
        store[key] = String(val);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    });
    vi.restoreAllMocks();
  });

  it('defaults sound enabled to true and persists toggle', () => {
    expect(isSoundEnabled()).toBe(true);
    setSoundEnabled(false);
    expect(isSoundEnabled()).toBe(false);
    setSoundEnabled(true);
    expect(isSoundEnabled()).toBe(true);
  });

  it('invokes navigator.vibrate with expected patterns without throwing', () => {
    const vibrateMock = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateMock,
      configurable: true,
    });

    triggerHaptic('tap');
    expect(vibrateMock).toHaveBeenCalledWith(8);

    triggerHaptic('success');
    expect(vibrateMock).toHaveBeenCalledWith([12, 40, 22]);

    triggerHaptic('error');
    expect(vibrateMock).toHaveBeenCalledWith([30, 35, 30, 35, 45]);
  });

  it('executes triggerFeedback safely even when AudioContext is unavailable', () => {
    expect(() => {
      playSound('tap');
      triggerFeedback('select');
      triggerFeedback('stop');
      triggerFeedback('warning');
    }).not.toThrow();
  });
});
