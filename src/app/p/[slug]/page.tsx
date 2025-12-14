import type { Metadata } from "next";
import LookupClient from "./LookupClient";

export const runtime = "edge";

const decodeSlug = (slug: string) => {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeSlug(slug);
  return {
    title: `${decoded} — PID, zoning, ALR check (BC)`,
    description: `Lookup PID, municipality, zoning code, and ALR status for ${decoded}. Verify via official sources.`
  };
}

export default async function ResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decoded = decodeSlug(slug);
  return <LookupClient slug={decoded} />;
}
