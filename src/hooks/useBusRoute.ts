'use client';

import { useState, useEffect } from 'react';
import { RouteRepository } from '@/repositories/RouteRepository';
import { StopRepository } from '@/repositories/StopRepository';
import { RouteDocument, StopDocument } from '@/lib/schemas';

export function useBusRoute(busId: string | null | undefined) {
  const [route, setRoute] = useState<RouteDocument | null>(null);
  const [stops, setStops] = useState<StopDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRoute() {
      if (!busId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const foundRoute = await RouteRepository.getRouteByBus(busId);
        if (foundRoute && isMounted) {
          setRoute(foundRoute);

          // Fetch all stops and filter by those in the route
          const allStops = await StopRepository.getAllStops();
          const routeStops = allStops.filter((stop) => foundRoute.stops.includes(stop.stopId));

          // Optional: order them if order logic is required, assuming they are just points for now
          if (isMounted) setStops(routeStops);
        } else {
          if (isMounted) {
            setRoute(null);
            setStops([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch route', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRoute();

    return () => {
      isMounted = false;
    };
  }, [busId]);

  return { route, stops, loading };
}
