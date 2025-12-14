"use client";

import { useState } from "react";
import { geocodeAddress } from "@/lib/geocode";
import { isInsideAlr } from "@/lib/geo";
import { MapView } from "@/components/MapView";
import alrGeoJSON from "../../../../../data/alr_simplified.geojson";

export function AlrLookup() {
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [status, setStatus] = useState<string>("Enter an address to check ALR status.");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("Looking up address...");
    setCoords(null);
    try {
      const res = await geocodeAddress(query);
      setCoords({ lat: res.lat, lon: res.lon });
      const inside = isInsideAlr(res.lon, res.lat);
      setStatus(inside ? "Inside ALR" : "Outside ALR (based on placeholder layer)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
      setStatus("Enter an address to check ALR status.");
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">Check ALR status</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-base shadow-inner focus:border-brand focus:outline-none"
            placeholder="123 Main St, Vancouver, BC"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl bg-brand px-4 py-2 text-white shadow hover:bg-brand-dark"
          >
            Check
          </button>
        </div>
      </form>
      <p className="text-sm font-medium text-gray-800">{status}</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {coords && (
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            Coordinates: {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
          </p>
          <MapView lat={coords.lat} lon={coords.lon} alrGeoJSON={alrGeoJSON as any} />
          <p className="text-xs text-gray-600">
            ALR boundaries are simplified placeholders for Metro Vancouver; verify on official ALC maps.
          </p>
        </div>
      )}
    </div>
  );
}
