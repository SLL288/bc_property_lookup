"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { ZoningResult } from "@/lib/zoning";

export type ResultCardsProps = {
  normalizedAddress: string;
  coordinates?: { lat: number; lon: number };
  municipality?: { name: string; region?: string } | null;
  zoningLink?: string | null;
  zoning?: {
    code?: string;
    name?: string;
    error?: string;
    source?: string;
    raw?: Record<string, unknown>;
  } | null;
  inAlr?: boolean | null;
  alrProv?: { insideAlr: boolean; status?: string; source?: string } | null;
  pidInfo?: { pid?: string; parcelName?: string; parcelStatus?: string; raw?: Record<string, unknown> | null } | null;
  jurisdictionBc?: { municipality?: string; regionalDistrict?: string } | null;
  floodplain?: { hasMappedFloodplainStudy: boolean; projectName?: string; reportUrl?: string } | null;
  shareUrl?: string;
  assessment?: {
    link?: string;
    available: boolean;
    message?: string;
    year?: string;
    value?: string;
    class?: string;
    land?: number;
    improvement?: number;
  };
};

const ALR_MAP_URL =
  "https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=87dee902dc5e443fbff8ca7b4311b407";

export function ResultCards({
  normalizedAddress,
  coordinates,
  municipality,
  zoningLink,
  zoning,
  inAlr,
  alrProv,
  pidInfo,
  jurisdictionBc,
  floodplain,
  shareUrl,
  assessment
}: ResultCardsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const summary = useMemo(() => {
    const muni = municipality?.name ?? "Municipality not detected yet";
    const alr = inAlr === null ? "Unknown" : inAlr ? "Yes" : "No";
    const coords = coordinates ? `${coordinates.lat.toFixed(5)}, ${coordinates.lon.toFixed(5)}` : "N/A";
    return `BC Property Snapshot\nAddress: ${normalizedAddress}\nCoordinates: ${coords}\nMunicipality: ${muni}\nInside ALR: ${alr}`;
  }, [normalizedAddress, coordinates, municipality, inAlr]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Jurisdiction">
        <p className="text-sm text-gray-700">
          Municipality and ALR checks are scoped to Metro Vancouver for this MVP.
        </p>
      </Card>
      <Card title="PID / Parcel (BC)">
        {pidInfo?.pid || pidInfo?.parcelName ? (
          <div className="space-y-1 text-sm text-gray-800">
            {pidInfo.pid && <p className="font-semibold">PID: {pidInfo.pid}</p>}
            {pidInfo.parcelName && <p>Parcel: {pidInfo.parcelName}</p>}
            {pidInfo.parcelStatus && <p>Status: {pidInfo.parcelStatus}</p>}
            <p className="text-xs text-gray-600">Source: Province of BC (ParcelMap BC)</p>
          </div>
        ) : (
          <p className="text-sm text-gray-700">PID not returned for this location.</p>
        )}
        <a
          className="mt-2 inline-flex w-full justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-brand"
          href="https://www2.gov.bc.ca/gov/content/industry/crown-land-water/land-use/crown-land/parcels/parcelmap-bc"
          target="_blank"
          rel="noreferrer"
        >
          Open ParcelMap BC info
        </a>
      </Card>
      <Card title="Municipality">
        {municipality ? (
          <div className="space-y-1 text-sm text-gray-800">
            <p className="font-semibold">{municipality.name}</p>
            <p className="text-gray-600">Region: {municipality.region ?? "Metro Vancouver"}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-700">Municipality detection not available yet for this location.</p>
        )}
      </Card>
      <Card title="Jurisdiction (BC Gov)">
        {(jurisdictionBc?.municipality || jurisdictionBc?.regionalDistrict) ? (
          <div className="space-y-1 text-sm text-gray-800">
            {jurisdictionBc?.municipality && <p>Municipality: {jurisdictionBc.municipality}</p>}
            {jurisdictionBc?.regionalDistrict && <p>Regional district: {jurisdictionBc.regionalDistrict}</p>}
            <p className="text-xs text-gray-600">Source: Province of BC legal admin boundaries</p>
          </div>
        ) : (
          <p className="text-sm text-gray-700">BC jurisdiction lookup not available.</p>
        )}
      </Card>
      <Card title="Parcel details">
        {zoning?.raw ? (
          <div className="space-y-2 text-sm text-gray-800">
            <div className="grid grid-cols-2 gap-1 text-xs">
              {(() => {
                const items: Array<[string, string | undefined]> = [
                  ["Address", getField(zoning.raw, ["ADDRESS", "property_address"])],
                  ["Roll number", getField(zoning.raw, ["ROLL_NUMBER", "roll_number", "folio"])],
                  ["PID", getField(zoning.raw, ["PID_FORMATTED", "LTO_PID", "pid", "PID"])],
                  ["Plan", getField(zoning.raw, ["PLAN", "plan", "plan_number", "PLAN_NUMBER"])],
                  ["DL", getField(zoning.raw, ["DL", "district_lot"])],
                  ["Block", getField(zoning.raw, ["BLOCK", "block"])],
                  ["Lot", getField(zoning.raw, ["LOT", "lot"])],
                  ["Parcel status", getField(zoning.raw, ["PARCEL_STATUS"])],
                  ["Parcel class", getField(zoning.raw, ["PARCEL_CLASS"])],
                  ["Owner type", getField(zoning.raw, ["OWNER_TYPE"])],
                  ["Municipality", getField(zoning.raw, ["MUNICIPALITY"])],
                  ["Regional district", getField(zoning.raw, ["REGIONAL_DISTRICT"])],
                  ["Updated", getField(zoning.raw, ["WHEN_UPDATED", "PARCEL_START_DATE"])],
                  ["Parcel area (sqm)", getField(zoning.raw, ["FEATURE_AREA_SQM"])],
                  ["Parcel length (m)", getField(zoning.raw, ["FEATURE_LENGTH_M"])],
                  [
                    "Zoning code",
                    getField(zoning.raw, ["ZONING_TEXT", "ZONECODE", "zoning_district", "zoning_code"])
                  ],
                  [
                    "Zoning description",
                    getField(zoning.raw, ["ZONING", "zoning_classification", "zoning_category", "zoning_name"])
                  ],
                  ["Lot type", getField(zoning.raw, ["LOT_TYPE"])],
                  ["CD zone", getField(zoning.raw, ["cd_1_number"])],
                  ["Legal 1", getField(zoning.raw, ["narrative_legal_line1", "legal_description"])],
                  ["Legal 2", getField(zoning.raw, ["narrative_legal_line2"])],
                  ["Legal desc", getField(zoning.raw, ["legal_description"])],
                  ["Land value", getField(zoning.raw, ["current_land_value"])],
                  ["Improvement value", getField(zoning.raw, ["current_improvement_value"])]
                ];
                const seen = new Set<string>();
                const formatDisplay = (label: string, val: string) => {
                  if (label === "Updated") {
                    const num = Number(val);
                    if (!Number.isNaN(num)) return new Date(num).toLocaleDateString();
                  }
                  if (label === "Parcel area (sqm)" || label === "Parcel length (m)") {
                    const num = Number(val);
                    if (!Number.isNaN(num)) return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
                  }
                  if (["Land value", "Improvement value"].includes(label)) {
                    const num = Number(val);
                    if (!Number.isNaN(num)) return `$${Math.round(num).toLocaleString()}`;
                  }
                  return val;
                };
                const deduped = items.filter(([label, v]) => {
                  if (v === undefined || v === null) return false;
                  const trimmed = String(v).trim();
                  if (!trimmed) return false;
                  const key = `${label}:${trimmed}`;
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                });
                return deduped.map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[11px] uppercase tracking-tight text-gray-500">{label}</p>
                    <p className="text-sm text-gray-900">{formatDisplay(label, value as string)}</p>
                  </div>
                ));
              })()}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700">Parcel details not available for this lookup.</p>
        )}
      </Card>
      <Card title="Assessment (beta)">
        {assessment?.available ? (
          <div className="space-y-1 text-sm text-gray-800">
            <p>Year: {assessment.year ?? "—"}</p>
            <p>Total: {assessment.value ?? "—"}</p>
            {assessment.land !== undefined && (
              <p>Land: ${Math.round(assessment.land).toLocaleString()}</p>
            )}
            {assessment.improvement !== undefined && (
              <p>Improvement: ${Math.round(assessment.improvement).toLocaleString()}</p>
            )}
            <p>Source: {assessment.class ?? "—"}</p>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-gray-700">
            <p>{assessment?.message ?? "Assessment lookup unavailable in MVP — coming soon."}</p>
          </div>
        )}
        {assessment?.link && (
          <a
            href={assessment.link}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex rounded-lg bg-gray-900 px-3 py-2 text-white shadow hover:bg-gray-800"
          >
            View on BC Assessment
          </a>
        )}
      </Card>
      <Card title="Zoning">
        <div className="space-y-2 text-sm text-gray-800">
          {zoning?.code || zoning?.name ? (
            <div>
              {zoning.code && <p className="font-semibold">Code: {zoning.code}</p>}
              {zoning.name && <p className="text-gray-700">Name: {zoning.name}</p>}
            </div>
          ) : (
            <p className="text-gray-700">
              {zoning?.error ?? "Zoning lookup unavailable in MVP — verify on the official map."}
            </p>
          )}
          {zoningLink ? (
            <a
              href={zoningLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full justify-center rounded-lg bg-brand px-4 py-2 text-white shadow hover:bg-brand-dark"
            >
              Open municipal map
            </a>
          ) : (
            <p className="text-gray-700">Official map link not available for this municipality.</p>
          )}
          {zoning?.raw && getField(zoning.raw, ["WEBLINK"]) && (
            <a
              href={getField(zoning.raw, ["WEBLINK"])}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full justify-center rounded-lg border border-gray-200 px-4 py-2 text-center text-gray-900 hover:border-brand"
            >
              View zoning bylaw
            </a>
          )}
          {zoning?.raw && getField(zoning.raw, ["WEBLINK_DOCS"]) && (
            <a
              href={getField(zoning.raw, ["WEBLINK_DOCS"])}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full justify-center rounded-lg border border-gray-200 px-4 py-2 text-center text-gray-900 hover:border-brand"
            >
              Zoning document library
            </a>
          )}
          {zoning?.source && (
            <p className="text-xs text-gray-500">Source: {zoning.source}</p>
          )}
          {zoning?.raw && (
            <details className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs text-gray-700">
              <summary className="cursor-pointer font-semibold text-gray-800">Raw zoning record</summary>
              <pre className="mt-2 whitespace-pre-wrap break-all text-[11px] leading-tight">
                {JSON.stringify(zoning.raw, null, 2)}
              </pre>
              {Array.isArray((zoning.raw as any).attempts) && (
                <div className="mt-2 space-y-1">
                  <p className="font-semibold">Attempts</p>
                  {(zoning.raw as any).attempts.map((attempt: any, idx: number) => (
                    <div key={idx} className="rounded border border-gray-200 bg-white p-2">
                      <p>URL: {attempt.source}</p>
                      <p>SR: {attempt.inSR}</p>
                      <p>Geometry: {attempt.geometry}</p>
                      {attempt.status && <p>Status: {attempt.status} {attempt.statusText ?? ""}</p>}
                      {attempt.error && <p>Error: {attempt.error}</p>}
                      {attempt.raw && (
                        <pre className="mt-1 whitespace-pre-wrap break-all text-[11px] leading-tight">
                          {JSON.stringify(attempt.raw, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </details>
          )}
        </div>
      </Card>
      <Card title="ALR Check">
        {inAlr === null ? (
          <p className="text-sm text-gray-700">Not enough data.</p>
        ) : (
          <p
            className={clsx(
              "text-sm font-semibold",
              inAlr ? "text-emerald-700" : "text-gray-800"
            )}
          >
            Inside ALR: {inAlr ? "Yes" : "No"}
          </p>
        )}
        <a
          href={ALR_MAP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:border-brand"
        >
          Open ALR map finder
        </a>
        {alrProv && (
          <div className="mt-2 space-y-1 text-xs text-gray-700">
            <p>BC Gov ALR: {alrProv.insideAlr ? "Inside ALR" : "Not in ALR"}</p>
            {alrProv.status && <p>Status: {alrProv.status}</p>}
            <p className="text-[11px] text-gray-500">Source: {alrProv.source ?? "Province of BC"}</p>
          </div>
        )}
      </Card>
      <Card title="Floodplain mapping (index)">
        {floodplain ? (
          <div className="space-y-1 text-sm text-gray-800">
            <p>
              Floodplain study coverage here:{" "}
              <span className="font-semibold">{floodplain.hasMappedFloodplainStudy ? "Yes" : "No"}</span>
            </p>
            {floodplain.projectName && <p>Project: {floodplain.projectName}</p>}
            {floodplain.reportUrl && (
              <a
                href={floodplain.reportUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-brand"
              >
                Open report
              </a>
            )}
            <p className="text-xs text-gray-600">
              This shows mapped floodplain project coverage; verify hazards with official sources.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-700">Floodplain index lookup not available.</p>
        )}
      </Card>
      <Card title="Share">
        <div className="flex flex-col gap-2 text-sm text-gray-800">
          <button
            className="rounded-lg bg-brand px-4 py-2 text-white shadow hover:bg-brand-dark"
            onClick={() => copyText(summary, "summary")}
          >
            Copy summary
          </button>
          {shareUrl && (
            <button
              className="rounded-lg border border-gray-200 px-4 py-2 hover:border-brand"
              onClick={() => copyText(shareUrl, "link")}
            >
              Copy link
            </button>
          )}
          {copied && <span className="text-xs text-emerald-700">Copied {copied}</span>}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function getField(raw: Record<string, unknown> | undefined | null, keys: string[]): string | undefined {
  if (!raw) return undefined;
  for (const key of keys) {
    const val = (raw as any)[key];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      return String(val);
    }
  }
  return undefined;
}
