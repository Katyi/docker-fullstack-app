import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '212.113.120.58',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
