import type { Metadata } from "next";
import { SeoPageShell } from "@/app/_components/SeoPageShell";

export const metadata: Metadata = {
  title: "How to Check Property Zoning in BC (Step-by-Step)",
  description: "A step-by-step checklist to check zoning in British Columbia using municipal maps and bylaws."
};

export default function Page() {
  return (
    <SeoPageShell
      title="How to Check Property Zoning in BC"
      intro={
        <>
          Zoning is municipal. The fastest method is: locate the address, open the municipality's zoning map, confirm the zone and overlays, and read the bylaw sections for use and density.
        </>
      }
    >
      <ol className="list-decimal space-y-2 pl-5 text-gray-800">
        <li>Find the municipality (city) for the property</li>
        <li>Open the official zoning map / GIS viewer</li>
        <li>Confirm the base zone and overlays</li>
        <li>Open the zoning bylaw and check permitted use</li>
        <li>Check FSR, height, setbacks, parking, and special requirements</li>
      </ol>
    </SeoPageShell>
  );
}
