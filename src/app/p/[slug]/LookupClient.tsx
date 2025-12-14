"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type * as GeoJSON from "geojson";
import { geocodeAddress } from "@/lib/geocode";
import { findMunicipality, isInsideAlr } from "@/lib/geo";
import { getMunicipalLink } from "@/lib/municipalLinks";
import { fetchZoning, type ZoningResult } from "@/lib/zoning";
import { toUtm10 } from "@/lib/projection";
import {
  getPidByPoint,
  getMunicipalityByPoint,
  getRegionalDistrictByPoint,
  getAlrStatusByPoint,
  getFloodplainIndexByPoint
} from "@/lib/bcgovProviders";
import { ResultCards } from "@/components/ResultCards";
import { MapView } from "@/components/MapView";
import { SearchBox } from "@/components/SearchBox";

const parseLatLng = (value: string) => {
  const parts = value.split(",");
  if (parts.length !== 2) return null;
  const lat = Number(parts[0]);
  const lon = Number(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return { lat, lon };
};

const saveRecent = (address: string) => {
  if (typeof window === "undefined") return;
  const key = "bc-property-recent";
  const existing = window.localStorage.getItem(key);
  const list = existing ? (JSON.parse(existing) as string[]) : [];
  const deduped = [address, ...list.filter((item) => item !== address)].slice(0, 5);
  window.localStorage.setItem(key, JSON.stringify(deduped));
};

const loadRecent = (): string[] => {
  if (typeof window === "undefined") return [];
  const key = "bc-property-recent";
  const existing = window.localStorage.getItem(key);
  return existing ? (JSON.parse(existing) as string[]) : [];
};

export default function LookupClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [address, setAddress] = useState<string>(slug);
  const [municipality, setMunicipality] = useState<{ name: string; region?: string } | null>(null);
  const [geocodeCity, setGeocodeCity] = useState<string | null>(null);
  const [alr, setAlr] = useState<boolean | null>(null);
  const [zoning, setZoning] = useState<ZoningResult | null>(null);
  const [assessmentData, setAssessmentData] = useState<{
    land?: number;
    improvement?: number;
    total?: number;
    year?: string;
  } | null>(null);
  const [utm, setUtm] = useState<{ x: number; y: number } | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("Looking up address...");
  const [pidInfo, setPidInfo] = useState<{ pid?: string; parcelName?: string; parcelStatus?: string } | null>(null);
  const [jurisdictionBc, setJurisdictionBc] = useState<{ municipality?: string; regionalDistrict?: string } | null>(
    null
  );
  const [alrProv, setAlrProv] = useState<{ insideAlr: boolean; status?: string; source?: string } | null>(null);
  const [floodplain, setFloodplain] = useState<{
    hasMappedFloodplainStudy: boolean;
    projectName?: string;
    reportUrl?: string;
    geometry?: GeoJSON.Feature | null;
  } | null>(null);

  useEffect(() => {
    setRecent(loadRecent());
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      setZoning(null);
      setAssessmentData(null);
      setStatusMessage("Looking up address...");
      setPidInfo(null);
      setJurisdictionBc(null);
      setAlrProv(null);
      setFloodplain(null);
      try {
        const latLng = parseLatLng(slug);
        if (latLng) {
          setCoords(latLng);
          setStatusMessage("Coordinates parsed, loading details...");
        } else {
          const result = await geocodeAddress(slug);
          setCoords({ lat: result.lat, lon: result.lon });
          setAddress(result.address);
          setGeocodeCity(result.city ?? null);
          setStatusMessage("Geocoded address, loading details...");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lookup failed.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [slug]);

  useEffect(() => {
    if (!coords) return;
    const muni = findMunicipality(coords.lon, coords.lat);
    if (muni) {
      setMunicipality(muni);
    } else if (geocodeCity) {
      setMunicipality({ name: geocodeCity, region: "Metro Vancouver" });
    } else if (address.toLowerCase().includes("vancouver")) {
      setMunicipality({ name: "Vancouver", region: "Metro Vancouver" });
    }
    const insideAlr = isInsideAlr(coords.lon, coords.lat);
    setAlr(insideAlr);
    try {
      const utmCoord = toUtm10(coords.lon, coords.lat);
      setUtm(utmCoord);
    } catch (err) {
      console.error("UTM conversion failed", err);
      setUtm(null);
    }
    saveRecent(address);
  }, [coords, address, geocodeCity]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!coords || !municipality?.name) {
        setZoning(null);
        return;
      }
      setZoning({ error: "Looking up zoning..." });
      setStatusMessage("Fetching parcel, zoning, and assessment data...");
      setAssessmentData(null);
      const result = await fetchZoning({
        lat: coords.lat,
        lon: coords.lon,
        municipality: municipality.name
      });
      if (!cancelled) {
        setZoning(result ?? { error: "Zoning lookup unavailable for this municipality." });
        setStatusMessage(result?.error ? "Finished with warnings" : "Lookup complete");
        if (result?.raw) {
          const land = result.raw.current_land_value !== undefined ? Number(result.raw.current_land_value) : undefined;
          const improvement =
            result.raw.current_improvement_value !== undefined
              ? Number(result.raw.current_improvement_value)
              : undefined;
          const total =
            land !== undefined && improvement !== undefined ? land + improvement : land ?? improvement;
          const year =
            (result.raw.tax_assessment_year as string | undefined) ??
            (result.raw.report_year as string | undefined);
          if (land || improvement) {
            setAssessmentData({ land, improvement, total: total ?? undefined, year });
          }
        }
        // Fire off BC Gov providers in parallel
        try {
          const [pidResp, muniResp, rdResp, alrResp, floodResp] = await Promise.all([
            getPidByPoint(coords.lat, coords.lon),
            getMunicipalityByPoint(coords.lat, coords.lon),
            getRegionalDistrictByPoint(coords.lat, coords.lon),
            getAlrStatusByPoint(coords.lat, coords.lon),
            getFloodplainIndexByPoint(coords.lat, coords.lon)
          ]);
          setPidInfo({
            pid: (pidResp.attributes as any)?.PID_FORMATTED ?? (pidResp.attributes as any)?.PID,
            parcelName: (pidResp.attributes as any)?.PARCEL_NAME,
            parcelStatus: (pidResp.attributes as any)?.PARCEL_STATUS
          });
          setJurisdictionBc({
            municipality: (muniResp.attributes as any)?.ADMIN_AREA_NAME ?? (muniResp.attributes as any)?.NAME,
            regionalDistrict: (rdResp.attributes as any)?.ADMIN_AREA_NAME ?? (rdResp.attributes as any)?.NAME
          });
          setAlrProv({
            insideAlr: alrResp.insideAlr,
            status: alrResp.status,
            source: alrResp.source
          });
          setFloodplain({
            hasMappedFloodplainStudy: floodResp.hasMappedFloodplainStudy,
            projectName: floodResp.projectName,
            reportUrl: floodResp.reportUrl,
            geometry: floodResp.geometry ?? null
          });
        } catch (err) {
          console.error("BC Gov provider fetch failed", err);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [coords, municipality]);

  const zoningLink = getMunicipalLink(municipality?.name ?? undefined);

  const assessment = useMemo(() => {
    if (assessmentData) {
      return {
        available: true,
        year: assessmentData.year,
        value: assessmentData.total
          ? `$${Math.round(assessmentData.total).toLocaleString()}`
          : undefined,
        class: "Tax assessment (Vancouver OpenData)",
        message: undefined,
        land: assessmentData.land,
        improvement: assessmentData.improvement,
        link: process.env.NEXT_PUBLIC_BC_ASSESSMENT_URL ?? "https://www.bcassessment.ca/"
      };
    }
    return {
      available: false,
      message: "Assessment lookup unavailable in MVP — coming soon.",
      link: process.env.NEXT_PUBLIC_BC_ASSESSMENT_URL ?? "https://www.bcassessment.ca/"
    };
  }, [assessmentData]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-dark">Property snapshot</p>
        <h1 className="text-3xl font-bold text-gray-900">{address}</h1>
        {coords && (
          <p className="text-sm text-gray-700">Coordinates: {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}</p>
        )}
        {utm && (
          <p className="text-sm text-gray-700">
            UTM Zone 10N (NAD83): {utm.x.toFixed(1)}, {utm.y.toFixed(1)}
          </p>
        )}
        {statusMessage && (
          <p className="text-sm text-gray-600">{statusMessage}</p>
        )}
        <div className="flex flex-wrap gap-2 text-sm text-gray-700">
          <a
            className="rounded-full border border-gray-200 px-3 py-1 hover:border-brand"
            href="https://catalogue.data.gov.bc.ca/dataset"
            target="_blank"
            rel="noreferrer"
          >
            Generic BC maps
          </a>
          <a
            className="rounded-full border border-gray-200 px-3 py-1 hover:border-brand"
            href="mailto:feedback@example.com?subject=BC%20Property%20Lookup"
          >
            Report issue
          </a>
        </div>
      </div>

      <SearchBox initialQuery={address} />

      {loading && <p className="text-sm text-gray-700">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && coords && (
        <>
          <ResultCards
            normalizedAddress={address}
            coordinates={coords}
            municipality={municipality}
            zoningLink={zoningLink}
            zoning={zoning}
            inAlr={alr}
            alrProv={alrProv}
            pidInfo={pidInfo}
            jurisdictionBc={jurisdictionBc}
            floodplain={floodplain}
            shareUrl={shareUrl}
            assessment={assessment}
          />
          <div className="mt-4">
            <MapView
              lat={coords.lat}
              lon={coords.lon}
              zoningGeometry={zoning?.geometry ? { type: "Feature", geometry: zoning.geometry, properties: {} } : undefined}
              floodGeometry={floodplain?.geometry ?? undefined}
            />
          </div>
        </>
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
