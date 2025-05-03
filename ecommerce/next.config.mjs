/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
        {
          protocol: 'http',
          hostname: '**',
        }
      ],
    },
  };
  
  // Use ES module export syntax for .mjs files
  export default nextConfig;