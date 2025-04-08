/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placehold.co'], // Add any other image domains you're using
    unoptimized: true, // Required for Netlify deployment
  },
  // Enable build cache
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  // Configure output for static export
  output: 'standalone',
  // Disable image optimization for Netlify
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 