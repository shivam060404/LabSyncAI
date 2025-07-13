/** @type {import('next').NextConfig} */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // Server Actions are available by default in Next.js 14.2.30
  
  webpack: (config, { isServer }) => {
    // Add copy plugin to copy Tesseract.js worker scripts
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'node_modules/tesseract.js/src/worker-script/node'),
            to: path.join(__dirname, '.next/worker-script/node')
          }
        ],
      })
    );
    
    return config;
  }
};

module.exports = nextConfig;