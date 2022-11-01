import highlighter from 'rehype-highlight';
import MDX from '@next/mdx';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGFM from 'remark-gfm';
import TOC from 'remark-toc';

const withMDX = MDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [
			remarkMath,
			remarkGFM,
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
			rehypeKatex,
		],
	},
});

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

export default withMDX(nextConfig);
