import { VANCOUVER_ZONING } from "./vancouver";
import { BURNABY_ZONING } from "./burnaby";
import { SURREY_ZONING } from "./surrey";
import type { CityId, ZoningItem } from "./types";

export function getManifest(city: CityId): ZoningItem[] {
  if (city === "vancouver") return VANCOUVER_ZONING;
  if (city === "burnaby") return BURNABY_ZONING;
  return SURREY_ZONING;
}

export function getZoning(city: CityId, code: string): ZoningItem | null {
  const c = code.toLowerCase();
  return getManifest(city).find((z) => z.code === c) ?? null;
}
