import highlighter from 'rehype-highlight';
import MDX from '@next/mdx';

const withMDX = MDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [
			() => (tree, file) => {
				if (tree.children[0].type === 'thematicBreak') {
					const firstHeadingIndex = tree.children.findIndex(t => t.type === 'heading');
					if (firstHeadingIndex !== -1) {
						// we will mutate the tree.children by removing these nodes
						tree.children.splice(0, firstHeadingIndex + 1);
					}
				}
			},
		],
		rehypePlugins: [
			highlighter,
		],
	},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
	webpack: (config, options) => {
		config.experiments = {
			'topLevelAwait': true,
		};
		return config;
	},
	reactStrictMode: true,
	images: {
		unoptimized: true,
	},
};

export default withMDX(nextConfig);
