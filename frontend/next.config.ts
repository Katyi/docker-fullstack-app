import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '212.113.120.58',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'postcardfolio.ru',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
