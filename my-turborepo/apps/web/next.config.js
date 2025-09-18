/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    "@repo/ui",
  ],
}

export default nextConfig;
