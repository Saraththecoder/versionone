import { FirestoreService } from '@/services/FirestoreService';
import { RouteDocument } from '@/lib/schemas';
import { where } from 'firebase/firestore';

const COLLECTION = 'routes';

export class RouteRepository {
  static async getRoute(routeId: string): Promise<RouteDocument | null> {
    return await FirestoreService.getDocument<RouteDocument>(COLLECTION, routeId);
  }

  static async getAllRoutes(): Promise<RouteDocument[]> {
    return await FirestoreService.getDocuments<RouteDocument>(COLLECTION);
  }

  static async getRouteByBus(busId: string): Promise<RouteDocument | null> {
    const routes = await FirestoreService.getDocuments<RouteDocument>(COLLECTION, [
      where('busId', '==', busId),
    ]);
    return routes.length > 0 ? routes[0] : null;
  }

  static async addRoute(route: RouteDocument): Promise<void> {
    await FirestoreService.setDocument<RouteDocument>(COLLECTION, route.routeId, route, false);
  }

  static async updateRoute(routeId: string, data: Partial<RouteDocument>): Promise<void> {
    await FirestoreService.updateDocument<RouteDocument>(COLLECTION, routeId, data);
  }

  static async deleteRoute(routeId: string): Promise<void> {
    await FirestoreService.deleteDocument(COLLECTION, routeId);
  }
}
