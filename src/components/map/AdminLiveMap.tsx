'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LiveLocation } from '@/lib/schemas';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Bus Icon
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3201/3201844.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Marker Component to isolate updates
function AdminBusMarker({ busId, location }: { busId: string; location: LiveLocation }) {
  if (!location.active) return null; // Don't plot inactive buses

  return (
    <Marker position={[location.latitude, location.longitude]} icon={busIcon}>
      <Popup className="min-w-[200px]">
        <div className="space-y-2">
          <div className="font-bold text-slate-900 border-b pb-1">Bus ID: {busId}</div>
          <div className="text-sm grid grid-cols-2 gap-x-2 gap-y-1">
            <span className="text-slate-500 font-medium">Driver:</span>
            <span className="text-slate-900">{location.driverId || 'Unassigned'}</span>
            <span className="text-slate-500 font-medium">Speed:</span>
            <span className="text-slate-900">{Math.round((location.speed || 0) * 3.6)} km/h</span>
            <span className="text-slate-500 font-medium">Last Sync:</span>
            <span className="text-slate-900">
              {new Date(location.updatedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// Auto fit bounds logic
function AdminMapBounds({ locations }: { locations: Record<string, LiveLocation> }) {
  const map = useMap();
  useEffect(() => {
    const activeLocs = Object.values(locations).filter((loc) => loc.active);
    if (activeLocs.length > 0) {
      const bounds = L.latLngBounds(activeLocs.map((l) => [l.latitude, l.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [map, locations]); // In a real scenario, this might zoom too aggressively on every tick. For MVP it's okay, or we could only run it once.
  return null;
}

interface AdminLiveMapProps {
  locations: Record<string, LiveLocation>;
}

const emptySubscribe = () => () => {};

export const AdminLiveMap = React.memo(function AdminLiveMap({ locations }: AdminLiveMapProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted)
    return (
      <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
        Loading Fleet Map...
      </div>
    );

  const defaultCenter: [number, number] = [13.6288, 79.4192];

  return (
    <div className="h-[500px] w-full z-0 relative rounded-xl overflow-hidden border shadow-sm">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Plot all active buses */}
        {Object.entries(locations).map(([busId, loc]) => (
          <AdminBusMarker key={busId} busId={busId} location={loc} />
        ))}
      </MapContainer>
    </div>
  );
});
