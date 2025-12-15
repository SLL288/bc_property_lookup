import { redirect } from "next/navigation";

export default async function LegacyVancouverZoningCode({
  params
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalized = code.toLowerCase();
  redirect(`/vancouver/zoning/${normalized}`);
}
