import Link from "next/link";
import type { ZoningItem } from "../../../../../data/vancouverZoningManifest";

type Props = {
  zoning: ZoningItem;
  related: ZoningItem[];
};

const familyLine = (z: ZoningItem) => {
  const fam = (z.family ?? z.displayCode.split("-")[0]).toUpperCase();
  const lines: Record<string, string> = {
    R: "Residential inclusive zoning intended to support small-scale housing options while keeping a low-density neighbourhood character.",
    RT: "Two-family / infill-oriented zoning, typically used for ground-oriented housing forms with district-specific conditions.",
    RM: "Multiple dwelling zoning often used for townhouse or apartment forms, depending on the specific RM district schedule.",
    C: "Commercial zoning used for retail/service corridors; exact permissions depend on the district schedule.",
    FC: "False Creek zoning with special planning context and district-specific schedules.",
    RR: "Residential rental zoning that regulates rental housing forms under district-specific rules.",
    I: "Industrial/employment zoning; verify uses and conditions in the district schedule."
  };
  return lines[fam] ?? "This zoning district has its own schedule and regulations. Use the official district schedule for the legal rules.";
};

const Breadcrumb = ({ zoning }: { zoning: ZoningItem }) => (
  <nav className="text-sm text-slate-600">
    <Link href="/" className="underline">
      Home
    </Link>{" "}
    /{" "}
    <Link href="/vancouver/zoning" className="underline">
      Vancouver zoning
    </Link>{" "}
    / <span className="font-medium text-slate-800">{zoning.displayCode}</span>
  </nav>
);

const OfficialLinks = ({ zoning }: { zoning: ZoningItem }) => (
  <div className="mt-3 flex flex-col gap-2">
    <a className="underline text-brand" href={zoning.mapUrl} target="_blank" rel="noreferrer">
      Open official Vancouver zoning map
    </a>
    {zoning.pdfUrl ? (
      <a className="underline text-brand" href={zoning.pdfUrl} target="_blank" rel="noreferrer">
        View official {zoning.displayCode} district schedule (PDF)
      </a>
    ) : (
      <span className="text-slate-500">District schedule PDF: Not available yet</span>
    )}
    <a className="underline text-brand" href={zoning.hubUrl} target="_blank" rel="noreferrer">
      Zoning &amp; land use document library (hub)
    </a>
  </div>
);

const RelatedLinks = ({ current, related }: { current: ZoningItem; related: ZoningItem[] }) => {
  const items = related.filter((z) => z.code !== current.code).slice(0, 8);
  if (!items.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((z) => (
        <Link
          key={z.code}
          href={`/vancouver/zoning/${z.code}`}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm hover:shadow"
        >
          {z.displayCode}
        </Link>
      ))}
    </div>
  );
};

export default function ZoningTemplate({ zoning, related }: Props) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <Breadcrumb zoning={zoning} />

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">
          {zoning.displayCode} Zoning in Vancouver — {zoning.name}
        </h1>
    <p className="text-slate-600">
      Plain-English overview of <strong>{zoning.displayCode}</strong> zoning in Vancouver, with official references.
      Always verify site-specific rules using the official district schedule and the City zoning map.
    </p>
  </header>

      <section>
        <h2 className="text-xl font-semibold">What {zoning.displayCode} zoning means</h2>
        <p className="mt-2 text-slate-700">{familyLine(zoning)}</p>
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
        <OfficialLinks zoning={zoning} />
      </section>

      <section>
        <h2 className="text-xl font-semibold">FAQ</h2>
        <div className="mt-3 space-y-3 text-slate-700">
          <div>
            <h3 className="font-medium">Is this page an official source?</h3>
            <p>No — it’s informational. Always verify details using the City of Vancouver’s zoning map and the official district schedule PDF.</p>
          </div>
          <div>
            <h3 className="font-medium">Why do rules differ within the same code family?</h3>
            <p>Each district schedule (e.g., RT-1 vs RT-11) can have different permitted uses and conditions. Use the specific schedule for your code.</p>
          </div>
          <div>
            <h3 className="font-medium">How do I confirm what applies to my property?</h3>
            <p>Confirm the zoning code on the official map, then review the district schedule and any overlays/policies that apply to the site.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Related Vancouver zoning pages</h2>
        <RelatedLinks current={zoning} related={related} />
      </section>
    </main>
  );
}
