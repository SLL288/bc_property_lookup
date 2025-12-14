"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultCards } from "@/components/ResultCards";
import { MapView } from "@/components/MapView";
import { SearchBox } from "@/components/SearchBox";

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

export default function LookupClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Starting lookup...");
  const [recent, setRecent] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [cacheHit, setCacheHit] = useState(false);

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
      setStatus("Checking local cache...");

      if (typeof window !== "undefined") {
        const cached = window.localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as { ts: number; data: Snapshot };
          if (Date.now() - parsed.ts < STORAGE_TTL) {
            setSnapshot(parsed.data);
            setCacheHit(true);
          }
        }
      }

      try {
        setStatus("Calling lookup API...");
        const res = await fetch(`/api/lookup?address=${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error(await res.text());
        const data = (await res.json()) as Snapshot;
        setSnapshot(data);
        saveRecent(data.address);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
        }
      } catch (err) {
        if (!snapshot) {
          setError(err instanceof Error ? err.message : "Lookup failed");
        }
      } finally {
        setLoading(false);
        setStatus(cacheHit ? "Showing cached result" : "Lookup complete");
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
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-dark">Property snapshot</p>
        <h1 className="text-3xl font-bold text-gray-900">{snapshot?.address ?? slug}</h1>
        {snapshot?.coords && (
          <p className="text-sm text-gray-700">
            Coordinates: {snapshot.coords.lat?.toFixed(5)}, {snapshot.coords.lon?.toFixed(5)}
          </p>
        )}
        {status && <p className="text-sm text-gray-600">{status}</p>}
        {cacheHit && <p className="text-xs text-emerald-700">Loaded from local cache</p>}
      </div>

      <SearchBox initialQuery={snapshot?.address ?? slug} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {snapshot && (
        <>
          {snapshot.errors && snapshot.errors.length > 0 && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              Some sources unavailable: {snapshot.errors.join("; ")} <button onClick={() => location.reload()} className="underline">Retry</button>
            </div>
          )}
          <ResultCards
            normalizedAddress={snapshot.address}
            coordinates={snapshot.coords ?? undefined}
            municipality={
              snapshot.municipality
                ? { name: snapshot.municipality, region: snapshot.regionalDistrict ?? undefined }
                : null
            }
            zoningLink={null}
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
            pidInfo={{
              pid: snapshot.pid,
              parcelName: snapshot.parcel?.name,
              parcelStatus: snapshot.parcel?.status
            }}
            jurisdictionBc={{
              municipality: snapshot.municipality ?? undefined,
              regionalDistrict: snapshot.regionalDistrict ?? undefined
            }}
            floodplain={snapshot.flood ?? undefined}
            shareUrl={shareUrl}
            assessment={assessment as any}
          />
          {snapshot.coords && (
            <div className="mt-4">
              <MapView lat={snapshot.coords.lat} lon={snapshot.coords.lon} />
            </div>
          )}
        </>
      )}

      {loading && !snapshot && <p className="text-sm text-gray-700">Loading...</p>}

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
