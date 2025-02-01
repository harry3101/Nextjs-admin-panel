import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "img.clerk.com" },
      { hostname: "res.cloudinary.com" } // ✅ Add Cloudinary
    ],
  },
};

export default nextConfig;
