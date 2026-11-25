'use client';

import { useEffect, useState } from 'react';
import { rtdb } from '@/lib/firebase/rtdb';
import { ref, onValue, off } from 'firebase/database';
import { LiveLocation } from '@/lib/schemas';
import { logger } from '@/lib/logger';

export function useRealtimeLocation(busId: string | null) {
  const [state, setState] = useState<{
    busId: string | null;
    location: LiveLocation | null;
  }>({
    busId: null,
    location: null,
  });

  useEffect(() => {
    if (!busId || !rtdb) return;

    const locationRef = ref(rtdb, `live/${busId}`);

    const unsubscribe = onValue(
      locationRef,
      (snapshot) => {
        setState({
          busId,
          location: snapshot.exists() ? (snapshot.val() as LiveLocation) : null,
        });
      },
      (error) => {
        logger.error('Realtime subscription error:', error);
        setState({ busId, location: null });
      }
    );

    return () => {
      off(locationRef, 'value', unsubscribe);
    };
  }, [busId]);

  const loading = Boolean(busId && rtdb && state.busId !== busId);
  const location = busId && rtdb && state.busId === busId ? state.location : null;

  return { location, loading };
}
