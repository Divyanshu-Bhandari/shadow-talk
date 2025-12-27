/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

  async headers() {
    // 🔓 DEV MODE
    // if (isDev) {
    //   return [];
    // }
    return [];
    // 🔒 PROD MODE
    // return [
    //   {
    //     source: '/:path*',
    //     headers: [
    //       {
    //         key: 'Content-Security-Policy',
    //         value: [
    //           "default-src 'self'",
    //           "script-src 'self'",
    //           "style-src 'self' 'unsafe-inline'",
    //           "img-src 'self' data: https:",
    //           "font-src 'self' data:",
    //           "connect-src 'self' https: wss://shadowtalk-ws.onrender.com",
    //           "frame-ancestors 'none'",
    //           "base-uri 'self'",
    //           "form-action 'self'",
    //         ].join('; '),
    //       },
    //       { key: 'X-Content-Type-Options', value: 'nosniff' },
    //       { key: 'X-Frame-Options', value: 'DENY' },
    //       { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    //       {
    //         key: 'Permissions-Policy',
    //         value: 'geolocation=(), microphone=(), camera=()',
    //       },
    //     ],
    //   },
    // ];
  },
};

module.exports = nextConfig;
