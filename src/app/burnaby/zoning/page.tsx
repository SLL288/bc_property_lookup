"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getManifest } from "@data/zoning";
import type { ZoningItem } from "@data/zoning/types";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Burnaby Zoning Codes | BC Property Lookup",
  description:
    "Browse Burnaby zoning districts with official map and bylaw references. Always verify with City of Burnaby sources.",
  alternates: { canonical: canonicalUrl("/burnaby/zoning") }
};

const familyOrder = ["R", "RM", "C", "M", "P", "A", "BYLAW"];

const sortCode = (a: ZoningItem, b: ZoningItem) => {
  const famA = (a.family ?? a.displayCode.split("-")[0]).toUpperCase();
  const famB = (b.family ?? b.displayCode.split("-")[0]).toUpperCase();
  const famIdxA = familyOrder.indexOf(famA) === -1 ? 999 : familyOrder.indexOf(famA);
  const famIdxB = familyOrder.indexOf(famB) === -1 ? 999 : familyOrder.indexOf(famB);
  if (famIdxA !== famIdxB) return famIdxA - famIdxB;
  return a.displayCode.localeCompare(b.displayCode, "en", { numeric: true });
};

export default function BurnabyZoningIndex() {
  const manifest = useMemo(() => getManifest("burnaby"), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const s = new Set(manifest.map((z) => z.category).filter(Boolean));
    return ["All", ...Array.from(s).sort()];
  }, [manifest]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return manifest
      .filter((z) => (category === "All" ? true : z.category === category))
      .filter((z) => {
        if (!q) return true;
        return (
          z.code.includes(q) ||
          z.displayCode.toLowerCase().includes(q) ||
          z.name.toLowerCase().includes(q) ||
          z.category.toLowerCase().includes(q)
        );
      })
      .sort(sortCode);
  }, [query, category, manifest]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Burnaby Zoning Codes</h1>
        <p className="text-slate-700">
          Official Burnaby zoning district list with links to the City’s zoning map and bylaws. Always verify using the
          official PDFs and BurnabyMap.
        </p>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search code (e.g., R5) or keyword…"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand/60"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((z) => (
          <Link
            key={z.code}
            href={`/burnaby/zoning/${z.code}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-semibold text-emerald-700">{z.displayCode}</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">{z.name}</div>
            <div className="mt-1 text-sm text-slate-500">{z.category}</div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-xs text-slate-500">
        Sources: City of Burnaby zoning bylaw and BurnabyMap. This site is informational—always verify using official
        sources.
      </p>
    </main>
  );
}
