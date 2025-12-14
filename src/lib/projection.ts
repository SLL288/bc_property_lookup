import proj4 from "proj4";

// NAD83 / UTM zone 10N (EPSG:26910)
const EPSG26910 = "+proj=utm +zone=10 +datum=NAD83 +units=m +no_defs";

export type UtmCoord = { x: number; y: number };

export function toUtm10(lon: number, lat: number): UtmCoord {
  const [x, y] = proj4("WGS84", EPSG26910, [lon, lat]);
  return { x, y };
}
