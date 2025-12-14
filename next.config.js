/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  webpack: (config) => {
    // Allow importing .geojson files as JSON modules for static data layers.
    config.module.rules.push({
      test: /\.geojson$/i,
      type: "json"
    });
    return config;
  }
};

module.exports = nextConfig;
