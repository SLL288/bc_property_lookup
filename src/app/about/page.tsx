import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - BC Property Intelligence Lookup",
  description: "Sources, disclaimers, and contact for the BC Property Intelligence Lookup MVP."
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">About</h1>
      <p className="text-gray-800">
        BC Property Intelligence Lookup is an informational tool focused on Metro Vancouver. Always confirm details with official municipal sources before making decisions.
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Sources</h2>
        <ul className="list-disc space-y-1 pl-5 text-gray-800">
          <li>Geocoding: OpenStreetMap Nominatim</li>
          <li>Municipal maps: official zoning viewers linked per municipality</li>
          <li>ALR dataset: simplified Agricultural Land Reserve boundaries (Metro Vancouver subset)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Rate limiting</h2>
        <p className="text-gray-800">Geocoding is throttled to one request per second per client. We also cache recent lookups locally.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
        <p className="text-gray-800">
          Questions or issues? Email us at{" "}
          <a href="mailto:feedback@example.com" className="text-brand">
            feedback@example.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
