/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
            pathname: '/shufersal/**',
          },
          {
            protocol: 'https',
            hostname: 'media.shufersal.co.il',
            port: '',
            pathname: '/product_images/**', // נתיב מותאם לתמונות
          },
    ],
  },
};

export default nextConfig;
