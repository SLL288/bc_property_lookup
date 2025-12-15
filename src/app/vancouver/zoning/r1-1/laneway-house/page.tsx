import type { Metadata } from "next";
import Link from "next/link";
import { getZoning } from "@data/zoning";

const zoning = getZoning("vancouver", "r1-1");
const mapUrl = zoning?.mapUrl ?? null;
const pdfUrl = zoning?.pdfUrl ?? null;
const hubUrl = zoning?.hubUrl ?? null;
const lanewayInfoUrl = null; // add official URL when available

export const metadata: Metadata = {
  title: "R1-1 Laneway House in Vancouver — Common Questions & Official References",
  description:
    "Answers to common questions about building a laneway house on R1-1 zoning in Vancouver. Informational only. Always verify site-specific rules using official City sources."
};

const Answer = ({ children }: { children: React.ReactNode }) => (
  <p className="text-slate-700">
    {children} Always verify using the official City of Vancouver sources.
  </p>
);

const LinkButton = ({
  href,
  children
}: {
  href: string | null;
  children: React.ReactNode;
}) => {
  if (!href) {
    return (
      <button
        className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-500"
        disabled
      >
        {children} (link pending)
      </button>
    );
  }
  return (
    <a
      className="rounded-lg border border-brand bg-white px-4 py-2 text-sm font-medium text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <nav className="text-sm text-slate-600">
        <Link href="/" className="underline">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/vancouver/zoning" className="underline">
          Vancouver zoning
        </Link>{" "}
        /{" "}
        <Link href="/vancouver/zoning/r1-1" className="underline">
          R1-1
        </Link>{" "}
        / <span className="font-medium text-slate-800">Laneway house</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Laneway House on R1-1 Zoning in Vancouver</h1>
        <p className="text-slate-700">
          R1-1 is a Residential Inclusive district. Laneway housing rules depend on the district schedule, site
          conditions, and applicable policies. This page answers common questions and points to official City resources.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-slate-900">Can I build a laneway house on an R1-1 property in Vancouver?</h3>
            <Answer>
              Laneway houses may be considered on some R1-1 properties, but eligibility depends on factors such as the
              district schedule, lot configuration, lane access, and applicable policies. Not every R1-1 lot qualifies.
              Always confirm using the official City zoning map and the R1-1 district schedule.
            </Answer>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">Is R1-1 zoning the same as RT zoning for laneway houses?</h3>
            <Answer>
              No. R1-1 and RT districts are different zoning categories with different purposes and rules. Even though both
              relate to low-density residential areas, the requirements and conditions for laneway housing can differ by
              district. Always review the district schedule for the exact zoning code.
            </Answer>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">Do I need a development permit or building permit?</h3>
            <Answer>
              Most laneway house projects require permits, and the type of permit(s) depends on the proposal and site
              conditions. In some cases, additional approvals may apply due to design guidelines, neighbourhood context, or
              overlays. Always verify permit requirements on the City of Vancouver website.
            </Answer>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">Can I rent out a laneway house on R1-1 zoning?</h3>
            <Answer>
              Laneway houses are commonly intended as long-term residential units, but rental rules and conditions can
              change over time and may include restrictions. Always confirm current rental and occupancy rules with the
              City before planning or advertising a unit.
            </Answer>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">Does my lot size or shape matter?</h3>
            <Answer>
              Yes. Lot dimensions, lane access, slope, and existing buildings can affect whether a laneway house is
              feasible on an R1-1 property. Two properties with the same zoning code may be treated differently based on
              site conditions.
            </Answer>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">
              What if my property is in a heritage area or development permit area?
            </h3>
            <Answer>
              Additional regulations or approvals may apply if the property is affected by heritage protection,
              development permit areas, or other overlays. These can significantly affect design and approval timelines.
              Always check for overlays on the official zoning map.
            </Answer>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">How do I confirm what applies to my specific property?</h3>
            <Answer>
              Start by confirming the zoning on the official City of Vancouver zoning map, then review the R1-1 district
              schedule and any applicable policies. For site-specific advice, consult a qualified designer or contact the
              City directly.
            </Answer>
          </div>

          <div>
            <h3 className="font-medium text-slate-900">Is this page an official source?</h3>
            <Answer>
              No. This page is for general information only. Always rely on the official City of Vancouver zoning map,
              bylaws, and district schedules for accurate and up-to-date requirements.
            </Answer>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Official references</h2>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={mapUrl}>Open official Vancouver zoning map</LinkButton>
          <LinkButton href={pdfUrl}>View R1-1 district schedule (PDF)</LinkButton>
          <LinkButton href={hubUrl}>Zoning &amp; Land Use Document Library</LinkButton>
          <LinkButton href={lanewayInfoUrl}>Laneway house information (City of Vancouver)</LinkButton>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Related pages</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/vancouver/zoning/r1-1"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm"
          >
            R1-1 zoning overview
          </Link>
          <Link href="/vancouver/zoning" className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm">
            Vancouver zoning index
          </Link>
          <Link href="/vancouver/zoning/rt-1" className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm">
            RT-1 zoning
          </Link>
          <Link href="/vancouver/zoning/rt-11" className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm">
            RT-11 zoning
          </Link>
          <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500">
            Secondary suites in Vancouver (coming soon)
          </span>
        </div>
      </section>
    </main>
  );
}
