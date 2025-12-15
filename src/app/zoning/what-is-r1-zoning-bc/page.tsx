import type { Metadata } from "next";
import { SeoPageShell } from "@/app/_components/SeoPageShell";

export const metadata: Metadata = {
  title: "What Does R1 Zoning Mean in BC->",
  description: "R1 zoning generally refers to low-density residential (often single-family). Exact rules depend on the municipality."
};

export default function Page() {
  return (
    <SeoPageShell
      title="What Does R1 Zoning Mean in BC->"
      intro={
        <>
          "R1" commonly indicates low-density residential (often single-family), but BC zoning codes are municipal - definitions and rules vary by city.
        </>
      }
    >
      <h2 className="text-xl font-semibold text-gray-900">What to check in the bylaw</h2>
      <ul className="list-disc space-y-1 pl-5 text-gray-800">
        <li>Permitted uses (single family, secondary suite, laneway, etc.)</li>
        <li>FSR or maximum floor area</li>
        <li>Setbacks, height, lot coverage</li>
      </ul>
    </SeoPageShell>
  );
}
