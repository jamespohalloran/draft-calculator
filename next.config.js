/** @type {import('next').NextConfig} */
const nextConfig = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
