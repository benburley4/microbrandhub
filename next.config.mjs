/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.microbrandhub.com' },
      { protocol: 'https', hostname: 'cdn.baltic-watches.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'cdn11.bigcommerce.com' },
      { protocol: 'https', hostname: 'halioswatches.com' },
      { protocol: 'https', hostname: 'www.traskawatch.com' },
      { protocol: 'https', hostname: 'serica-watches.com' },
      { protocol: 'https', hostname: 'montawatch.com' },
      { protocol: 'https', hostname: '**.myshopify.com' },
    ],
  },
}

export default nextConfig
