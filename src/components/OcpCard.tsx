type Props = {
  city: "burnaby" | "surrey" | "vancouver";
  designation?: string | null;
  communityPlan?: string | null;
  officialUrl: string;
  found: boolean;
};

export function OcpCard({ designation, communityPlan, officialUrl, found, city }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Official Community Plan (OCP) / Land Use</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase text-slate-600">{city}</span>
      </div>
      {found ? (
        <div className="space-y-1">
          <div className="text-sm text-slate-600">Designation</div>
          <div className="text-base font-semibold text-slate-900">{designation ?? "Unknown"}</div>
          {communityPlan ? <div className="text-sm text-slate-600">Plan area: {communityPlan}</div> : null}
        </div>
      ) : (
        <p className="text-sm text-slate-700">
          We could not identify an OCP designation from open data for this location.
        </p>
      )}
      <div>
        <a className="underline text-brand" href={officialUrl} target="_blank" rel="noreferrer">
          Verify on official map / OCP page
        </a>
      </div>
      <p className="text-xs text-slate-500">Informational only; always confirm with the City.</p>
    </div>
  );
}
