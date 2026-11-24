import { RealtimeService } from '@/services/RealtimeService';
import { LiveLocation } from '@/lib/schemas';

const BASE_PATH = 'live';

export class RealtimeLocationRepository {
  /**
   * Overwrite location data for a bus. As per spec, no history is kept.
   */
  static async updateLocation(busId: string, location: LiveLocation): Promise<void> {
    const path = `${BASE_PATH}/${busId}`;
    await RealtimeService.setData(path, location);
  }

  static async getLocation(busId: string): Promise<LiveLocation | null> {
    const path = `${BASE_PATH}/${busId}`;
    return await RealtimeService.getData<LiveLocation>(path);
  }

  static async setBusActiveStatus(busId: string, active: boolean): Promise<void> {
    const path = `${BASE_PATH}/${busId}`;
    await RealtimeService.updateData<LiveLocation>(path, { active });
  }

  static async stopTracking(busId: string): Promise<void> {
    const path = `${BASE_PATH}/${busId}`;
    // Could just update active: false, or delete entirely. We'll set active to false.
    await RealtimeService.updateData<LiveLocation>(path, { active: false });
  }
}
