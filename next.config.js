/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA対応
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // 画像最適化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // 圧縮
  compress: true,

  // 本番環境での最適化
  swcMinify: true,

  // 出力設定
  output: 'standalone',
}

module.exports = nextConfig 