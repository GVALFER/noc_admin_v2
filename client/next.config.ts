import type { NextConfig } from "next";

const API_BASE = (process.env.API_BASE ?? "http://localhost:3100").replace(/\/+$/, "");

const nextConfig: NextConfig = {
    devIndicators: false,
    async rewrites() {
        return [{ source: "/proxy/:path*", destination: `${API_BASE}/:path*` }];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.gravatar.com",
            },
        ],
    },
};

export default nextConfig;
