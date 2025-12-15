import { NextResponse } from "next/server";
import { arcgisQueryByPoint } from "@/lib/arcgis";
import { getOcpSource } from "@/lib/ocpSources";

type OcpCity = "burnaby" | "surrey" | "vancouver";

type OcpResponse = {
  city: OcpCity;
  found: boolean;
  designation: string | null;
  communityPlan: string | null;
  officialUrl: string;
  source: string;
};

const cacheHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=10800, stale-while-revalidate=10800"
};

const toNumber = (value: string | null) => {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

function formatResponse(partial: Partial<OcpResponse>): OcpResponse {
  return {
    city: partial.city ?? "vancouver",
    found: partial.found ?? false,
    designation: partial.designation ?? null,
    communityPlan: partial.communityPlan ?? null,
    officialUrl: partial.officialUrl ?? "",
    source: partial.source ?? "ArcGIS REST"
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = (searchParams.get("city") as OcpCity) || "vancouver";
  const lat = toNumber(searchParams.get("lat"));
  const lng = toNumber(searchParams.get("lng"));

  const source = getOcpSource(city);

  // Vancouver: no API lookup yet, just return link-only
  if (city === "vancouver") {
    return NextResponse.json(
      formatResponse({
        city,
        officialUrl: source.officialUrl,
        found: false,
        source: "Official plan links"
      }),
      { status: 200, headers: cacheHeaders }
    );
  }

  if (lat === null || lng === null || !source.serviceUrl || source.layerId === undefined) {
    return NextResponse.json(
      formatResponse({
        city,
        officialUrl: source.officialUrl
      }),
      { status: 400, headers: cacheHeaders }
    );
  }

  try {
    const query = await arcgisQueryByPoint({
      baseUrl: source.serviceUrl,
      layerId: source.layerId,
      lat,
      lng,
      outFields: ["*"],
      returnGeometry: false
    });

    const attrs = query.attributes ?? {};
    const fieldMap = source.fieldMap ?? { designation: [] };
    const pickField = (fields: string[] | undefined) => {
      if (!fields) return null;
      for (const f of fields) {
        const v = (attrs as Record<string, unknown>)[f];
        if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
      }
      return null;
    };

    const designation = pickField(fieldMap.designation);
    const communityPlan = pickField(fieldMap.communityPlan);
    const found = Boolean(designation || communityPlan);

    return NextResponse.json(
      formatResponse({
        city,
        found,
        designation,
        communityPlan,
        officialUrl: source.officialUrl
      }),
      { status: 200, headers: cacheHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      formatResponse({
        city,
        found: false,
        officialUrl: source.officialUrl
      }),
      { status: 200, headers: cacheHeaders }
    );
  }
}
