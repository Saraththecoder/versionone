'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LiveLocation, RouteDocument, StopDocument } from '@/lib/schemas';

// Fix Leaflet default icon paths in Next.js just in case
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3201/3201844.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const stopIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Helper component to auto-fit map bounds to route/stops
function MapBounds({
  stops,
  liveLocation,
}: {
  stops: StopDocument[];
  liveLocation: LiveLocation | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map((s) => [s.latitude, s.longitude]));
      if (liveLocation) {
        bounds.extend([liveLocation.latitude, liveLocation.longitude]);
      }
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (liveLocation) {
      map.setView([liveLocation.latitude, liveLocation.longitude], 16);
    }
  }, [map, stops, liveLocation]);
  return null;
}

// Marker component for the bus that updates reactively
function BusMarker({ location }: { location: LiveLocation }) {
  return (
    <Marker position={[location.latitude, location.longitude]} icon={busIcon} zIndexOffset={1000}>
      <Popup>
        <div className="text-center font-bold">Bus is here</div>
        <div className="text-sm text-gray-600">
          Speed: {Math.round((location.speed || 0) * 3.6)} km/h
        </div>
      </Popup>
    </Marker>
  );
}

interface MapProps {
  liveLocation?: LiveLocation | null;
  route?: RouteDocument | null;
  stops?: StopDocument[];
}

const emptySubscribe = () => () => {};

export const Map = React.memo(function Map({ liveLocation, route, stops = [] }: MapProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted)
    return (
      <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
        Loading Map...
      </div>
    );

  // Default fallback center
  const defaultCenter: [number, number] = [13.6288, 79.4192];
  const polylinePositions: [number, number][] = stops.map((s) => [s.latitude, s.longitude]);

  return (
    <div className="h-full w-full z-0 relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapBounds stops={stops} liveLocation={liveLocation || null} />

        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} color="#3b82f6" weight={4} opacity={0.7} />
        )}

        {stops.map((stop) => (
          <Marker key={stop.stopId} position={[stop.latitude, stop.longitude]} icon={stopIcon}>
            <Popup>{stop.name}</Popup>
          </Marker>
        ))}

        {liveLocation && <BusMarker location={liveLocation} />}
      </MapContainer>
    </div>
  );
});
