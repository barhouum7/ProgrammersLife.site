const withPWA = require('next-pwa')({
  dest: 'public', // destination directory for the PWA files
  disable: process.env.NODE_ENV === 'development', // disable PWA in development mode
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
  runtimeCaching: [
    {
      urlPattern: /^https?.*/, // cache all network requests
      handler: 'NetworkFirst', // use the network first strategy
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200, // maximum number of entries in the cache
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        }
      }
    }
  ]
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,            // Enable SWC minification for improved performance
  compiler: {
      removeConsole: process.env.NODE_ENV !== "development"     // Remove console.log in production
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    remotePatterns: [
        { hostname: "media.graphassets.com"},
    ],
  },
  experimental: {
    serviceWorker: true,
    workerThreads: false,
    cpus: 1
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = withPWA(nextConfig)
