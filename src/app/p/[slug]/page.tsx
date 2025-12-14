import type { Metadata } from "next";
import LookupClient from "./LookupClient";

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
  params: { slug: string };
}): Promise<Metadata> {
  const decoded = decodeSlug(params.slug);
  return {
    title: `${decoded} Property Lookup — zoning link, ALR check, assessment`,
    description: `${decoded} property snapshot with zoning links, ALR check, and assessment quick facts.`
  };
}

export default function ResultPage({ params }: { params: { slug: string } }) {
  const decoded = decodeSlug(params.slug);
  return <LookupClient slug={decoded} />;
}
