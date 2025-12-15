"use client";

import { useMemo, useState } from "react";
import { BURNABY_RESOURCES, type CityResource } from "../../../../data/burnabyZoningResources";

const sortResources = (items: CityResource[]) =>
  [...items].sort((a, b) => a.title.localeCompare(b.title, "en", { numeric: true }));

export default function BurnabyZoningIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const s = new Set(BURNABY_RESOURCES.map((r) => r.category).filter(Boolean));
    return ["All", ...Array.from(s).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortResources(
      BURNABY_RESOURCES.filter((r) => (category === "All" ? true : r.category === category)).filter((r) => {
        if (!q) return true;
        return (
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
        );
      })
    );
  }, [query, category]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Burnaby Zoning Resources</h1>
        <p className="text-slate-700">
          Official City of Burnaby resources for zoning verification: map viewer, bylaws, and development applications.
          Use these links to confirm zoning districts, bylaws, and permits directly with Burnaby.
        </p>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search map, bylaw, permits..."
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <a
            key={item.title}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-sm font-semibold text-emerald-700">{item.category}</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">{item.title}</div>
            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
          </a>
        ))}
      </div>

      <p className="mt-8 text-xs text-slate-500">
        Sources: City of Burnaby (official map, bylaws, and development resources). Always verify using the official
        site.
      </p>
    </main>
  );
}
