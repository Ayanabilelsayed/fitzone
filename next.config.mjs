
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
    webpackMemoryOptimizations: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
