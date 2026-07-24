import './src/config/clinic';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_CLINIC_NAME: process.env.NEXT_PUBLIC_CLINIC_NAME,
  },
};

export default nextConfig;
