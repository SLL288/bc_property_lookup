import type { Metadata } from "next";
import { getManifest } from "@data/zoning";
import { canonicalUrl } from "@/lib/seo";
import { ZoningIndexClient } from "@/components/ZoningIndexClient";

export const metadata: Metadata = {
  title: "Surrey Zoning Codes | BC Property Lookup",
  description:
    "Browse Surrey zoning districts with official map and bylaw references. Always verify with City of Surrey sources.",
  alternates: { canonical: canonicalUrl("/surrey/zoning") }
};

export default function SurreyZoningIndex() {
  const manifest = getManifest("surrey");
  return (
    <ZoningIndexClient
      manifest={manifest}
      title="Surrey Zoning Codes"
      intro="Surrey zoning districts with direct links to the official zoning bylaw PDF (page anchors) and COSMOS map. Always verify using the official PDF and city map. OCP designations can be checked via the city's OpenData layer."
      linkPrefix="/surrey/zoning"
      sourceNote="Sources: City of Surrey zoning bylaw (BYL Zoning 12000) and COSMOS. This site is informational - always verify using official sources."
      familyOrder={["R", "RM", "RF", "RA", "BYLAW"]}
    />
  );
}
