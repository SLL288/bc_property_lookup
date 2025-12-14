import type { Metadata } from "next";
import { SeoPageShell } from "@/app/_components/SeoPageShell";

export const metadata: Metadata = {
  title: "What Is FSR in Zoning? (Floor Space Ratio Explained)",
  description: "FSR (Floor Space Ratio) controls how much floor area you can build relative to lot size. Learn how it works and what to verify."
};

export default function Page() {
  return (
    <SeoPageShell
      title="What Is FSR in Zoning?"
      intro={
        <>
          FSR (Floor Space Ratio) limits total buildable floor area compared to your lot size. Example: 0.60 FSR on a 5,000 sq ft lot allows 3,000 sq ft total floor area (before exclusions/bonuses).
        </>
      }
    >
      <h2 className="text-xl font-semibold text-gray-900">Important caveats</h2>
      <ul className="list-disc space-y-1 pl-5 text-gray-800">
        <li>Some areas exclude basements/garages or provide density bonuses</li>
        <li>Setbacks, height, and lot coverage can still constrain build-out</li>
      </ul>
    </SeoPageShell>
  );
}
