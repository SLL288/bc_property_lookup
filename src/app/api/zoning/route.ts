import { NextResponse } from "next/server";
import { getZoningSource, runZoningQuery } from "@/lib/zoning";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const municipality = searchParams.get("municipality") || undefined;

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  const config = getZoningSource(municipality);
  if (!config) {
    return NextResponse.json({ error: "Zoning source not configured" }, { status: 404 });
  }

  for (const url of config.layerQueryUrls) {
    const result = await runZoningQuery(config, lat, lon, url);
    if (result?.code || result?.name || result?.raw) {
      return NextResponse.json(result);
    }
  }

  return NextResponse.json({ error: "No zoning found for this point" }, { status: 404 });
}
