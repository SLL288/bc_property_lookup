import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Do I Own Accreted Land in British Columbia? | BC Property Lookup",
  description:
    "Plain-English guide to accreted land ownership in British Columbia, with official government and court references. Informational only."
};

const Answer = ({ children }: { children: React.ReactNode }) => (
  <p className="text-slate-700">
    {children} Always verify using official BC sources.
  </p>
);

const OfficialLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    className="rounded-lg border border-brand bg-white px-4 py-2 text-sm font-medium text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow"
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    {children}
  </a>
);

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <nav className="text-sm text-slate-600">
        <Link href="/" className="underline">
          Home
        </Link>{" "}
        / <span className="font-medium text-slate-800">Accreted land ownership (BC)</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Do I Own Accreted Land in British Columbia?</h1>
        <p className="text-slate-700">
          Accreted land refers to land gradually formed by natural processes (such as sediment buildup along water), and
          ownership in BC depends on legal principles, boundary definitions, and title records. This page explains common
          questions and points readers to official sources.
        </p>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Disclaimer: This page is for general information only and does not constitute legal advice. Land ownership
          questions must be verified using official land title records and applicable law.
        </div>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">What is accreted land?</h2>
        <p className="text-slate-700">
          Accretion is the gradual, natural addition of land. It is different from sudden changes (avulsion) and is
          commonly seen near rivers, lakes, and shorelines. Outcomes depend on how the land formed and how boundaries are
          defined.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Do property owners automatically own accreted land?</h2>
        <p className="text-slate-700">
          In some cases, gradual natural accretion may attach to the upland parcel; in other cases, land may remain Crown
          land. Ownership depends on how boundaries are defined, whether the waterbody is navigable, how changes occurred,
          and how title boundaries are described. Ownership must be confirmed using official land title records and
          applicable law.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Why accreted land ownership is not automatic</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-700">
          <li>Water boundaries can be ambulatory or fixed</li>
          <li>Crown rights may apply</li>
          <li>Sudden vs gradual changes matter</li>
          <li>Survey evidence may be required</li>
          <li>Case law affects interpretation</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How do I check if accreted land is part of my property?</h2>
        <ol className="list-decimal space-y-1 pl-5 text-slate-700">
          <li>Review your land title and legal description</li>
          <li>Check surveyed boundaries (if available)</li>
          <li>Identify whether the adjacent waterbody is navigable</li>
          <li>Review applicable case law principles</li>
          <li>Consult a BC land surveyor or property lawyer</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-slate-900">Is accreted land always private property?</h3>
            <Answer>
              No. Accreted land is not automatically private property. Ownership depends on legal boundaries, Crown rights,
              and how the land formed.
            </Answer>
          </div>
          <div>
            <h3 className="font-medium text-slate-900">What is the difference between accretion and avulsion?</h3>
            <Answer>
              Accretion is gradual and natural. Avulsion is sudden (e.g., flooding or a rapid river course change). These
              are treated differently under the law.
            </Answer>
          </div>
          <div>
            <h3 className="font-medium text-slate-900">Can I build on accreted land?</h3>
            <Answer>
              Construction on accreted land often requires confirming ownership, zoning compliance, and regulatory
              approvals. Never assume buildability without verification.
            </Answer>
          </div>
          <div>
            <h3 className="font-medium text-slate-900">Does my land title show accreted land?</h3>
            <Answer>
              Not always. Titles may not reflect gradual changes. Surveys or boundary reviews may be required.
            </Answer>
          </div>
          <div>
            <h3 className="font-medium text-slate-900">Who decides ownership disputes?</h3>
            <Answer>
              Ownership disputes are resolved through land title examination, survey evidence, and ultimately the courts.
            </Answer>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Official authority references</h2>
        <div className="flex flex-wrap gap-3">
          <OfficialLink href="https://ltsa.ca">Land Title &amp; Survey Authority of BC (LTSA)</OfficialLink>
          <OfficialLink href="https://www2.gov.bc.ca/gov/content/industry/crown-land-water">
            BC Ministry of Water, Land and Resource Stewardship (Crown land)
          </OfficialLink>
          <OfficialLink href="https://www.canlii.org/en/bc/">BC Supreme Court decisions (CanLII – accretion cases)</OfficialLink>
          <OfficialLink href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96245_01">
            Land Act (British Columbia)
          </OfficialLink>
          <OfficialLink href="https://abcls.ca">BC Land Surveyors (Association)</OfficialLink>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Related pages</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/vancouver/zoning" className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm">
            Vancouver zoning overview
          </Link>
          <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500">
            Property boundary basics (coming soon)
          </span>
          <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500">
            Riparian &amp; waterfront zoning (coming soon)
          </span>
          <Link
            href="/vancouver/zoning/r1-1/laneway-house"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm"
          >
            Laneway house guide (Vancouver)
          </Link>
        </div>
      </section>
    </main>
  );
}
