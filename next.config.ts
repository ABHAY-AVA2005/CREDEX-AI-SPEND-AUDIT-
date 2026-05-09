import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Specify Turbopack root to avoid warnings about external lockfiles
  // Use a relative path or remove if not strictly needed for build
  turbopack: {
    root: "./"
  },
  /* config options here */
};

export default nextConfig;
