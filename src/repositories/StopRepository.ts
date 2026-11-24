import { FirestoreService } from '@/services/FirestoreService';
import { StopDocument } from '@/lib/schemas';

const COLLECTION = 'stops';

export class StopRepository {
  static async getStop(stopId: string): Promise<StopDocument | null> {
    return await FirestoreService.getDocument<StopDocument>(COLLECTION, stopId);
  }

  static async getAllStops(): Promise<StopDocument[]> {
    return await FirestoreService.getDocuments<StopDocument>(COLLECTION);
  }

  static async addStop(stop: StopDocument): Promise<void> {
    await FirestoreService.setDocument<StopDocument>(COLLECTION, stop.stopId, stop, false);
  }

  static async updateStop(stopId: string, data: Partial<StopDocument>): Promise<void> {
    await FirestoreService.updateDocument<StopDocument>(COLLECTION, stopId, data);
  }

  static async deleteStop(stopId: string): Promise<void> {
    await FirestoreService.deleteDocument(COLLECTION, stopId);
  }
}
