/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'localhost',
      // Add your ERPNext domain here
      'demo.erpnext.com',
      // Add any other domains you might use for images
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Proxy ERPNext API calls to avoid CORS issues in development
      {
        source: '/erpnext-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_ERPNEXT_BASE_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
