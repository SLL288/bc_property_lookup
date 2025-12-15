import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES } from "@data/zoning/cities";
import { getManifest, getZoning } from "@data/zoning";
import { ZoningTemplate } from "@/components/ZoningTemplate";

export const dynamicParams = false;

export function generateStaticParams() {
  return getManifest("surrey").map((z) => ({ code: z.code }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const zoning = getZoning("surrey", code);
  if (!zoning) {
    return {
      title: "Surrey zoning",
      description: "Surrey zoning district overview."
    };
  }
  return {
    title: `${zoning.displayCode} Zoning in Surrey — ${zoning.name} | BC Property Lookup`,
    description: `Overview of Surrey ${zoning.displayCode} zoning with official references. Always verify using the official map and bylaw.`
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
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <ZoningTemplate zoning={zoning} city={CITIES.surrey} related={related} />
    </main>
  );
}
