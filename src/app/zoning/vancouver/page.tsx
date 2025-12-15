import Link from "next/link";
import { VANCOUVER_ZONES } from "../../../../data/vancouverZones";

export const dynamicParams = false;

export default function VancouverZoningIndex() {
  const zones = [...VANCOUVER_ZONES].sort((a, b) => a.code.localeCompare(b.code));

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Vancouver Zoning Codes</h1>
        <p className="text-slate-700">
          Browse Vancouver zoning district pages. Each code links to a high-level summary plus official map and bylaw
          references. Always verify the district schedule and overlays for your specific site.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {zones.map((zone) => (
          <Link
            key={zone.code}
            href={`/zoning/vancouver/${zone.code.toLowerCase()}`}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow"
          >
            <div className="text-sm font-medium text-brand">{zone.code}</div>
            <div className="text-base font-semibold text-slate-900">{zone.label}</div>
            {zone.group ? <div className="text-xs text-slate-600 mt-1">{zone.group}</div> : null}
          </Link>
        ))}
      </div>
    </main>
  );
}
