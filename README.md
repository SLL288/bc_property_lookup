# BC Property Intelligence Lookup

Production-ready MVP for looking up Metro Vancouver property context: municipality, zoning map links, ALR check, and assessment placeholder. Built with Next.js App Router, Tailwind, and Leaflet. No database required; deployable to Cloudflare Pages.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run locally:

```bash
npm run dev
```

3. Build:

```bash
npm run build
```

## Features
- Address search with example chips; geocoding via Nominatim (throttled to 1 req/sec with local cache).
- Municipality detection using simplified Metro Vancouver GeoJSON and turf point-in-polygon.
- ALR inclusion check with placeholder ALR layer.
- Zoning map links per municipality, shareable link + copyable summary.
- Leaflet map (client-only) showing the located point.
- Assessment module placeholder with clear messaging.
- Recent searches stored in localStorage.

## Data layers
- `data/metro_munis.geojson` — placeholder Metro Vancouver municipality polygons (swap with full dataset later).
- `data/alr_simplified.geojson` — placeholder ALR polygons (swap with full dataset later).

## Cloudflare Pages deployment
1. In Cloudflare Pages, create a new project and connect this repository.
2. Build command: `npm run build`
3. Build output directory: `.next`
4. Set `NODE_VERSION` to a recent LTS (e.g., 18+).
5. Enable "Framework preset: Next.js" if prompted so that Pages handles routing with the App Router.

## Notes
- No API keys required. If you add Mapbox later, keep Nominatim as fallback.
- Geocoding and caching live entirely on the client; no server state.
- Replace `metadataBase` and schema URLs with your production domain before launch.
- Verify zoning, bylaws, and legal constraints on official municipal sources; accuracy not guaranteed.
