import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import municipalitiesJson from "../../data/metro_munis.geojson";
import alrJson from "../../data/alr_simplified.geojson";

export type MunicipalityFeature = Feature<Polygon | MultiPolygon, { name: string; region?: string }>;

const municipalityFeatures = (municipalitiesJson as FeatureCollection) as FeatureCollection<
  Polygon | MultiPolygon,
  { name: string; region?: string }
>;

const alrFeatures = (alrJson as FeatureCollection) as FeatureCollection<Polygon | MultiPolygon, { name?: string }>;

export const findMunicipality = (lon: number, lat: number) => {
  const point: [number, number] = [lon, lat];
  for (const feature of municipalityFeatures.features) {
    if (!feature || !feature.geometry) continue;
    if (booleanPointInPolygon(point, feature)) {
      return {
        name: feature.properties?.name ?? "Unknown",
        region: feature.properties?.region ?? "Metro Vancouver"
      };
    }
  }
  return null;
};

export const isInsideAlr = (lon: number, lat: number) => {
  const point: [number, number] = [lon, lat];
  for (const feature of alrFeatures.features) {
    if (!feature || !feature.geometry) continue;
    if (booleanPointInPolygon(point, feature)) {
      return true;
    }
  }
  return false;
};
