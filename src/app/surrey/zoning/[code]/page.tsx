import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES } from "@data/zoning/cities";
import { getManifest, getZoning } from "@data/zoning";
import { ZoningTemplate } from "@/components/ZoningTemplate";
import { canonicalUrl } from "@/lib/seo";
import { OcpCard } from "@/components/OcpCard";
import { getOcpSource } from "@/lib/ocpSources";

export const dynamicParams = false;

export function generateStaticParams() {
  return getManifest("surrey").map((z) => ({ code: z.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const zoning = getZoning("surrey", code);
  if (!zoning) {
    return {
      title: "Surrey zoning",
      description: "Surrey zoning district overview.",
      alternates: { canonical: canonicalUrl("/surrey/zoning") }
    };
  }
  return {
    title: `${zoning.displayCode} Zoning in Surrey - ${zoning.name} | BC Property Lookup`,
    description: `Overview of Surrey ${zoning.displayCode} zoning with official references. Always verify using the official map and bylaw.`,
    alternates: { canonical: canonicalUrl(`/surrey/zoning/${zoning.code}`) }
  };
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const zoning = getZoning("surrey", code);
  if (!zoning) return notFound();
  const manifest = getManifest("surrey");
  const related = manifest.filter(
    (x) => x.code !== zoning.code && (x.family === zoning.family || x.category === zoning.category)
  );
  const ocpSource = getOcpSource("surrey");
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <ZoningTemplate zoning={zoning} city={CITIES.surrey} related={related} />
      <OcpCard
        city="surrey"
        designation={null}
        communityPlan={null}
        officialUrl={ocpSource.officialUrl}
        found={false}
      />
    </main>
  );
}
