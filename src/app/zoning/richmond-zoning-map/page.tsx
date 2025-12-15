import type { Metadata } from "next";
import { SeoPageShell } from "@/app/_components/SeoPageShell";
import { getMunicipalityLinks } from "@/lib/municipalityLinks";

export const metadata: Metadata = {
  title: "Richmond Zoning Map - Find Your Zone by Address",
  description: "Locate a Richmond address and open official zoning map resources to verify zone, overlays, and regulations."
};

export default function Page() {
  const links = getMunicipalityLinks("richmond");
  return (
    <SeoPageShell
      title="Richmond Zoning Map"
      intro={
        <>
          Richmond zoning rules are defined by municipal bylaws. Use the lookup to locate an address, then confirm the zoning district and any overlays on official sources.
        </>
      }
    >
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
          <li>Confirm base zone and overlays</li>
          <li>Review bylaw FSR/density, setbacks, and height</li>
          <li>Check DP areas, floodplain, or other special controls</li>
          <li>Verify parking and servicing requirements for your use</li>
        </ol>
      </div>
    </SeoPageShell>
  );
}
