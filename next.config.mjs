import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimize heavy icon libraries
    experimental: {
        optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
    },
    // Production optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
    },
};

export default withNextIntl(nextConfig);
