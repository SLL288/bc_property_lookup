import type * as GeoJSON from "geojson";

type ZoningHit = {
  code?: string;
  name?: string;
  raw?: Record<string, unknown>;
  geometry?: GeoJSON.Geometry | null;
};

type ArcGisConfig = {
  layerQueryUrls: string[];
  outFields?: string[];
  useUtm10?: boolean;
  inSR?: string;
  label?: string;
};

const zoningSources: Record<string, ArcGisConfig> = {
  Burnaby: {
    layerQueryUrls: [
      // Parcel/lot info with roll/address/PID. Keeping only layer 60 for now to avoid 400s on layer 42.
      "https://gis.burnaby.ca/arcgis/rest/services/BurnabyMap/BBY_PUBLIC_TOC/MapServer/60/query",
      // Zoning polygons with ZONECODE.
      "https://gis.burnaby.ca/arcgis/rest/services/BurnabyMap/BBY_PUBLIC_TOC/MapServer/42/query"
    ],
    outFields: ["LOT_ID", "LTO_PID", "ROLL_NUMBER", "ADDRESS", "PLAN", "DL", "BLOCK", "LOT", "HeritageStatus"],
    useUtm10: true,
    inSR: "26910"
  },
  Surrey: {
    layerQueryUrls: ["https://gisservices.surrey.ca/arcgis/rest/services/OpenData/MapServer/239/query"],
    outFields: ["ZONING_TEXT", "ZONING", "BY_LAW_01", "BY_LAW_02", "BY_LAW_03", "BY_LAW_04", "LOT_TYPE", "WEBLINK"],
    label: "Surrey"
  },
  Coquitlam: {
    layerQueryUrls: ["https://geodata.coquitlam.ca/arcgis/rest/services/Planning/MapServer/1/query"],
    outFields: ["ZoneCode", "ZoningName"],
    label: "Coquitlam"
  },
  "Port Coquitlam": {
    layerQueryUrls: ["https://citymap.portcoquitlam.ca/arcgis/rest/services/CityMap/MapServer/1/query"],
    outFields: ["ZONING", "ZONE_NAME"],
    label: "Port Coquitlam"
  }
};

export type ZoningResult = ZoningHit & { error?: string; source?: string };
type RawAttempt = {
  source: string;
  inSR: string;
  geometry: string;
  format: "comma" | "json";
  raw?: unknown;
  status?: number;
  statusText?: string;
  error?: string;
};

const pickValue = (attrs: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const val = attrs[key];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      return String(val);
    }
  }
  return undefined;
};

export const getZoningSource = (municipality?: string) => {
  if (!municipality) return null;
  const lower = municipality.toLowerCase();
  const exact = Object.keys(zoningSources).find((name) => name.toLowerCase() === lower);
  if (exact) return zoningSources[exact];
  const partial = Object.keys(zoningSources).find((name) => lower.includes(name.toLowerCase()));
  return partial ? zoningSources[partial] : null;
};

type BcParcelResult = {
  attrs: Record<string, unknown> | null;
  attempts: RawAttempt[];
  geometry?: GeoJSON.Feature | null;
};

async function fetchBcParcel(lat: number, lon: number): Promise<BcParcelResult> {
  const attempts: RawAttempt[] = [];
  const baseUrl =
    "https://delivery.maps.gov.bc.ca/arcgis/rest/services/whse/bcgw_pub_whse_cadastre/MapServer/1/query";
  const params = new URLSearchParams({
    f: "json",
    returnGeometry: "true",
    spatialRel: "esriSpatialRelIntersects",
    geometry: `${lon},${lat}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    outSR: "4326",
    outFields: "*",
    resultRecordCount: "1"
  });

  const useProxy = typeof window !== "undefined";
  const urlToFetch = useProxy
    ? `/api/zoning-proxy?url=${encodeURIComponent(baseUrl)}&${params.toString()}`
    : `${baseUrl}?${params.toString()}`;

  try {
    const res = await fetch(urlToFetch);
    const attempt: RawAttempt = {
      source: baseUrl,
      inSR: "4326",
      geometry: `${lon},${lat}`,
      format: "comma",
      status: res.status,
      statusText: res.statusText
    };
    if (!res.ok) {
      attempts.push(attempt);
      return { attrs: null, attempts };
    }
    const data = (await res.json()) as {
      features?: Array<{ attributes: Record<string, unknown>; geometry?: { rings?: number[][][] } }>;
    };
    attempt.raw = data;
    attempts.push(attempt);
    const attrs = data.features?.[0]?.attributes ?? null;
    const rings = data.features?.[0]?.geometry?.rings;
    const geometry =
      rings && rings.length
        ? ({ type: "Feature", geometry: { type: "Polygon", coordinates: rings } as GeoJSON.Polygon, properties: {} } as GeoJSON.Feature)
        : null;
    return { attrs, attempts, geometry };
  } catch (err) {
    attempts.push({
      source: baseUrl,
      inSR: "4326",
      geometry: `${lon},${lat}`,
      format: "comma",
      error: err instanceof Error ? err.message : String(err)
    });
    return { attrs: null, attempts };
  }
}

export async function runZoningQuery(
  config: ArcGisConfig,
  lat: number,
  lon: number,
  urlOverride?: string,
  outFieldsOverride?: string[]
) {
  const geometries: Array<{ geometry: string; inSR: string; format: "comma" | "json" }> = [
    { geometry: `${lon},${lat}`, inSR: "4326", format: "comma" },
    { geometry: JSON.stringify({ x: lon, y: lat }), inSR: "4326", format: "json" }
  ];

  if (config.useUtm10) {
    try {
      const { toUtm10 } = await import("./projection");
      const utm = toUtm10(lon, lat);
      geometries.unshift({ geometry: `${utm.x},${utm.y}`, inSR: "26910", format: "comma" });
      geometries.unshift({
        geometry: JSON.stringify({ x: utm.x, y: utm.y }),
        inSR: "26910",
        format: "json"
      });
    } catch (err) {
      console.error("UTM conversion failed", err);
    }
  }

  const targetUrl = urlOverride ?? config.layerQueryUrls[0];
  const attempts: RawAttempt[] = [];

  for (const attempt of geometries) {
    const params = new URLSearchParams({
      f: "json",
      returnGeometry: "false",
      spatialRel: "esriSpatialRelIntersects",
      geometry: attempt.geometry,
      geometryType: "esriGeometryPoint",
      inSR: attempt.inSR,
      outFields: (outFieldsOverride ?? config.outFields ?? ["*"]).join(","),
      resultRecordCount: "1"
    });

    try {
      const useProxy = typeof window !== "undefined" && config.label !== "Burnaby" && config.label !== "Vancouver";
      const urlToFetch = useProxy
        ? `/api/zoning-proxy?url=${encodeURIComponent(targetUrl)}&${params.toString()}`
        : `${targetUrl}?${params.toString()}`;
      const res = await fetch(urlToFetch);
      const attemptRecord: RawAttempt = {
        source: targetUrl,
        inSR: attempt.inSR,
        geometry: attempt.geometry,
        format: attempt.format,
        status: res.status,
        statusText: res.statusText
      };

      if (!res.ok) {
        attempts.push(attemptRecord);
        continue;
      }

      const data = (await res.json()) as {
        features?: Array<{ attributes: Record<string, unknown> }>;
        error?: string;
        message?: string;
      };
      attemptRecord.raw = data;
      attempts.push(attemptRecord);
      const attrs = data.features?.[0]?.attributes;
      if (!attrs) {
        continue;
      }
    const code = pickValue(attrs, [
      "ZONE",
      "ZONING",
      "ZONECODE",
      "ZoneCode",
      "ZONING_CODE",
      "ZONINGCODE",
      "ZONING_"
    ]);
    const name = pickValue(attrs, [
      "ZONE_DESC",
      "ZONE_NAME",
      "ZONEDESC",
      "ZoningName",
      "CD_ZONE",
      "DESCRIPTION",
      "ZONE_DESCRIPTION"
    ]);
      return { code, name, raw: attrs, source: targetUrl };
    } catch (err) {
      console.error("Zoning lookup error", err);
      attempts.push({
        source: targetUrl,
        inSR: attempt.inSR,
        geometry: attempt.geometry,
        error: err instanceof Error ? err.message : String(err)
      });
      continue;
    }
  }

  return {
    error: "No zoning found at this point",
    source: targetUrl,
    raw: { attempts } as Record<string, unknown>
  };
}

export async function fetchZoning({
  lat,
  lon,
  municipality
}: {
  lat: number;
  lon: number;
  municipality?: string;
}): Promise<ZoningResult | null> {
  const bcParcel = await fetchBcParcel(lat, lon);

  const isVancouver =
    municipality?.toLowerCase().includes("vancouver") ||
    (lat >= 49.18 && lat <= 49.35 && lon <= -123.0 && lon >= -123.3);

  if (isVancouver) {
    const vc = await fetchVancouverZoning(lat, lon);
    if (vc) {
      return {
        ...vc,
        geometry: vc.geometry ?? bcParcel.geometry?.geometry ?? null,
        raw: { ...(bcParcel.attrs ?? {}), ...(vc.raw ?? {}), attempts: bcParcel.attempts }
      };
    }
  }

  const config = getZoningSource(municipality);
  if (!config) {
    if (bcParcel.attrs) {
      return {
        error: "Zoning lookup unavailable for this municipality.",
        raw: { ...(bcParcel.attrs ?? {}), attempts: bcParcel.attempts },
        source: bcParcel.attempts[0]?.source
      };
    }
    return null;
  }

  let parcelRaw: Record<string, unknown> | null = null;
  let zoningRaw: Record<string, unknown> | null = null;
  let zoningCode: string | undefined;
  let zoningName: string | undefined;
  let lastSource: string | undefined;

  for (const url of config.layerQueryUrls) {
    const outFieldsOverride =
      municipality?.toLowerCase() === "burnaby"
        ? url.includes("/60/")
          ? ["LOT_ID", "LTO_PID", "ROLL_NUMBER", "ADDRESS", "PLAN", "DL", "BLOCK", "LOT", "HeritageStatus"]
          : url.includes("/42/")
          ? ["ZONECODE", "CD_ZONE"]
          : undefined
        : undefined;
    const hit = await runZoningQuery(config, lat, lon, url, outFieldsOverride);
    lastSource = hit?.source ?? lastSource;

    if (url.includes("/60/") && hit?.raw) {
      parcelRaw = hit.raw;
    }

    if (hit?.code || hit?.name) {
      zoningCode = hit.code ?? zoningCode;
      zoningName = hit.name ?? zoningName;
      zoningRaw = hit.raw ?? zoningRaw;
      break;
    }

    if (hit?.raw && !zoningRaw) {
      zoningRaw = hit.raw;
    }
  }

  if (zoningCode || zoningName) {
    return {
      code: zoningCode,
      name: zoningName,
      geometry: bcParcel.geometry?.geometry ?? null,
      raw: { ...(bcParcel.attrs ?? {}), ...(parcelRaw ?? {}), ...(zoningRaw ?? {}), attempts: bcParcel.attempts },
      source: lastSource
    };
  }

  if (parcelRaw || zoningRaw) {
    return {
      error: "Zoning code not returned, see raw record.",
      geometry: bcParcel.geometry?.geometry ?? null,
      raw: { ...(bcParcel.attrs ?? {}), ...(parcelRaw ?? {}), ...(zoningRaw ?? {}), attempts: bcParcel.attempts },
      source: lastSource
    };
  }

  if (bcParcel.attrs) {
    return {
      error: "Zoning lookup unavailable for this municipality.",
      geometry: bcParcel.geometry?.geometry ?? null,
      raw: { ...(bcParcel.attrs ?? {}), attempts: bcParcel.attempts },
      source: lastSource ?? bcParcel.attempts[0]?.source
    };
  }

  return { error: "Zoning lookup unavailable for this municipality." };
}

async function fetchVancouverZoning(lat: number, lon: number): Promise<ZoningResult | null> {
  const pickNearest = (records?: Array<{ fields?: Record<string, unknown> }>) => {
    if (!records?.length) return null;
    return records.reduce<{ fields?: Record<string, unknown> } | null>((best, rec) => {
      const dist = Number(rec.fields?._distance ?? rec.fields?.dist ?? Infinity);
      const bestDist = Number(best?.fields?._distance ?? best?.fields?.dist ?? Infinity);
      return dist < bestDist ? rec : best;
    }, null);
  };

  const radii = [25, 50, 100, 200];
  const maxDistanceMeters = 400;

  const fetchNearest = async ({
    dataset,
    fields
  }: {
    dataset: string;
    fields: string;
  }): Promise<{ fields: Record<string, unknown>; distance: number; geometry?: GeoJSON.Geometry | null } | null> => {
    for (const radius of radii) {
      const params = new URLSearchParams({
        dataset,
        rows: "5",
        "geofilter.distance": `${lat},${lon},${radius}`,
        fields,
        format: "json"
      });
      const url = `https://opendata.vancouver.ca/api/records/1.0/search/?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = (await res.json()) as { records?: Array<{ fields?: Record<string, unknown> }>; };
      const nearest = pickNearest(data.records);
      const dist = Number(nearest?.fields?._distance ?? nearest?.fields?.dist ?? 0);
      if (!nearest?.fields || dist > maxDistanceMeters) continue;
      const geometry = (nearest as any)?.geometry ?? null;
      return { fields: nearest.fields, distance: dist, geometry };
    }
    return null;
  };

  const zoningHit = await fetchNearest({
    dataset: "zoning-districts-and-labels",
    fields: "zoning_district,zoning_category,zoning_classification,cd_1_number,_distance"
  });

  if (!zoningHit) {
    return {
      error: "No Vancouver zoning hit within 75m",
      source: "https://opendata.vancouver.ca/api/records/1.0/search/?dataset=zoning-districts-and-labels"
    };
  }

  const taxHit = await fetchNearest({
    dataset: "property-tax-report",
    fields:
      "report_year,tax_assessment_year,current_land_value,current_improvement_value,tax_levy,pid,plan,lot,block,district_lot,legal_type,zoning_district,zoning_classification,folio,narrative_legal_line1,narrative_legal_line2,_distance"
  });

  const fields = zoningHit.fields;
  const code =
    (fields.zoning_district as string | undefined) ??
    (fields.cd_1_number as string | undefined) ??
    (fields.zoning_category as string | undefined);
  const name =
    (fields.zoning_classification as string | undefined) ??
    (fields.zoning_category as string | undefined) ??
    code;
  const bylawBase = "https://bylaws.vancouver.ca/Zoning/zoning-by-law-consolidated.pdf";
  const bylawLink = code ? `${bylawBase}#search=${encodeURIComponent(code)}` : bylawBase;
  const docLibraryLink = code
    ? `https://vancouver.ca/home-property-development/zoning-and-land-use-policies-document-library.aspx?search=${encodeURIComponent(
        code
      )}`
    : "https://vancouver.ca/home-property-development/zoning-and-land-use-policies-document-library.aspx";

  return {
    code,
    name,
    raw: {
      ...fields,
      ...(taxHit?.fields ?? {}),
      WEBLINK: bylawLink,
      WEBLINK_DOCS: docLibraryLink,
      _distance: zoningHit.distance,
      _sources: {
        zoning: fields,
        tax: taxHit?.fields ?? null
      }
    },
    source: "https://opendata.vancouver.ca/api/records/1.0/search/?dataset=zoning-districts-and-labels",
    geometry: zoningHit.geometry ?? null
  };
}
