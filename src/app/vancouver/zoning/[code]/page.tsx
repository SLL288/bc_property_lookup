import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES } from "@data/zoning/cities";
import { getManifest, getZoning } from "@data/zoning";
import { ZoningTemplate } from "@/components/ZoningTemplate";

export const dynamicParams = false;

export function generateStaticParams() {
  return getManifest("vancouver").map((z) => ({ code: z.code }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const zoning = getZoning("vancouver", code);
  if (!zoning) {
    return {
      title: "Vancouver zoning",
      description: "Vancouver zoning district overview."
    };
  }
  return {
    title: `${zoning.displayCode} Zoning in Vancouver — ${zoning.name} | BC Property Lookup`,
    description: `Plain-English overview of Vancouver ${zoning.displayCode} zoning with official references. Always verify using the official district schedule and City zoning map.`
  };
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const zoning = getZoning("vancouver", code);
  if (!zoning) return notFound();
  const manifest = getManifest("vancouver");
  const related = manifest.filter(
    (x) => x.code !== zoning.code && (x.family === zoning.family || x.category === zoning.category)
  );
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <ZoningTemplate zoning={zoning} city={CITIES.vancouver} related={related} />
    </main>
  );
}
