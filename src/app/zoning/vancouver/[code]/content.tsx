import type { VancouverZone } from "../../../../../data/vancouverZones";

export function renderMeaning(zone: VancouverZone) {
  const family = zone.code.split("-")[0];
  const familyLine: Record<string, string> = {
    R1: "Residential Inclusive zoning intended to support small-scale housing options while keeping a low-density neighbourhood character.",
    RT: "Two-family / infill-oriented zoning, typically used for ground-oriented housing forms with district-specific conditions.",
    RM: "Multiple dwelling zoning often used for townhouse or apartment forms, depending on the specific RM district schedule.",
    C: "Commercial zoning used for shops and mixed-use corridors depending on the district schedule.",
    FC: "False Creek zoning with special planning context and district-specific schedules.",
    RR: "Rental-focused zoning that regulates rental housing forms under district-specific rules.",
    I: "Industrial or employment zoning; exact permissions depend on the district schedule.",
    CD: "Comprehensive Development zoning - site-specific, created by rezoning; always verify the CD schedule."
  };

  return (
    familyLine[family] ??
    "This zoning district has its own schedule and regulations. Use the official district schedule for the legal rules."
  );
}

export function renderFAQ(zone: VancouverZone) {
  return (
    <div className="mt-3 space-y-4 text-slate-700">
      <div>
        <h3 className="font-medium">Is this page an official source?</h3>
        <p>No - it's informational. Always verify details using the City of Vancouver's zoning map and the official district schedule PDF.</p>
      </div>
      <div>
        <h3 className="font-medium">Why do zoning rules differ even within the same code family?</h3>
        <p>Each district schedule (e.g., RT-1 vs RT-11) can have different permitted uses and conditions. Use the specific schedule for your code.</p>
      </div>
      <div>
        <h3 className="font-medium">How do I confirm what applies to my property?</h3>
        <p>Confirm the zoning code on the official map, then review the district schedule and any overlays/policies that apply to the site.</p>
      </div>
    </div>
  );
}

export function renderRelated(zone: VancouverZone, allZones: VancouverZone[]) {
  const others = allZones.filter((z) => z.code !== zone.code).slice(0, 8);
  return others.map((z) => (
    <a
      key={z.code}
      href={`/vancouver/zoning/${z.code.toLowerCase()}`}
      className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-800 hover:border-brand"
    >
      {z.code}
    </a>
  ));
}
