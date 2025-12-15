"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { searchSuggestions, type GeocodeSuggestion } from "@/lib/geocode";

const EXAMPLES = [
  "15210 82 Ave, Surrey, BC",
  "888 Burrard St, Vancouver, BC",
  "4949 Canada Way, Burnaby, BC"
];

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const slug = encodeURIComponent(query.trim());
    router.push(`/p/${slug}`);
  };

  const useExample = (value: string) => {
    setQuery(value);
    const slug = encodeURIComponent(value);
    router.push(`/p/${slug}`);
  };

  const showSuggestions = useMemo(
    () => focused && suggestions.length > 0 && query.length > 3,
    [focused, suggestions, query.length]
  );

  useEffect(() => {
    const controller = new AbortController();
    if (query.trim().length < 4) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchSuggestions(query);
        if (!controller.signal.aborted) {
          setSuggestions(results);
        }
      } catch (err) {
        console.error("Suggestion fetch failed", err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(handle);
    };
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        autoComplete="off"
      >
        <label className="block text-sm font-medium text-gray-700">Enter a BC address</label>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base shadow-inner focus:border-brand focus:outline-none"
            placeholder="123 Main St, Vancouver, BC"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            autoComplete="street-address"
          />
          <button
            type="submit"
            className="rounded-xl bg-brand px-5 py-3 text-white shadow hover:bg-brand-dark"
          >
            Lookup
          </button>
        </div>
        {showSuggestions && (
          <div className="absolute z-10 mt-1 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="max-h-64 overflow-y-auto">
              {suggestions.map((s) => (
                <button
                  key={`${s.lat}-${s.lon}-${s.displayName}`}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => useExample(s.displayName)}
                  className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">{s.address}</span>
                  <span className="text-xs text-gray-600">{s.displayName}</span>
                </button>
              ))}
            </div>
            {loading && <div className="px-4 py-2 text-xs text-gray-600">Searching...</div>}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-700">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => useExample(ex)}
              className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 hover:border-brand hover:text-brand"
            >
              {ex}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
