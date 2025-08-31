/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  turbopack: {},
  
  // Docker optimization
  output: 'standalone',
  
  // Fix workspace root warning
  outputFileTracingRoot: process.cwd(),
  
  // Webpack configuration for band app
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle in production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          websocket: {
            test: /[\\/]node_modules[\\/](@stomp|sockjs-client)[\\/]/,
            name: 'websocket',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_APP_NAME: 'Band Equipment Manager',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Image optimization for band photos
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/band-photos/**',
      },
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
        pathname: '/band-photos/**',
      },
    ],
  },
  
  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
  
  // Rewrites for API proxy in development
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/:path*`,
      },
      {
        source: '/ws/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/ws/:path*`,
      },
    ];
  },
  
  // External packages for server components
  serverExternalPackages: ['@stomp/stompjs', 'sockjs-client'],
};

export default nextConfig;
