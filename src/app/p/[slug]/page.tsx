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
    title: `${decoded} Property Lookup — zoning link, ALR check, assessment`,
    description: `${decoded} property snapshot with zoning links, ALR check, and assessment quick facts.`
  };
}

export default async function ResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decoded = decodeSlug(slug);
  return <LookupClient slug={decoded} />;
}
