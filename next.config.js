// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {

//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "fra.cloud.appwrite.io",
//       },
//       {
//         protocol: "https",
//         hostname: "img.clerk.com",
//       },
//       {
//         protocol: "https",
//         hostname: "images.clerk.dev",
//       },
//     ],
//   },

//   typescript: {
//     // !! WARN !!
//     // Dangerously allow production builds to successfully complete even if
//     // your project has type errors.
//     // !! WARN !!
//     ignoreBuildErrors: true,
//   },
// };

// export default nextConfig;

// import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
