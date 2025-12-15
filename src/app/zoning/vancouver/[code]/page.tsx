import { notFound } from "next/navigation";
import { VANCOUVER_ZONES } from "../../../../../data/vancouverZones";
import { renderFAQ, renderMeaning, renderRelated } from "./content";

export const dynamicParams = false;

export function generateStaticParams() {
  return VANCOUVER_ZONES.map((z) => ({ code: z.code.toLowerCase() }));
}

function getZone(codeParam: string) {
  const normalized = codeParam.toUpperCase();
  return VANCOUVER_ZONES.find((z) => z.code.toUpperCase() === normalized);
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const zone = getZone(code);
  if (!zone) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">
          {zone.code} Zoning in Vancouver — {zone.label}
        </h1>
        <p className="text-slate-600">
          Plain-English overview of <strong>{zone.code}</strong> zoning in Vancouver, with official references.
          Always verify site-specific rules using the official district schedule and the City zoning map.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold">What {zone.code} zoning means</h2>
        <p className="mt-2 text-slate-700">{renderMeaning(zone)}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">What to verify for a specific property</h2>
        <ul className="mt-2 list-disc pl-6 text-slate-700">
          <li>Exact district schedule and any site-specific conditions</li>
          <li>Overlays or policies that may apply (e.g., heritage, DP areas)</li>
          <li>Permitted uses and approvals required (outright vs conditional)</li>
          <li>Density, height, setbacks, parking/loading requirements</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Official references</h2>
        <div className="mt-3 flex flex-col gap-2">
          <a className="underline" href={zone.mapUrl} target="_blank" rel="noreferrer">
            Open official Vancouver zoning map
          </a>
          {zone.officialPdf && (
            <a className="underline" href={zone.officialPdf} target="_blank" rel="noreferrer">
              View official {zone.code} district schedule (PDF)
            </a>
          )}
          <a className="underline" href={zone.libraryUrl} target="_blank" rel="noreferrer">
            Zoning & land use document library (hub)
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">FAQ</h2>
        {renderFAQ(zone)}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Related Vancouver zoning pages</h2>
        <div className="mt-3 flex flex-wrap gap-2">{renderRelated(zone, VANCOUVER_ZONES)}</div>
      </section>
    </main>
  );
}
