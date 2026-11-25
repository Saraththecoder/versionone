import { rtdb } from '@/lib/firebase/rtdb';
import { ref, set, get, update, remove } from 'firebase/database';

export class RealtimeService {
  /**
   * Get data at a specific path
   */
  static async getData<T>(path: string): Promise<T | null> {
    if (!rtdb) return null;
    const dbRef = ref(rtdb, path);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val() as T;
    }
    return null;
  }

  /**
   * Set data at a specific path (overwrites existing data)
   */
  static async setData<T>(path: string, data: T): Promise<void> {
    if (!rtdb) return;
    const dbRef = ref(rtdb, path);
    await set(dbRef, data);
  }

  /**
   * Update specific child keys at a path
   */
  static async updateData<T extends object>(path: string, data: Partial<T>): Promise<void> {
    if (!rtdb) return;
    const dbRef = ref(rtdb, path);
    await update(dbRef, data);
  }

  /**
   * Remove data at a specific path
   */
  static async removeData(path: string): Promise<void> {
    if (!rtdb) return;
    const dbRef = ref(rtdb, path);
    await remove(dbRef);
  }
}
