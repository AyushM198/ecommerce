import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Needed for Neon serverless driver
  serverExternalPackages: ["@neondatabase/serverless"],

  // ✅ Ignore lint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Ignore type errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Allow "@/..." imports to resolve from /src
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
