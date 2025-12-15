import { redirect } from "next/navigation";

export default function LegacyVancouverZoningCode({
  params
}: {
  params: { code: string };
}) {
  const code = params.code.toLowerCase();
  redirect(`/vancouver/zoning/${code}`);
}
