/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
		esmExternals: true,
		runtime: 'nodejs',
	},
	pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
	reactStrictMode: true,
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
