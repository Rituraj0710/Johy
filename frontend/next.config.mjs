/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Ensure proper chunk loading
    esmExternals: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for webpack chunk loading issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
