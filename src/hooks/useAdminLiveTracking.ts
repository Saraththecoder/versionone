'use client';

import { useEffect, useState } from 'react';
import { rtdb } from '@/lib/firebase/rtdb';
import { ref, onValue, off } from 'firebase/database';
import { LiveLocation } from '@/lib/schemas';
import { logger } from '@/lib/logger';

export function useAdminLiveTracking() {
  const [locations, setLocations] = useState<Record<string, LiveLocation>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!rtdb) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }
    const liveRef = ref(rtdb, `live`);

    const unsubscribe = onValue(
      liveRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setLocations(snapshot.val());
        } else {
          setLocations({});
        }
        setLoading(false);
      },
      (error) => {
        logger.error('Admin Realtime subscription error:', error);
        setLoading(false);
      }
    );

    return () => {
      off(liveRef, 'value', unsubscribe);
    };
  }, []);

  return { locations, loading };
}
