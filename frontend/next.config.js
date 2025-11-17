/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
/*  api: {
    bodyParser: false
  },*/
  output: "standalone",
  experimental: {
    //serverActions: true,          // example experimental feature
    serverMinification: true,     // optional
    optimizeCss: true,            // optional
    //typedRoutes: true             // optional
  }
};

module.exports = nextConfig;
