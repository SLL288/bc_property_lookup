import Link from "next/link";
import type { CityInfo, ZoningItem } from "../../data/zoning/types";

type Props = {
  zoning: ZoningItem;
  city: CityInfo;
  related: ZoningItem[];
};

const familyLine = (z: ZoningItem) => {
  const fam = (z.family ?? z.displayCode.split("-")[0]).toUpperCase();
  const lines: Record<string, string> = {
    R: "Residential zoning often focused on low-density neighbourhood character. Verify specifics in the district schedule.",
    RT: "Two-family / infill-oriented zoning, typically ground-oriented housing. Verify site-specific conditions in the schedule.",
    RM: "Multiple dwelling zoning often used for townhouse or apartment forms. Confirm details in the district schedule.",
    C: "Commercial zoning for retail/service corridors. Exact permissions vary by district schedule.",
    FC: "Special False Creek districts with their own schedules and policies.",
    RR: "Residential rental zoning with district-specific rules. Verify in the schedule.",
    I: "Industrial/employment zoning; uses and conditions are schedule-specific."
  };
  return lines[fam] ?? "This zoning district has its own schedule and regulations. Use the official schedule for legal rules.";
};

const OfficialLinks = ({ zoning }: { zoning: ZoningItem }) => (
  <div className="mt-3 flex flex-col gap-2">
    <a className="underline text-brand w-fit break-words" href={zoning.mapUrl} target="_blank" rel="noreferrer">
      Open official zoning map
    </a>
    {zoning.pdfUrl ? (
      <div className="flex flex-col">
        <a className="underline text-brand w-fit break-words" href={zoning.pdfUrl} target="_blank" rel="noreferrer">
          Download / read official {zoning.displayCode} schedule
        </a>
        {zoning.pdfPage ? (
          <span className="text-xs text-slate-500">Starts around page {zoning.pdfPage}</span>
        ) : null}
      </div>
    ) : (
      <span className="text-slate-500 text-sm">District schedule PDF: Not available yet</span>
    )}
    {zoning.bylawUrl && (
      <a className="underline text-brand w-fit break-words" href={zoning.bylawUrl} target="_blank" rel="noreferrer">
        Zoning bylaw page
      </a>
    )}
    {zoning.hubUrl && (
      <a className="underline text-brand w-fit break-words" href={zoning.hubUrl} target="_blank" rel="noreferrer">
        Document library / hub
      </a>
    )}
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
          href={`/${current.city}/zoning/${z.code}`}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm hover:shadow"
        >
          {z.displayCode}
        </Link>
      ))}
    </div>
  );
};

export function ZoningTemplate({ zoning, city, related }: Props) {
  const zoningIndexHref = { pathname: city.zoningIndexPath };

  return (
    <div className="space-y-8">
      <nav className="text-sm text-slate-600">
        <Link href="/" className="underline">
          Home
        </Link>{" "}
        /{" "}
        <Link href={zoningIndexHref} className="underline">
          {city.name} zoning
        </Link>{" "}
        / <span className="font-medium text-slate-800">{zoning.displayCode}</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">
          {zoning.displayCode} Zoning in {city.name} — {zoning.name}
        </h1>
      <p className="text-slate-600">
        Plain-English overview of <strong>{zoning.displayCode}</strong> zoning in {city.name}, with official
        references. Always verify site-specific rules using the official map and schedule/bylaw.
      </p>
      {zoning.lastVerified ? (
        <p className="text-xs text-slate-500">Last updated: {zoning.lastVerified}</p>
      ) : null}
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
            <p>No — it’s informational. Always verify details using the city’s zoning map and the official schedule/bylaw.</p>
          </div>
          <div>
            <h3 className="font-medium">Why do rules differ within the same code family?</h3>
            <p>Each district schedule can have different permitted uses and conditions. Use the specific schedule for your code.</p>
          </div>
          <div>
            <h3 className="font-medium">How do I confirm what applies to my property?</h3>
            <p>Confirm the zoning code on the official map, then review the schedule and any overlays/policies that apply to the site.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Related zoning pages</h2>
        <RelatedLinks current={zoning} related={related} />
      </section>
    </div>
  );
}
