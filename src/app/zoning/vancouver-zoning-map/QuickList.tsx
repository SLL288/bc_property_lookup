"use client";

import { useMemo, useState } from "react";

const ZONING_ITEMS = [
  { code: "CD-1", desc: "Site-specific Comprehensive Development districts created by rezoning; rules live in the CD-1 schedule.", url: "https://vancouver.ca/home-property-development/zoning-and-land-use-policies.aspx" },
  { code: "RS", desc: "Single-family residential districts (various RS subtypes) for low-density housing.", url: "https://vancouver.ca/home-property-development/zoning-and-land-use-policies.aspx" },
  { code: "RT", desc: "Two-family / duplex / infill-oriented residential districts; varies by RT subtype.", url: "https://vancouver.ca/home-property-development/zoning-and-land-use-policies.aspx" },
  { code: "RM", desc: "Multiple dwelling residential districts for apartments and multi-unit housing (varies by RM subtype).", url: "https://vancouver.ca/home-property-development/zoning-and-land-use-policies.aspx" },
  { code: "C", desc: "Commercial districts for retail and service uses (rules vary by C subtype).", url: "https://vancouver.ca/home-property-development/zoning-and-land-use-policies.aspx" },
  { code: "DD", desc: "Downtown District framework; often paired with overlays and policies.", url: "https://vancouver.ca/home-property-development/zoning-and-land-use-policies.aspx" },
  { code: "FC", desc: "False Creek districts with policy-driven rules; verify in official resources.", url: "https://vancouver.ca/home-property-development/zoning-and-land-use-policies.aspx" },
  { code: "I", desc: "Industrial / employment districts (rules vary by I subtype).", url: "https://vancouver.ca/home-property-development/zoning-and-land-use-policies.aspx" },
  { code: "HA", desc: "Historic Area districts (e.g., Gastown/Chinatown) with additional heritage controls.", url: "https://vancouver.ca/home-property-development/zoning-and-land-use-policies.aspx" }
];

export function QuickList() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ZONING_ITEMS;
    return ZONING_ITEMS.filter((item) => item.code.toLowerCase().includes(q));
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
              <span className="text-base font-semibold text-gray-900">{item.code}</span>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-brand hover:text-brand-dark"
              >
                View official definition
              </a>
            </div>
            <p className="mt-1 text-sm text-gray-800">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
