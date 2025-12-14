import type * as GeoJSON from "geojson";

export type ArcgisPointQueryParams = {
  baseUrl: string;
  layerId: string | number;
  lat: number;
  lng: number;
  outFields?: string[];
  resultRecordCount?: number;
  returnGeometry?: boolean;
  outSR?: string;
};

const buildPointQueryUrl = ({
  baseUrl,
  layerId,
  lat,
  lng,
  outFields = ["*"],
  resultRecordCount = 1,
  returnGeometry = false,
  outSR = "4326"
}: ArcgisPointQueryParams) => {
  const url = new URL(`${baseUrl}/${layerId}/query`);
  url.search = new URLSearchParams({
    f: "json",
    geometry: `${lng},${lat}`, // ArcGIS expects x,y = lon,lat
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: outFields.join(","),
    returnGeometry: returnGeometry ? "true" : "false",
    outSR,
    resultRecordCount: String(resultRecordCount)
  }).toString();
  return url.toString();
};

export async function arcgisQueryByPoint<T = Record<string, unknown>>(
  params: ArcgisPointQueryParams
): Promise<{ attributes: T | null; raw: any; geometry?: GeoJSON.Feature | null }> {
  const url = buildPointQueryUrl(params);
  const res = await fetch(url);
  const raw = await res.json();
  const feature = raw?.features?.[0];
  const attributes = feature?.attributes ?? null;
  let geometry: GeoJSON.Feature | null = null;
  if (params.returnGeometry && feature?.geometry?.rings) {
    geometry = {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: feature.geometry.rings } as GeoJSON.Polygon,
      properties: {}
    };
  }
  return { attributes, raw, geometry };
}

export async function arcgisLayerMetadata(baseUrl: string, layerId: string | number) {
  const url = `${baseUrl}/${layerId}?f=pjson`;
  const res = await fetch(url);
  return res.json();
}
