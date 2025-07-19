/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
};


const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './i18n/messages/en.json'
  }
})

export default withNextIntl(nextConfig)

