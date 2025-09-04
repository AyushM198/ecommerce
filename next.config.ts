import type { NextConfig } from "next";
import path from "path";
import "./src/lib/env"; // ✅ validate env vars on build

const nextConfig: NextConfig = {
  serverExternalPackages: ["@neondatabase/serverless"],

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  productionBrowserSourceMaps: true,
  reactStrictMode: true,
};

export default nextConfig;
