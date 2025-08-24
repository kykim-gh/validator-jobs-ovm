/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    allowedDevOrigins: ['65.21.156.254:3002']
  },
  env: {
    GITHUB_API_URL: 'https://api.github.com',
    POAP_API_URL: 'https://api.poap.tech',
    OVM_FACTORY_ADDRESS: '0x6F13d929C783a420AE4DC71C1dcc27A02038Ed09',
    HOODI_RPC_URL: 'https://rpc.hoodiscan.com'
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig

