/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-belajar.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
