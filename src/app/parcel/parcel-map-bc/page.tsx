import type { Metadata } from "next";
import { SeoPageShell } from "@/app/_components/SeoPageShell";

export const metadata: Metadata = {
  title: "Parcel Map BC (By Lat/Lng) — Start a Property Lookup Fast",
  description: "Use latitude/longitude or an address to start researching parcels, zoning, and assessments in BC."
};

export default function Page() {
  return (
    <SeoPageShell
      title="Parcel Map BC (By Lat/Lng)"
      intro={
        <>
          If you have coordinates (latitude/longitude), you can quickly locate a parcel and then open municipal GIS tools. Use the lookup below to search by address and validate the area first.
        </>
      }
    >
      <p className="text-gray-800">
        Tip: For best results, confirm the municipality first, then use the city’s parcel / zoning viewer.
      </p>
    </SeoPageShell>
  );
}
