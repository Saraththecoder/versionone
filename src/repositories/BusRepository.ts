import { FirestoreService } from '@/services/FirestoreService';
import { BusDocument } from '@/lib/schemas';
import { where } from 'firebase/firestore';

const COLLECTION = 'buses';

export class BusRepository {
  static async getBus(busId: string): Promise<BusDocument | null> {
    return await FirestoreService.getDocument<BusDocument>(COLLECTION, busId);
  }

  static async getAllBuses(): Promise<BusDocument[]> {
    return await FirestoreService.getDocuments<BusDocument>(COLLECTION);
  }

  static async getActiveBuses(): Promise<BusDocument[]> {
    return await FirestoreService.getDocuments<BusDocument>(COLLECTION, [
      where('status', '==', 'active'),
    ]);
  }

  static async getBusesByDriver(driverId: string): Promise<BusDocument[]> {
    return await FirestoreService.getDocuments<BusDocument>(COLLECTION, [
      where('currentDriverId', '==', driverId),
    ]);
  }

  static async addBus(bus: BusDocument): Promise<void> {
    await FirestoreService.setDocument<BusDocument>(COLLECTION, bus.busId, bus, false);
  }

  static async updateBus(busId: string, data: Partial<BusDocument>): Promise<void> {
    await FirestoreService.updateDocument<BusDocument>(COLLECTION, busId, data);
  }

  static async deleteBus(busId: string): Promise<void> {
    await FirestoreService.deleteDocument(COLLECTION, busId);
  }
}
