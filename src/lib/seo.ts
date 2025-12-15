export const SITE_ORIGIN = "https://bc-property-lookup.pages.dev";

export function canonicalUrl(pathname: string) {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN}${p}`;
}
