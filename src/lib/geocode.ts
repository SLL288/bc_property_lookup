import { getCached, setCached } from "./cache";

export type GeocodeResult = {
  address: string;
  lat: number;
  lon: number;
  displayName: string;
  city?: string;
};

export type GeocodeSuggestion = {
  address: string;
  lat: number;
  lon: number;
  displayName: string;
};

let lastRequestTime = 0;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeAddress = (input: string) =>
  input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/,?\s*bc$/i, ", BC")
    .replace(/,?\s*british columbia$/i, ", BC");

const cacheKey = (address: string) => `geocode:${address.toLowerCase()}`;

const throttle = async () => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 1000) {
    await sleep(1000 - elapsed);
  }
  lastRequestTime = Date.now();
};

export const geocodeAddress = async (input: string): Promise<GeocodeResult> => {
  const normalized = normalizeAddress(input);
  const key = cacheKey(normalized);
  const cached = getCached<GeocodeResult>(key);
  if (cached) return cached;

  await throttle();
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", normalized);
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "en");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "bc-property-intelligence-mvp/0.1"
    }
  });

  if (!res.ok) {
    throw new Error("Geocoding failed. Please try again.");
  }

  const data = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    address?: Record<string, string>;
  }>;

  if (!data.length) {
    throw new Error("No results found for that address.");
  }

  const { lat, lon, display_name, address: addr } = data[0];
  const result: GeocodeResult = {
    address: normalized,
    lat: Number(lat),
    lon: Number(lon),
    displayName: display_name,
    city: addr?.city || addr?.town || addr?.village || addr?.municipality || addr?.state_district
  };

  setCached(key, result);
  return result;
};

export const searchSuggestions = async (input: string): Promise<GeocodeSuggestion[]> => {
  const normalized = normalizeAddress(input);
  if (!normalized) return [];
  const key = cacheKey(`suggest:${normalized}`);
  const cached = getCached<GeocodeSuggestion[]>(key);
  if (cached) return cached;

  await throttle();
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", normalized);
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "en");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "bc-property-intelligence-mvp/0.1"
    }
  });

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
  }>;

  const suggestions = data.map((item) => ({
    address: normalizeAddress(item.display_name),
    displayName: item.display_name,
    lat: Number(item.lat),
    lon: Number(item.lon)
  }));

  setCached(key, suggestions);
  return suggestions;
};
