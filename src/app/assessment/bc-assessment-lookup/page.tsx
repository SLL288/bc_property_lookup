import type { Metadata } from "next";
import { SeoPageShell } from "@/app/_components/SeoPageShell";

export const metadata: Metadata = {
  title: "BC Assessment Lookup (By Address) + How to Interpret It",
  description: "Look up a BC property and learn how assessment values work, what they mean, and where to verify officially."
};

export default function Page() {
  return (
    <SeoPageShell
      title="BC Assessment Lookup"
      intro={
        <>
          BC Assessment values are used primarily for property taxation and may differ from market price. Use the lookup below to start your research, then confirm using official BC Assessment sources.
        </>
      }
    >
      <h2 className="text-xl font-semibold text-gray-900">Assessment vs market price</h2>
      <p className="text-gray-800">
        Assessment is a standardized valuation for tax purposes. Market price depends on timing, condition, zoning potential, and demand.
      </p>
      <h2 className="text-xl font-semibold text-gray-900">What to check next</h2>
      <ul className="list-disc space-y-1 pl-5 text-gray-800">
        <li>Current zoning and permitted use</li>
        <li>ALR status</li>
        <li>Recent comparable sales (if available)</li>
      </ul>
    </SeoPageShell>
  );
}
