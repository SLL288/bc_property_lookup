import { NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/geocode";
import { fetchZoning } from "@/lib/zoning";
import {
  getPidByPoint,
  getMunicipalityByPoint,
  getRegionalDistrictByPoint,
  getAlrStatusByPoint,
  getFloodplainIndexByPoint
} from "@/lib/bcgovProviders";

export const runtime = "edge";

const CACHE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const STALE_SECONDS = 60 * 60 * 24; // 1 day

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    promise
      .then((val) => {
        clearTimeout(t);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(t);
        reject(err);
      });
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = url.searchParams.get("address");
  const latParam = url.searchParams.get("lat");
  const lonParam = url.searchParams.get("lon");

  if (!address && !(latParam && lonParam)) {
    return NextResponse.json({ error: "Provide address or lat/lng" }, { status: 400 });
  }

  const cacheKey = new Request(url.toString());
  try {
    const cache = await caches.open("lookup-cache");
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }
  } catch {
    // cache not available or failed; continue
  }

  try {
    const geo = address
      ? await geocodeAddress(address)
      : { address: `${latParam},${lonParam}`, lat: Number(latParam), lon: Number(lonParam) };

    const [pidResp, muniResp, rdResp, alrResp, floodResp, zoningResp] = await Promise.all([
      withTimeout(getPidByPoint(geo.lat, geo.lon), 5000, "PID"),
      withTimeout(getMunicipalityByPoint(geo.lat, geo.lon), 5000, "Municipality"),
      withTimeout(getRegionalDistrictByPoint(geo.lat, geo.lon), 5000, "Regional district"),
      withTimeout(getAlrStatusByPoint(geo.lat, geo.lon), 5000, "ALR"),
      withTimeout(getFloodplainIndexByPoint(geo.lat, geo.lon), 5000, "Floodplain"),
      withTimeout(fetchZoning({ lat: geo.lat, lon: geo.lon, municipality: undefined }), 5000, "Zoning")
    ]).catch((err) => {
      // If any promise rejects synchronously we will handle below; individual catches happen within withTimeout
      throw err;
    });

    const pidAttrs = (pidResp as any)?.attributes ?? {};
    const pidValue =
      pidAttrs.PID_FORMATTED ??
      pidAttrs.PID ??
      pidAttrs.LTO_PID ??
      (pidAttrs.PID_NUMBER ? String(pidAttrs.PID_NUMBER) : undefined);

    const snapshot = {
      address: geo.address,
      coords: { lat: geo.lat, lon: geo.lon },
      pid: pidValue,
      parcel: {
        name: pidAttrs.PARCEL_NAME,
        status: pidAttrs.PARCEL_STATUS,
        class: pidAttrs.PARCEL_CLASS
      },
      municipality: (muniResp as any)?.attributes?.ADMIN_AREA_NAME ?? (muniResp as any)?.attributes?.NAME ?? null,
      regionalDistrict: (rdResp as any)?.attributes?.ADMIN_AREA_NAME ?? (rdResp as any)?.attributes?.NAME ?? null,
      alr: (alrResp as any)?.insideAlr ?? null,
      alrStatus: (alrResp as any)?.status ?? undefined,
      flood: floodResp
        ? {
            hasMappedFloodplainStudy: (floodResp as any).hasMappedFloodplainStudy,
            projectName: (floodResp as any).projectName,
            reportUrl: (floodResp as any).reportUrl
          }
        : null,
      zoning: zoningResp ?? null,
      errors: [] as string[]
    };

    const res = NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`
      }
    });

    try {
      const cache = await caches.open("lookup-cache");
      await cache.put(cacheKey, res.clone());
    } catch {
      // ignore cache write errors
    }

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lookup failed" },
      { status: 500, headers: { "Cache-Control": "public, s-maxage=120" } }
    );
  }
}
