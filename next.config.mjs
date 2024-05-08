/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: "https://openapi.naver.com/v1/:path*",
      },
    ];
  },
  // trailingSlash: true,
};

export default nextConfig;
