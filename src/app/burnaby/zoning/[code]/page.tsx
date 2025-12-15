import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES } from "@data/zoning/cities";
import { getManifest, getZoning } from "@data/zoning";
import { ZoningTemplate } from "@/components/ZoningTemplate";
import { canonicalUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getManifest("burnaby").map((z) => ({ code: z.code }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const zoning = getZoning("burnaby", code);
  if (!zoning) {
    return {
      title: "Burnaby zoning",
      description: "Burnaby zoning district overview.",
      alternates: { canonical: canonicalUrl("/burnaby/zoning") }
    };
  }
  return {
    title: `${zoning.displayCode} Zoning in Burnaby — ${zoning.name} | BC Property Lookup`,
    description: `Overview of Burnaby ${zoning.displayCode} zoning with official references. Always verify using the official map and bylaw.`,
    alternates: { canonical: canonicalUrl(`/burnaby/zoning/${zoning.code}`) }
  };
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const zoning = getZoning("burnaby", code);
  if (!zoning) return notFound();
  const manifest = getManifest("burnaby");
  const related = manifest.filter(
    (x) => x.code !== zoning.code && (x.family === zoning.family || x.category === zoning.category)
  );
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <ZoningTemplate zoning={zoning} city={CITIES.burnaby} related={related} />
    </main>
  );
}
