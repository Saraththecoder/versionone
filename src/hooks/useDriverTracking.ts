'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RealtimeLocationRepository } from '@/repositories/RealtimeLocationRepository';
import { LiveLocation } from '@/lib/schemas';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export interface HealthStatus {
  gpsEnabled: boolean;
  isOnline: boolean;
  accuracyAcceptable: boolean;
  supported: boolean;
  error?: string;
}

const DISTANCE_THRESHOLD = 25; // meters
const HEADING_THRESHOLD = 15; // degrees
const TIME_THRESHOLD_MOVING = 15000; // 15 seconds
const TIME_THRESHOLD_STATIONARY = 60000; // 60 seconds
const AUTO_STOP_STATIONARY = 30 * 60 * 1000; // 30 minutes
const AUTO_STOP_MAX_TIME = 6 * 60 * 60 * 1000; // 6 hours
const ACCEPTABLE_ACCURACY = 50; // strictly 50 meters

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dp / 2) * Math.sin(dp / 2) +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function useDriverTracking(driverId: string | undefined, busId: string | null) {
  const [isTracking, setIsTracking] = useState(false);
  const [health, setHealth] = useState<HealthStatus>({
    gpsEnabled: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    accuracyAcceptable: false,
    supported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  });

  const watcherIdRef = useRef<number | null>(null);
  const lastSentLocationRef = useRef<LiveLocation | null>(null);
  const [lastSentLocation, setLastSentLocation] = useState<LiveLocation | null>(null);
  const pendingOfflineLocationRef = useRef<LiveLocation | null>(null);

  const tripStartedAtRef = useRef<number | null>(null);
  const lastMovedAtRef = useRef<number | null>(null);
  const autoStopIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopTracking = useCallback(
    async (reason?: string) => {
      if (watcherIdRef.current !== null) {
        navigator.geolocation.clearWatch(watcherIdRef.current);
        watcherIdRef.current = null;
      }
      if (autoStopIntervalRef.current) {
        clearInterval(autoStopIntervalRef.current);
        autoStopIntervalRef.current = null;
      }

      setIsTracking(false);
      lastSentLocationRef.current = null;
      setLastSentLocation(null);
      pendingOfflineLocationRef.current = null;

      if (busId) {
        try {
          await RealtimeLocationRepository.stopTracking(busId);
          logger.info(`Stopped tracking for bus ${busId}`);
        } catch (err) {
          logger.error('Failed to update RTDB on stop', err);
        }
      }

      if (reason) {
        toast.info(`Trip ended: ${reason}`);
      }
    },
    [busId]
  );

  useEffect(() => {
    const handleOnline = async () => {
      setHealth((h) => ({ ...h, isOnline: true }));
      if (pendingOfflineLocationRef.current && busId && isTracking) {
        try {
          await RealtimeLocationRepository.updateLocation(busId, pendingOfflineLocationRef.current);
          lastSentLocationRef.current = pendingOfflineLocationRef.current;
          setLastSentLocation(pendingOfflineLocationRef.current);
          pendingOfflineLocationRef.current = null;
          logger.info('Flushed offline location buffer');
        } catch (err) {
          logger.error('Failed to sync offline location', err);
        }
      }
    };

    const handleOffline = () => {
      setHealth((h) => ({ ...h, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [busId, isTracking]);

  useEffect(() => {
    if (!health.supported) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHealth((h) => ({
          ...h,
          gpsEnabled: true,
          accuracyAcceptable: pos.coords.accuracy <= ACCEPTABLE_ACCURACY,
        }));
      },
      (err) => {
        setHealth((h) => ({
          ...h,
          gpsEnabled: false,
          error: err.message,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [health.supported]);

  const startTracking = async () => {
    if (!driverId || !busId) {
      toast.error('Missing Driver or Bus assignment.');
      return;
    }
    if (!health.supported) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsTracking(true);
    tripStartedAtRef.current = Date.now();
    lastMovedAtRef.current = Date.now();

    watcherIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, speed, heading, accuracy } = pos.coords;
        const now = pos.timestamp; // Use device GPS timestamp

        setHealth((h) => ({
          ...h,
          gpsEnabled: true,
          accuracyAcceptable: accuracy <= ACCEPTABLE_ACCURACY,
        }));

        // STRICT FILTERING
        if (accuracy > ACCEPTABLE_ACCURACY) {
          logger.warn('Ignored GPS point: Poor accuracy', accuracy);
          return;
        }
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          logger.warn('Ignored GPS point: Invalid coordinates');
          return;
        }

        const lastLoc = lastSentLocationRef.current;

        if (lastLoc && now < lastLoc.updatedAt) {
          logger.warn('Ignored GPS point: Timestamp is older than last known');
          return;
        }

        const newLoc: LiveLocation = {
          latitude,
          longitude,
          speed: speed || 0,
          heading: heading || 0,
          accuracy,
          updatedAt: now,
          active: true,
          driverId,
        };

        let shouldSend = false;

        if (!lastLoc) {
          shouldSend = true;
        } else {
          const dist = getDistance(lastLoc.latitude, lastLoc.longitude, latitude, longitude);
          const timeElapsed = now - lastLoc.updatedAt;

          let headingChange = 0;
          if (heading !== null && lastLoc.heading !== null && lastLoc.heading !== undefined) {
            headingChange = Math.abs(heading - lastLoc.heading);
            if (headingChange > 180) headingChange = 360 - headingChange;
          }

          // BATTERY OPTIMIZATION
          const currentSpeed = speed || 0;
          const dynamicTimeThreshold =
            currentSpeed < 1 ? TIME_THRESHOLD_STATIONARY : TIME_THRESHOLD_MOVING;

          if (
            dist >= DISTANCE_THRESHOLD ||
            timeElapsed >= dynamicTimeThreshold ||
            headingChange >= HEADING_THRESHOLD
          ) {
            shouldSend = true;
          }

          if (dist > 10) {
            lastMovedAtRef.current = Date.now();
          }
        }

        if (shouldSend) {
          if (navigator.onLine) {
            try {
              await RealtimeLocationRepository.updateLocation(busId, newLoc);
              lastSentLocationRef.current = newLoc;
              setLastSentLocation(newLoc);
              pendingOfflineLocationRef.current = null;
              logger.info(
                `Updated location for bus ${busId}: [${latitude}, ${longitude}] (speed: ${speed}, heading: ${heading})`
              );
            } catch (err) {
              logger.error('Upload failed, buffering...', err);
              pendingOfflineLocationRef.current = newLoc;
            }
          } else {
            pendingOfflineLocationRef.current = newLoc;
            logger.info('Offline buffered location updated');
          }
        }
      },
      (err) => {
        logger.error('GPS Error', err);
        setHealth((h) => ({ ...h, gpsEnabled: false, error: err.message }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    autoStopIntervalRef.current = setInterval(() => {
      const now = Date.now();
      if (lastMovedAtRef.current && now - lastMovedAtRef.current > AUTO_STOP_STATIONARY) {
        stopTracking('Stationary for 30 minutes.');
      } else if (tripStartedAtRef.current && now - tripStartedAtRef.current > AUTO_STOP_MAX_TIME) {
        stopTracking('Maximum trip duration exceeded.');
      }
    }, 60000);
  };

  useEffect(() => {
    return () => {
      if (watcherIdRef.current !== null) {
        navigator.geolocation.clearWatch(watcherIdRef.current);
      }
      if (autoStopIntervalRef.current) {
        clearInterval(autoStopIntervalRef.current);
      }
    };
  }, []);

  return {
    isTracking,
    health,
    startTracking,
    stopTracking,
    lastSentLocation,
  };
}
