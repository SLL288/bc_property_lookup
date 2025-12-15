"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import type { ZoningItem } from "@data/zoning/types";

type Props = {
  manifest: ZoningItem[];
  title: string;
  intro: string;
  linkPrefix: string;
  sourceNote: string;
  familyOrder?: string[];
  groupByCategory?: boolean;
};

const normalize = (value: string) => value.trim().toLowerCase();

export function ZoningIndexClient({
  manifest,
  title,
  intro,
  linkPrefix,
  sourceNote,
  familyOrder,
  groupByCategory
}: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    manifest.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [manifest]);

  const ordered = useMemo(() => {
    const q = normalize(query);
    const familyRank = familyOrder
      ? Object.fromEntries(familyOrder.map((f, idx) => [f, idx]))
      : undefined;

    const filtered = manifest.filter((m) => {
      const matchCat = category === "All" || m.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        m.code.includes(q) ||
        m.displayCode.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        (m.category ?? "").toLowerCase().includes(q)
      );
    });

    return filtered.sort((a, b) => {
      if (familyRank) {
        const ra = familyRank[a.family ?? ""] ?? 999;
        const rb = familyRank[b.family ?? ""] ?? 999;
        if (ra !== rb) return ra - rb;
      }
      return a.displayCode.localeCompare(b.displayCode, "en", { numeric: true });
    });
  }, [manifest, query, category, familyOrder]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        <p className="text-slate-700">{intro}</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search code (e.g., RT-1) or keyword (e.g., residential)..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/30"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {groupByCategory ? (
        <CategoryGrid items={ordered} linkPrefix={linkPrefix} />
      ) : (
        <CardGrid items={ordered} linkPrefix={linkPrefix} />
      )}

      <p className="text-xs text-slate-500">{sourceNote}</p>
    </main>
  );
}

function CardGrid({ items, linkPrefix }: { items: ZoningItem[]; linkPrefix: string }) {
  if (!items.length) {
    return <p className="text-sm text-slate-600">No matching zoning codes.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((z) => (
        <Link
          key={z.code}
          href={`${linkPrefix}/${z.code}` as Route}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="text-sm font-semibold text-brand">{z.displayCode}</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">{z.name}</div>
          <div className="mt-1 text-sm text-slate-500">{z.category}</div>
        </Link>
      ))}
    </div>
  );
}

function CategoryGrid({ items, linkPrefix }: { items: ZoningItem[]; linkPrefix: string }) {
  if (!items.length) {
    return <p className="text-sm text-slate-600">No matching zoning codes.</p>;
  }
  const grouped = items.reduce<Record<string, ZoningItem[]>>((acc, item) => {
    const key = item.category || "Other";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([cat, list]) => (
        <div key={cat} className="space-y-2">
          <div className="text-sm font-semibold text-slate-700">{cat}</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((z) => (
              <Link
                key={z.code}
                href={`${linkPrefix}/${z.code}` as Route}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-sm font-semibold text-brand">{z.displayCode}</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{z.name}</div>
                <div className="mt-1 text-sm text-slate-500">{z.category}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
