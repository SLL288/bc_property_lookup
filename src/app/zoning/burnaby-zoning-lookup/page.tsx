import type { Metadata } from "next";
import { SeoPageShell } from "@/app/_components/SeoPageShell";
import { getMunicipalityLinks } from "@/lib/municipalityLinks";

export const metadata: Metadata = {
  title: "Burnaby Zoning Lookup (Map Links + Quick Guide)",
  description: "Find Burnaby zoning map links and learn the fastest way to verify zoning for an address."
};

export default function Page() {
  const links = getMunicipalityLinks("burnaby");
  return (
    <SeoPageShell
      title="Burnaby Zoning Lookup"
      intro={
        <>
          Use the lookup below to locate an address and jump to official Burnaby zoning and mapping tools. Zoning can include overlays and special regulations—verify on the City of Burnaby sources.
        </>
      }
    >
      <h2 className="text-xl font-semibold text-gray-900">Tips</h2>
      <ul className="list-disc space-y-1 pl-5 text-gray-800">
        <li>Confirm the base zone and any overlays (DP, heritage, environmental, etc.)</li>
        <li>Check setbacks, height, and FSR rules in the bylaw</li>
      </ul>
      {links && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Official links</h3>
          <ul className="list-disc space-y-1 pl-5 text-gray-800">
            <li>
              <a href={links.zoningMapUrl} target="_blank" rel="noreferrer">
                Zoning map / GIS viewer
              </a>
            </li>
            {links.zoningBylawUrl && (
              <li>
                <a href={links.zoningBylawUrl} target="_blank" rel="noreferrer">
                  Zoning bylaw
                </a>
              </li>
            )}
            {links.propertyInfoUrl && (
              <li>
                <a href={links.propertyInfoUrl} target="_blank" rel="noreferrer">
                  Property info / permits
                </a>
              </li>
            )}
            {links.developmentAppsUrl && (
              <li>
                <a href={links.developmentAppsUrl} target="_blank" rel="noreferrer">
                  Development applications
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Checklist</h3>
        <ol className="list-decimal space-y-1 pl-5 text-gray-800">
          <li>Verify the base zoning district</li>
          <li>Check for overlays or special areas (DP, heritage, floodplain)</li>
          <li>Read bylaw sections for density/FSR and use permissions</li>
          <li>Confirm setbacks, height limits, and parking</li>
          <li>Cross-check ALR or environmental constraints if applicable</li>
        </ol>
      </div>
    </SeoPageShell>
  );
}
