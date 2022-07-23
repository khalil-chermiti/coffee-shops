/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["images.unsplash.com"],
  },
  // env : {
  //   NEXT_PUBLIC_API_KEY : process.env.NEXT_PUBLIC_API_KEY, 
  //   NEXT_PUBLIC_UNSPLASH_PUB : process.env.NEXT_PUBLIC_UNSPLASH_PUB,
  //   AIRTABLE_API_SECRET_KEY : process.env.AIRTABLE_API_SECRET_KEY,
  //   AIRTABLE_BASE_KEY : process.env.AIRTABLE_BASE_KEY,
  // }
};

module.exports = nextConfig;
