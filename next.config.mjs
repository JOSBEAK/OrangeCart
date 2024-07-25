/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@mui/material", "@mui/system", "@mui/icons-material"],
  images: {
    domains: ["cdn.dummyjson.com"],
  },
};

export default nextConfig;
