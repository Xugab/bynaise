import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan akses dari IP jaringan lokal (untuk test dari HP/perangkat lain)
  allowedDevOrigins: ["192.168.1.7", "localhost"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
