import { LiveLocation } from './schemas';
import { RealtimeLocationRepository } from '@/repositories/RealtimeLocationRepository';

export class GPSSimulator {
  private intervalId: NodeJS.Timeout | null = null;
  private currentIndex = 0;
  private isRunning = false;

  constructor(
    private busId: string,
    private driverId: string,
    private route: [number, number][], // Array of [lat, lng]
    private intervalMs: number = 2000 // Emit every 2 seconds by default
  ) {}

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.currentIndex = 0;

    // Set bus active
    RealtimeLocationRepository.setBusActiveStatus(this.busId, true).catch(console.error);

    this.intervalId = setInterval(async () => {
      if (this.currentIndex >= this.route.length) {
        this.stop('Route completed');
        return;
      }

      const [lat, lng] = this.route[this.currentIndex];

      const loc: LiveLocation = {
        latitude: lat,
        longitude: lng,
        speed: 10 + Math.random() * 5, // Simulated speed between 10-15 m/s
        heading: 90, // Fixed heading for simple simulation
        accuracy: 10,
        updatedAt: Date.now(),
        active: true,
        driverId: this.driverId,
      };

      try {
        await RealtimeLocationRepository.updateLocation(this.busId, loc);
      } catch (err) {
        console.error('Simulation failed to upload', err);
      }

      this.currentIndex++;
    }, this.intervalMs);
  }

  stop(reason?: string) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    RealtimeLocationRepository.stopTracking(this.busId).catch(console.error);
    if (reason) {
      console.log(`Simulator stopped: ${reason}`);
    }
  }
}
