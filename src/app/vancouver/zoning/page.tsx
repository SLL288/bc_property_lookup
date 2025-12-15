import type { Metadata } from "next";
import { getManifest } from "../../../../data/zoning";
import { canonicalUrl } from "@/lib/seo";
import { ZoningIndexClient } from "@/components/ZoningIndexClient";

export const metadata: Metadata = {
  title: "Vancouver Zoning Codes | BC Property Lookup",
  description:
    "Browse Vancouver zoning districts with official map and bylaw references. Always verify with City of Vancouver sources.",
  alternates: { canonical: canonicalUrl("/vancouver/zoning") }
};

export default function VancouverZoningIndex() {
  const manifest = getManifest("vancouver");
  return (
    <ZoningIndexClient
      manifest={manifest}
      title="Vancouver Zoning Codes"
      intro="Browse Vancouver zoning district pages. Each code links to a high-level summary plus official map and bylaw references. Always verify the district schedule and overlays for your specific site. OCP/community plan context is linked to the City's official pages."
      linkPrefix="/vancouver/zoning"
      sourceNote="Sources: City of Vancouver zoning map and district schedules. This site is informational - always verify using official sources."
      familyOrder={["C", "FC", "I", "R", "RM", "RR", "RT"]}
      groupByCategory
    />
  );
}
