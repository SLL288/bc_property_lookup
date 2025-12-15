import type { Metadata } from "next";
import { SeoPageShell } from "@/app/_components/SeoPageShell";
import { AlrLookup } from "./sections/AlrLookup";

export const metadata: Metadata = {
  title: "Is My Property in the ALR-> BC ALR Map & Lookup",
  description: "Check whether an address is inside the Agricultural Land Reserve (ALR) in British Columbia using a map and address lookup."
};

export default function Page() {
  return (
    <SeoPageShell
      title="Is My Property in the ALR->"
      intro={
        <>
          The Agricultural Land Reserve (ALR) protects farmland in British Columbia. Use the lookup below to check whether a property falls inside the ALR, then verify using official sources.
        </>
      }
    >
      <h2 className="text-xl font-semibold text-gray-900">What ALR status can affect</h2>
      <p className="text-gray-800">
        ALR properties may have restrictions on subdivision, non-farm use, and development approvals. Rules vary by location - always confirm with the relevant authorities.
      </p>
      <p className="text-sm text-gray-600">Verify with the Agricultural Land Commission (ALC) and your municipality.</p>

      <AlrLookup />
    </SeoPageShell>
  );
}
