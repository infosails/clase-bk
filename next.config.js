/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  //experimental: {
  //  serverActions: true,
  //},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      }, 
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  }
};