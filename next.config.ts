/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assurancetestingservices.in",
        pathname: "/assets/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
