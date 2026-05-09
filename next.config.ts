import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Specify Turbopack root to avoid warnings about external lockfiles
  turbopack: {
    root: "C:/Users/Admin/Downloads/CREDEX/ai-spend-audit"
  },
  /* config options here */
};

export default nextConfig;
