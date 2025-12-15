"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getManifest } from "../../../../data/zoning";
import type { ZoningItem } from "../../../../data/zoning/types";

const familyOrder = ["C", "FC", "I", "R", "RM", "RR", "RT"];

const sortCode = (a: ZoningItem, b: ZoningItem) => {
  const famA = (a.family ?? a.displayCode.split("-")[0]).toUpperCase();
  const famB = (b.family ?? b.displayCode.split("-")[0]).toUpperCase();
  const famIdxA = familyOrder.indexOf(famA) === -1 ? 999 : familyOrder.indexOf(famA);
  const famIdxB = familyOrder.indexOf(famB) === -1 ? 999 : familyOrder.indexOf(famB);
  if (famIdxA !== famIdxB) return famIdxA - famIdxB;
  return a.displayCode.localeCompare(b.displayCode, "en", { numeric: true });
};

export default function VancouverZoningIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const manifest = useMemo(() => getManifest("vancouver"), []);

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

  const grouped = useMemo(() => {
    const byCat = new Map<string, ZoningItem[]>();
    filtered.forEach((z) => {
      const catKey = z.category || "Other";
      if (!byCat.has(catKey)) byCat.set(catKey, []);
      byCat.get(catKey)!.push(z);
    });
    return Array.from(byCat.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Vancouver Zoning Codes</h1>
        <p className="text-slate-700">
          Browse Vancouver zoning district pages. Each code links to a high-level summary plus official map and bylaw
          references. Always verify the district schedule and overlays for your specific site.
        </p>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search code (e.g., RT-1) or keyword (e.g., duplex)…"
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

      <div className="space-y-6">
        {grouped.map(([catName, items]) => (
          <div key={catName} className="space-y-3">
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">{catName}</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((z) => (
                <Link
                  key={z.code}
                  href={`/vancouver/zoning/${z.code}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="text-sm font-semibold text-emerald-700">{z.displayCode}</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{z.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{z.category}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-slate-500">
        Sources: City of Vancouver zoning map and district schedules. This site is informational—always verify using
        official sources.
      </p>
    </main>
  );
}
