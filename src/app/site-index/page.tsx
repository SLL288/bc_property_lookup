import type { Metadata } from "next";
import Link from "next/link";
import IndexClient, { type IndexLink } from "./IndexClient";
import { getManifest } from "@data/zoning";
import type { ZoningItem } from "@data/zoning/types";

export const metadata: Metadata = {
  title: "Site Index | BC Property Lookup",
  description: "Browse every zoning index, guide, and lookup tool available on BC Property Lookup."
};

const buildZoningLinks = (city: "vancouver" | "burnaby" | "surrey", manifest: ZoningItem[]): IndexLink[] => {
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);
  const base: IndexLink[] = [{ title: `${cityLabel} zoning index`, href: `/${city}/zoning`, section: "Zoning" }];
  const codes = manifest.map((z) => ({
    title: `${cityLabel} ${z.displayCode} - ${z.name}`,
    href: `/${city}/zoning/${z.code}`,
    section: `${cityLabel} zoning codes`
  }));
  return [...base, ...codes];
};

function buildLinks(): { links: IndexLink[]; featured: { city: string; manifest: ZoningItem[] }[] } {
  const vancouver = getManifest("vancouver");
  const burnaby = getManifest("burnaby");
  const surrey = getManifest("surrey");

  const ocp: IndexLink[] = [
    { title: "Burnaby OCP (official map)", href: "https://experience.arcgis.com/experience/9f5a418ac1694c43a420a845c58b6ad3", section: "OCP / Land Use" },
    { title: "Surrey OCP (PDF)", href: "https://www.surrey.ca/sites/default/files/bylaws/BYL_OCP_2600.pdf", section: "OCP / Land Use" },
    { title: "Vancouver community plans", href: "https://vancouver.ca/home-property-development/community-plans.aspx", section: "OCP / Land Use" }
  ];

  const guides: IndexLink[] = [
    { title: "Laneway house on R1-1 (Vancouver)", href: "/vancouver/zoning/r1-1/laneway-house", section: "Guides" },
    { title: "Accreted land ownership in BC", href: "/bc/accreted-land-ownership", section: "Guides" },
    { title: "What is FSR->", href: "/fsr/what-is-fsr-zoning", section: "Guides" },
    { title: "How to check zoning in BC", href: "/zoning/how-to-check-property-zoning-bc", section: "Guides" }
  ];

  const tools: IndexLink[] = [
    { title: "Property lookup home", href: "/", section: "Property tools" },
    { title: "Assessment lookup", href: "/assessment/bc-assessment-lookup", section: "Property tools" },
    { title: "ALR check", href: "/alr/is-my-property-in-alr", section: "Property tools" },
    { title: "Parcel map by lat/lng", href: "/parcel/parcel-map-bc", section: "Property tools" },
    { title: "PID lookup guide", href: "/pid-lookup", section: "Property tools" },
    { title: "Floodplain check", href: "/floodplain-check", section: "Property tools" }
  ];

  return {
    links: [
      ...buildZoningLinks("vancouver", vancouver),
      ...buildZoningLinks("burnaby", burnaby),
      ...buildZoningLinks("surrey", surrey),
      ...tools,
      ...ocp,
      ...guides,
      { title: "About", href: "/about", section: "Other" }
    ],
    featured: [
      { city: "vancouver", manifest: vancouver },
      { city: "burnaby", manifest: burnaby },
      { city: "surrey", manifest: surrey }
    ]
  };
}

export default function SiteIndexPage() {
  const { links, featured } = buildLinks();
  const sections = Array.from(new Set(links.map((l) => l.section)));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Site Index</h1>
        <p className="text-slate-700">
          Browse every major zoning page, guide, and lookup tool. Use the search box to filter links instantly.
        </p>
        <p className="text-sm text-slate-600">
          Prefer zoning by city? Jump directly to{" "}
          <Link href="/vancouver/zoning" className="underline text-brand">
            Vancouver zoning
          </Link>
          ,{" "}
          <Link href="/burnaby/zoning" className="underline text-brand">
            Burnaby zoning
          </Link>{" "}
          or{" "}
          <Link href="/surrey/zoning" className="underline text-brand">
            Surrey zoning
          </Link>
          .
        </p>
      </header>

      <IndexClient sections={sections} links={links} featuredZoning={featured} />
    </div>
  );
}
