import type { Metadata } from "next";
import { SeoPageShell } from "@/app/_components/SeoPageShell";
import { getMunicipalityLinks } from "@/lib/municipalityLinks";
import { QuickList } from "./QuickList";

export const metadata: Metadata = {
  title: "Vancouver Zoning Map — Find Your Zone by Address",
  description: "Use an address to find Vancouver zoning map resources and understand what to check in the bylaw."
};

export default function Page() {
  const links = getMunicipalityLinks("vancouver");
  return (
    <SeoPageShell
      title="Vancouver Zoning Map"
      intro={
        <>
          Vancouver zoning determines permitted use, density, and building envelopes. Use the lookup below to find the right location, then open the City of Vancouver zoning resources to verify details.
        </>
      }
    >
      <h2 className="text-xl font-semibold text-gray-900">What to verify</h2>
      <ul className="list-disc space-y-1 pl-5 text-gray-800">
        <li>Zoning district (base zone)</li>
        <li>Density/FSR limits and site coverage</li>
        <li>Heritage, DP areas, view cones, flood requirements</li>
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
          <li>Verify base zoning district</li>
          <li>Check overlays (view cones, heritage, floodplain, DP areas)</li>
          <li>Confirm FSR/density, height, setbacks, and parking</li>
          <li>Review design guidelines or schedules for the zone</li>
          <li>Cross-check for special policies (CD-1, rental/affordable overlays)</li>
        </ol>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Popular Vancouver zoning districts (quick reference)</h3>
        <p className="text-sm text-gray-700">
          These are common zoning district labels you’ll see in Vancouver. This is a high-level overview only—district rules, schedules, and overlays can apply. Always verify details using the official zoning bylaw and City resources.
        </p>
        <QuickList />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">FAQ</h3>
        <div className="space-y-3 text-sm text-gray-800">
          <div>
            <p className="font-semibold">What is CD-1 zoning in Vancouver?</p>
            <p>CD-1 (Comprehensive Development) is site-specific zoning created through rezoning. The exact rules are defined in the CD-1 schedule/bylaw for that area, so always verify using the City’s official documents.</p>
          </div>
          <div>
            <p className="font-semibold">What’s the difference between RS and RT zoning?</p>
            <p>RS districts are generally intended for single-family residential forms (with variations by subtype). RT districts often support two-family/duplex and certain infill forms. Exact permissions depend on the specific sub-district and overlays.</p>
          </div>
          <div>
            <p className="font-semibold">How do I confirm the exact rules (FSR/height/setbacks)?</p>
            <p>Use the official zoning bylaw and district schedules for your site, and check for overlays (heritage, view cones, flood requirements, DP areas). This page provides links to official sources for verification.</p>
          </div>
        </div>
      </div>
    </SeoPageShell>
  );
}
