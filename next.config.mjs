/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "https://openapi.naver.com/v1/:path*",
      },
    ];
  },
  trailingSlash: true,
};

export default nextConfig;
