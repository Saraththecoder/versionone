import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GPSSimulator } from './simulator';
import { RealtimeLocationRepository } from '@/repositories/RealtimeLocationRepository';

// Mock the repository to prevent actual Firebase calls
vi.mock('@/repositories/RealtimeLocationRepository', () => ({
  RealtimeLocationRepository: {
    setBusActiveStatus: vi.fn().mockResolvedValue(undefined),
    updateLocation: vi.fn().mockResolvedValue(undefined),
    stopTracking: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('GPSSimulator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('emits locations and stops at the end of the route', async () => {
    const route: [number, number][] = [
      [10, 20],
      [11, 21],
    ];

    const simulator = new GPSSimulator('BUS1', 'DRV1', route, 1000);
    simulator.start();

    expect(RealtimeLocationRepository.setBusActiveStatus).toHaveBeenCalledWith('BUS1', true);

    // Advance 1 second
    await vi.advanceTimersByTimeAsync(1000);
    expect(RealtimeLocationRepository.updateLocation).toHaveBeenCalledTimes(1);

    // Advance another second
    await vi.advanceTimersByTimeAsync(1000);
    expect(RealtimeLocationRepository.updateLocation).toHaveBeenCalledTimes(2);

    // Advance past end
    await vi.advanceTimersByTimeAsync(1000);
    expect(RealtimeLocationRepository.stopTracking).toHaveBeenCalledWith('BUS1');
  });
});
