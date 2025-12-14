import { ReactNode } from "react";
import { SearchBox } from "@/components/SearchBox";

export function SeoPageShell({
  title,
  intro,
  children
}: {
  title: string;
  intro: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <div className="leading-relaxed text-gray-800">{intro}</div>
      </header>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <SearchBox />
      </div>

      {children ? <section className="space-y-6">{children}</section> : null}
    </div>
  );
}
