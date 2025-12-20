/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Configure allowed quality values for Next.js 16+ compatibility
    qualities: [75, 85, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Compression
  compress: true,
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // swcMinify is enabled by default in Next.js 15, no need to specify
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    // Use Turbopack for faster builds (enabled via --turbopack flag in scripts)
    // SECURITY: Disable server actions if not needed to reduce attack surface
    serverActions: {
      bodySizeLimit: '1mb', // Limit request body size to prevent DoS
    },
    // Optimize package imports
    optimizePackageImports: [
      '@heroicons/react',
      'react-icons',
      'swiper',
      'aos',
    ],
  },
  // Build optimizations
  swcMinify: true, // Already default in Next.js 15, but explicit
  // Reduce bundle size by excluding unnecessary modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tree shaking optimizations
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }
    return config;
  },
  // SECURITY: Additional security headers (complementary to middleware)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Download-Options',
            value: 'noopen'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
