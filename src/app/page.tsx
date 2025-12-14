import type { Metadata } from "next";
import { SearchBox } from "@/components/SearchBox";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "BC Property Intelligence Lookup — zoning, ALR, assessment snapshot",
  description: "Instant property snapshot for Metro Vancouver: zoning map links, ALR check, and assessment quick facts.",
  openGraph: {
    title: "BC Property Intelligence Lookup",
    description: "Instant property snapshot for Metro Vancouver.",
    url: siteUrl
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BC Property Intelligence Lookup",
  description: metadata.description,
  url: siteUrl,
  applicationCategory: "RealEstateApplication",
  operatingSystem: "Web"
};

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-dark">Metro Vancouver focus</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl">
          BC Property Intelligence Lookup
        </h1>
        <p className="mt-3 text-lg text-gray-700">
          Enter an address to get zoning links, ALR status, and assessment quick facts in seconds.
        </p>
      </section>
      <SearchBox />
      <section className="grid w-full gap-4 md:grid-cols-3">
        {["Instant geocoding", "Municipal zoning links", "ALR boundary check"].map((item) => (
          <div key={item} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-gray-900">{item}</p>
            <p className="mt-1 text-sm text-gray-700">
              Powered by open data and ready for Cloudflare Pages deployment.
            </p>
          </div>
        ))}
      </section>
      <section className="w-full space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Popular lookups</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { href: "/alr/is-my-property-in-alr", title: "Is my property in the ALR?", desc: "ALR boundary check + official source links." },
            { href: "/assessment/bc-assessment-lookup", title: "BC Assessment lookup", desc: "What assessment means + where to verify." },
            { href: "/zoning/burnaby-zoning-lookup", title: "Burnaby zoning lookup", desc: "Zoning viewer links + quick guidance." },
            { href: "/zoning/vancouver-zoning-map", title: "Vancouver zoning map", desc: "Find zoning maps and basic interpretation." },
            { href: "/zoning/how-to-check-property-zoning-bc", title: "How to check zoning in BC", desc: "Step-by-step checklist and links." },
            { href: "/zoning/what-is-r1-zoning-bc", title: "What does R1 zoning mean?", desc: "R1 explained with municipal caveats." },
            { href: "/fsr/what-is-fsr-zoning", title: "What is FSR?", desc: "FSR explained with examples." },
            { href: "/parcel/parcel-map-bc", title: "Parcel map by lat/lng", desc: "Use coordinates to start research fast." }
          ].map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow"
            >
              <div className="font-semibold text-gray-900">{p.title}</div>
              <div className="mt-1 text-sm text-gray-700">{p.desc}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
