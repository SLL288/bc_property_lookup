"use client";

import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import type { FeatureCollection, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export type MapViewProps = {
  lat: number;
  lon: number;
  municipalityGeoJSON?: FeatureCollection;
  alrGeoJSON?: FeatureCollection;
  zoningGeometry?: GeoJSON.Feature | null;
  floodGeometry?: GeoJSON.Feature | null;
};

export default function MapViewClient({ lat, lon, zoningGeometry, alrGeoJSON, floodGeometry }: MapViewProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const position = useMemo(() => ({ lat, lng: lon }), [lat, lon]);

  if (!mounted) return <div className="h-64 w-full rounded-xl bg-gray-100" />;

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={false}
      className="h-72 w-full rounded-xl border border-gray-200 shadow"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position as any}>
        <Popup>Approximate location</Popup>
      </Marker>
      {zoningGeometry && (
        <GeoJSON data={zoningGeometry as any} pathOptions={{ color: "#2563eb", weight: 2, fillOpacity: 0.05 }} />
      )}
      {floodGeometry && (
        <GeoJSON data={floodGeometry as any} pathOptions={{ color: "#dc2626", weight: 1, fillOpacity: 0.05 }} />
      )}
      {alrGeoJSON && <GeoJSON data={alrGeoJSON as any} pathOptions={{ color: "#16a34a", weight: 1, fillOpacity: 0.04 }} />}
    </MapContainer>
  );
}
