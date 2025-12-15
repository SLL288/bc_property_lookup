import type { Metadata } from "next";
import { getManifest } from "@data/zoning";
import { canonicalUrl } from "@/lib/seo";
import { ZoningIndexClient } from "@/components/ZoningIndexClient";

export const metadata: Metadata = {
  title: "Burnaby Zoning Codes | BC Property Lookup",
  description:
    "Browse Burnaby zoning districts with official map and bylaw references. Always verify with City of Burnaby sources.",
  alternates: { canonical: canonicalUrl("/burnaby/zoning") }
};

export default function BurnabyZoningIndex() {
  const manifest = getManifest("burnaby");
  return (
    <ZoningIndexClient
      manifest={manifest}
      title="Burnaby Zoning Codes"
      intro="Official Burnaby zoning district list with links to the City's zoning map and bylaws. Always verify using the official PDFs and BurnabyMap. OCP / land-use designations can be checked on the official OCP map."
      linkPrefix="/burnaby/zoning"
      sourceNote="Sources: City of Burnaby zoning bylaw and BurnabyMap. This site is informational - always verify using official sources."
      familyOrder={["R", "RM", "C", "M", "P", "A", "BYLAW"]}
    />
  );
}
