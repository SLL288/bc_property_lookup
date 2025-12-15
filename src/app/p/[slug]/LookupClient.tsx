"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { ResultCards } from "@/components/ResultCards";
import { MapView } from "@/components/MapView";
import { SearchBox } from "@/components/SearchBox";
import { geocodeAddress } from "@/lib/geocode";
import { fetchZoning } from "@/lib/zoning";
import {
  getPidByPoint,
  getMunicipalityByPoint,
  getRegionalDistrictByPoint,
  getAlrStatusByPoint,
  getFloodplainIndexByPoint
} from "@/lib/bcgovProviders";
import { getMunicipalLink } from "@/lib/municipalLinks";

type Snapshot = {
  address: string;
  coords?: { lat: number; lon: number } | null;
  pid?: string;
  parcel?: { name?: string; status?: string; class?: string } | null;
  municipality?: string | null;
  regionalDistrict?: string | null;
  alr?: boolean | null;
  alrStatus?: string | null;
  flood?: { hasMappedFloodplainStudy: boolean; projectName?: string; reportUrl?: string } | null;
  zoning?: any;
  errors?: string[];
};

const STORAGE_TTL = 1000 * 60 * 60 * 24 * 7;

type DisplaySnapshot = {
  address: string;
  coords?: { lat: number; lon: number } | null;
  pid?: string;
  pidSource?: string;
  parcelName?: string;
  parcelStatus?: string;
  municipality?: string | null;
  regionalDistrict?: string | null;
  alr?: boolean | null;
  alrStatus?: string | null;
  flood?: Snapshot["flood"];
  zoning?: Snapshot["zoning"];
  errors?: string[];
  officialMapLink?: string;
};

const buildDisplaySnapshot = (snap: Snapshot | null): DisplaySnapshot | null => {
  if (!snap) return null;
  const raw = snap.zoning?.raw as Record<string, any> | undefined;
  const pidFromRaw =
    raw?.PID_FORMATTED ??
    raw?.PID ??
    raw?.LTO_PID ??
    (raw?.PID_NUMBER ? String(raw.PID_NUMBER) : undefined);
  const parcelName = snap.parcel?.name ?? raw?.PARCEL_NAME ?? raw?.Address ?? raw?.property_address;
  const parcelStatus = snap.parcel?.status ?? raw?.PARCEL_STATUS ?? raw?.PARCEL_CLASS;
  const municipality =
    snap.municipality ??
    raw?.MUNICIPALITY ??
    raw?.municipality ??
    raw?.CITY ??
    raw?.city ??
    raw?.ADMIN_AREA_NAME ??
    null;
  const regionalDistrict = snap.regionalDistrict ?? raw?.REGIONAL_DISTRICT ?? raw?.regional_district ?? null;
  const pid = snap.pid ?? pidFromRaw;
  const pidSource = snap.pid ? "Province of BC (ParcelMap BC)" : pidFromRaw ? "Municipal/zoning data" : undefined;
  const officialMapLink = getMunicipalLink(municipality ?? undefined);

  return {
    address: snap.address,
    coords: snap.coords,
    pid,
    pidSource,
    parcelName,
    parcelStatus,
    municipality,
    regionalDistrict,
    alr: snap.alr,
    alrStatus: snap.alrStatus,
    flood: snap.flood,
    zoning: snap.zoning,
    errors: snap.errors,
    officialMapLink
  };
};
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Copy failed", err);
  }
};

const summaryText = (snap: Snapshot | undefined, share: string) => {
  const coords = snap?.coords ? `${snap.coords.lat.toFixed(5)}, ${snap.coords.lon.toFixed(5)}` : "N/A";
  const muni = snap?.municipality ?? "Unknown";
  const alr = snap?.alr === null || snap?.alr === undefined ? "Unknown" : snap.alr ? "Yes" : "No";
  const zoning = snap?.zoning?.code ?? snap?.zoning?.name ?? "N/A";
  return `BC Property Snapshot
Address: ${snap?.address ?? ""}
Coordinates: ${coords}
Municipality: ${muni}
Zoning: ${zoning}
Inside ALR: ${alr}
Link: ${share}`;
};

export default function LookupClient({ slug, initialSnapshot }: { slug: string; initialSnapshot?: Snapshot | null }) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(initialSnapshot ?? null);
  const [loading, setLoading] = useState(!initialSnapshot);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(initialSnapshot ? "Using server result" : "Preparing lookup…");
  const [recent, setRecent] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [cacheHit, setCacheHit] = useState(false);
  const [providerNotes, setProviderNotes] = useState<string[]>(initialSnapshot?.errors ?? []);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const cacheKey = `snapshot:v1:${slug.trim().toLowerCase()}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
      const rec = window.localStorage.getItem("bc-property-recent");
      setRecent(rec ? (JSON.parse(rec) as string[]) : []);
    }
  }, []);

  const saveRecent = (address: string) => {
    if (typeof window === "undefined") return;
    const key = "bc-property-recent";
    const existing = window.localStorage.getItem(key);
    const list = existing ? (JSON.parse(existing) as string[]) : [];
    const deduped = [address, ...list.filter((i) => i !== address)].slice(0, 5);
    window.localStorage.setItem(key, JSON.stringify(deduped));
    setRecent(deduped);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      setStatus(initialSnapshot ? "Using server result" : "Checking local cache…");
      setFallbackUsed(false);

      if (typeof window !== "undefined") {
        const cached = window.localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as { ts: number; data: Snapshot };
          if (Date.now() - parsed.ts < STORAGE_TTL) {
            setSnapshot(parsed.data);
            setCacheHit(true);
            setProviderNotes(parsed.data.errors ?? []);
            setLoading(false);
          }
        }
      }

      try {
        setStatus("Fetching from server…");
        const res = await fetch(`/api/lookup?address=${encodeURIComponent(slug)}`);
        const ctype = res.headers.get("content-type") || "";
        if (!ctype.includes("application/json")) {
          throw new Error(`Unexpected response type: ${ctype || "unknown"}`);
        }
        if (!res.ok) throw new Error(await res.text());
        const data = (await res.json()) as Snapshot;
        if (!data || typeof data.address !== "string") {
          throw new Error("Invalid lookup response");
        }
        setSnapshot(data);
        setProviderNotes(data.errors ?? []);
        setFallbackUsed(false);
        saveRecent(data.address);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
        }
      } catch (err) {
        // Fallback: run lookup client-side
        try {
          setStatus("Server unavailable, running fallback…");
          setFallbackUsed(true);
          const getAttr = (obj: unknown, key: string) => {
            if (!obj || typeof obj !== "object") return undefined;
            const val = (obj as any)[key];
            return val === undefined || val === null ? undefined : val;
          };
          const geo = await geocodeAddress(slug);
          const [pidResp, muniResp, rdResp, alrResp, floodResp, zoningResp] = await Promise.all([
            getPidByPoint(geo.lat, geo.lon).catch(() => null),
            getMunicipalityByPoint(geo.lat, geo.lon).catch(() => null),
            getRegionalDistrictByPoint(geo.lat, geo.lon).catch(() => null),
            getAlrStatusByPoint(geo.lat, geo.lon).catch(() => null),
            getFloodplainIndexByPoint(geo.lat, geo.lon).catch(() => null),
            fetchZoning({ lat: geo.lat, lon: geo.lon, municipality: undefined }).catch(() => null)
          ]);
          const pidAttrs = (pidResp as any)?.attributes ?? {};
          const pidValue =
            pidAttrs.PID_FORMATTED ??
            pidAttrs.PID ??
            pidAttrs.LTO_PID ??
            (pidAttrs.PID_NUMBER ? String(pidAttrs.PID_NUMBER) : undefined);
          const data: Snapshot = {
            address: geo.address,
            coords: { lat: geo.lat, lon: geo.lon },
            pid: pidValue,
            parcel: {
              name: pidAttrs.PARCEL_NAME,
              status: pidAttrs.PARCEL_STATUS,
              class: pidAttrs.PARCEL_CLASS
            },
            municipality: getAttr(muniResp?.attributes, "ADMIN_AREA_NAME") ?? getAttr(muniResp?.attributes, "NAME"),
            regionalDistrict: getAttr(rdResp?.attributes, "ADMIN_AREA_NAME") ?? getAttr(rdResp?.attributes, "NAME"),
            alr: alrResp?.insideAlr ?? null,
            alrStatus: alrResp?.status ?? undefined,
            flood: floodResp
              ? {
                  hasMappedFloodplainStudy: floodResp.hasMappedFloodplainStudy,
                  projectName: floodResp.projectName,
                  reportUrl: floodResp.reportUrl
                }
              : null,
            zoning: zoningResp,
            errors: []
          };
          setSnapshot(data);
          setProviderNotes([]);
          saveRecent(data.address);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
          }
        } catch (fallbackErr) {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(cacheKey);
          }
          if (!snapshot) {
            setError(
              fallbackErr instanceof Error
                ? fallbackErr.message
                : err instanceof Error
                ? err.message
                : "Lookup failed"
            );
          }
          setProviderNotes([
            fallbackErr instanceof Error
              ? fallbackErr.message
              : err instanceof Error
              ? err.message
              : "Lookup failed"
          ]);
        }
      } finally {
        setLoading(false);
        setStatus(cacheHit ? "Using cached result" : "Lookup complete");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const assessment = useMemo(() => {
    if (!snapshot?.zoning?.raw) return { available: false, message: "Assessment lookup unavailable in MVP — coming soon." };
    const land = snapshot.zoning.raw.current_land_value !== undefined ? Number(snapshot.zoning.raw.current_land_value) : undefined;
    const improvement =
      snapshot.zoning.raw.current_improvement_value !== undefined ? Number(snapshot.zoning.raw.current_improvement_value) : undefined;
    const total = land !== undefined && improvement !== undefined ? land + improvement : land ?? improvement;
    const year =
      (snapshot.zoning.raw.tax_assessment_year as string | undefined) ??
      (snapshot.zoning.raw.report_year as string | undefined);
    if (land || improvement) {
      return {
        available: true,
        year,
        value: total ? `$${Math.round(total).toLocaleString()}` : undefined,
        class: "Tax assessment (Vancouver OpenData)",
        land,
        improvement,
        link: process.env.NEXT_PUBLIC_BC_ASSESSMENT_URL ?? "https://www.bcassessment.ca/"
      };
    }
    return { available: false, message: "Assessment lookup unavailable in MVP — coming soon.", link: "https://www.bcassessment.ca/" };
  }, [snapshot]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      {snapshot && (
        <p className="sr-only">
          PID: {buildDisplaySnapshot(snapshot)?.pid ?? "N/A"}, Zoning:{" "}
          {snapshot.zoning?.code ?? snapshot.zoning?.name ?? "N/A"}, ALR:{" "}
          {snapshot.alr === null || snapshot.alr === undefined ? "Unknown" : snapshot.alr ? "Yes" : "No"}
        </p>
      )}
      {/* Snapshot header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-dark">Property snapshot</p>
              <h1 className="text-3xl font-bold text-gray-900">{snapshot?.address ?? slug}</h1>
              {snapshot?.coords && (
                <p className="text-sm text-gray-700">
                  Coordinates: {snapshot.coords.lat?.toFixed(5)}, {snapshot.coords.lon?.toFixed(5)}
                </p>
              )}
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
                  {providerNotes.length > 0 ? "Partial data" : "Data loaded"}
                </span>
                {providerNotes.length > 0 && (
                  <span className="text-amber-700">
                    Some sources delayed. Diagnostics has details.
                  </span>
                )}
              </div>
            </div>
            <div className="min-w-[260px] flex-1">
              <SearchBox initialQuery={snapshot?.address ?? slug} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-gray-800">
            <button
              className="rounded-lg bg-brand px-3 py-2 text-white shadow hover:bg-brand-dark"
              onClick={() => copyText(summaryText(snapshot ?? undefined, shareUrl))}
            >
              Copy summary
            </button>
            {shareUrl && (
              <button
                className="rounded-lg border border-gray-200 px-3 py-2 hover:border-brand"
                onClick={() => copyText(shareUrl)}
              >
                Copy link
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {snapshot && (
        <>
          {/* Details + diagnostics */}
          <div className="flex flex-col gap-4">
            <ResultCards
              normalizedAddress={snapshot.address}
              coordinates={snapshot.coords ?? undefined}
              municipality={
                buildDisplaySnapshot(snapshot)?.municipality
                  ? {
                      name: buildDisplaySnapshot(snapshot)?.municipality as string,
                      region: buildDisplaySnapshot(snapshot)?.regionalDistrict ?? undefined
                    }
                  : null
              }
              zoningLink={buildDisplaySnapshot(snapshot)?.officialMapLink ?? getMunicipalLink()}
              zoning={snapshot.zoning}
              inAlr={snapshot.alr ?? null}
              alrProv={
                snapshot.alr !== undefined
                  ? {
                      insideAlr: Boolean(snapshot.alr),
                      status: snapshot.alrStatus ?? undefined,
                      source: "Province of BC"
                    }
                  : null
              }
              parcelInfo={{
                pid: buildDisplaySnapshot(snapshot)?.pid,
                parcelName: buildDisplaySnapshot(snapshot)?.parcelName,
                parcelStatus: buildDisplaySnapshot(snapshot)?.parcelStatus,
                source: buildDisplaySnapshot(snapshot)?.pidSource
              }}
              jurisdictionBc={{
                municipality: buildDisplaySnapshot(snapshot)?.municipality ?? undefined,
                regionalDistrict: buildDisplaySnapshot(snapshot)?.regionalDistrict ?? undefined
              }}
              floodplain={snapshot.flood ?? undefined}
              assessment={assessment as any}
              providerNotes={providerNotes}
            />
          </div>
          {snapshot.coords && (
            <div className="mt-4">
              <MapView lat={snapshot.coords.lat} lon={snapshot.coords.lon} />
            </div>
          )}
        </>
      )}

      {loading && !snapshot && (
        <div className="grid gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {recent.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Recent searches</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-800">
            {recent.map((item) => (
              <button
                key={item}
                onClick={() => router.push(`/p/${encodeURIComponent(item)}`)}
                className="rounded-full border border-gray-200 px-3 py-1 hover:border-brand"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
