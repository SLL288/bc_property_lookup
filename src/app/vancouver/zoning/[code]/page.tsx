import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VAN_ZONING, getZoning } from "../../../../../data/vancouverZoningManifest";
import ZoningTemplate from "./ZoningTemplate";

export const dynamicParams = false;

export function generateStaticParams() {
  return VAN_ZONING.map((z) => ({ code: z.code }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const zoning = getZoning(code);
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
  const zoning = getZoning(code);
  if (!zoning) return notFound();
  return <ZoningTemplate zoning={zoning} related={VAN_ZONING} />;
}
