import type { Metadata } from "next";
import LookupClient from "./LookupClient";

type PageProps = {
  params: { slug: string };
};

const decodeSlug = (slug: string) => {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const decoded = decodeSlug(params.slug);
  return {
    title: `${decoded} Property Lookup — zoning link, ALR check, assessment`,
    description: `${decoded} property snapshot with zoning links, ALR check, and assessment quick facts.`
  };
}

export default function ResultPage({ params }: PageProps) {
  const decoded = decodeSlug(params.slug);
  return <LookupClient slug={decoded} />;
}
