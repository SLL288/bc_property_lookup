"use client";

import { useMemo, useState } from "react";
import { getManifest } from "../../../../data/zoning";

export function QuickList() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = getManifest("vancouver").sort((a, b) =>
      a.displayCode.localeCompare(b.displayCode, "en", { numeric: true })
    );
    if (!q) return items;
    return items.filter(
      (item) =>
        item.displayCode.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a zoning code (e.g., CD)"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((item) => (
          <div key={item.code} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-gray-900">{item.displayCode}</div>
                <div className="text-xs uppercase tracking-wide text-gray-500">{item.category}</div>
              </div>
              <a href={`/vancouver/zoning/${item.code}`} className="text-sm font-medium text-brand hover:text-brand-dark">
                View zone
              </a>
            </div>
            <p className="mt-1 text-sm text-gray-800">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
