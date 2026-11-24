import { FirestoreService } from '@/services/FirestoreService';
import { DriverDocument } from '@/lib/schemas';

const COLLECTION = 'drivers';

export class DriverRepository {
  static async getDriver(uid: string): Promise<DriverDocument | null> {
    return await FirestoreService.getDocument<DriverDocument>(COLLECTION, uid);
  }

  static async getAllDrivers(): Promise<DriverDocument[]> {
    return await FirestoreService.getDocuments<DriverDocument>(COLLECTION);
  }

  static async updateDriver(uid: string, data: Partial<DriverDocument>): Promise<void> {
    await FirestoreService.updateDocument<DriverDocument>(COLLECTION, uid, data);
  }

  static async updateCurrentBus(uid: string, busId: string | null): Promise<void> {
    await FirestoreService.updateDocument<DriverDocument>(COLLECTION, uid, {
      currentBusId: busId,
    });
  }

  static async deleteDriver(uid: string): Promise<void> {
    await FirestoreService.deleteDocument(COLLECTION, uid);
  }
}
