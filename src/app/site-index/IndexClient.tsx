"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import type { ZoningItem } from "@data/zoning/types";

export type IndexLink = { title: string; href: string; section: string };

type Props = {
  sections: string[];
  links: IndexLink[];
  featuredZoning: {
    city: string;
    manifest: ZoningItem[];
  }[];
};

export default function IndexClient({ sections, links, featuredZoning }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter((l) => l.title.toLowerCase().includes(q) || l.href.toLowerCase().includes(q));
  }, [query, links]);

  return (
    <div className="space-y-8">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search any topic, code, or tool..."
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-brand/60"
      />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Zoning (quick links)</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {featuredZoning.map((city) => (
            <div key={city.city} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="font-semibold text-slate-900 capitalize">{city.city}</div>
              <div className="mt-1 text-xs text-slate-500">
                {city.manifest.slice(0, 6).map((z) => z.displayCode).join(", ")}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href={`/${city.city}/zoning` as Route} className="text-sm font-semibold text-brand underline">
                  View index
                </Link>
                {city.manifest.slice(0, 4).map((z) => (
                  <Link
                    key={z.code}
                    href={`/${city.city}/zoning/${z.code}` as Route}
                    className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:shadow"
                  >
                    {z.displayCode}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {sections.map((section) => {
        const items = filtered.filter((l) => l.section === section);
        if (!items.length) return null;
        return (
          <section key={section} className="space-y-3">
            <h2 className="text-xl font-semibold">{section}</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {items.map((l) => {
                const isExternal = l.href.startsWith("http");
                if (isExternal) {
                  return (
                    <a
                      key={`${section}-${l.href}`}
                      href={l.href}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="font-semibold text-slate-900">{l.title}</div>
                      <div className="text-xs text-slate-500">{l.href}</div>
                    </a>
                  );
                }
                return (
                  <Link
                    key={`${section}-${l.href}`}
                    href={l.href as Route}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                  >
                    <div className="font-semibold text-slate-900">{l.title}</div>
                    <div className="text-xs text-slate-500">{l.href}</div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
