import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Workspace packages compile fresh through Next.js's bundler.
  transpilePackages: ['@maison/api', '@maison/db', '@maison/shared'],
  // Avoid bundling Prisma's native engine into edge/server-component builds.
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
