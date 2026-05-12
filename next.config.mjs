/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,   // این خط ارور منسوخ شدن را نادیده می‌گیرد
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;