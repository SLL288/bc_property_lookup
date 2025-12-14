import type { Metadata } from "next";
import { SeoPageShell } from "@/app/_components/SeoPageShell";
import { getMunicipalityLinks } from "@/lib/municipalityLinks";

export const metadata: Metadata = {
  title: "Surrey Zoning Lookup (Map Links + Quick Guide)",
  description: "Find Surrey zoning map links and learn the fastest way to verify zoning for an address."
};

export default function Page() {
  const links = getMunicipalityLinks("surrey");
  return (
    <SeoPageShell
      title="Surrey Zoning Lookup"
      intro={
        <>
          Use the lookup below to locate an address, then verify zoning using official City of Surrey mapping tools and bylaws.
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
          <li>Review FSR/density, setbacks, and height in the zoning bylaw</li>
          <li>Check any development permit areas or special plans</li>
          <li>Validate servicing/parking requirements for your use</li>
        </ol>
      </div>
    </SeoPageShell>
  );
}
